package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.dto.EmailLogResponseDTO;
import com.example.demo.dto.EmailSendRequestDTO;
import com.example.demo.dto.EmailTemplateRequestDTO;
import com.example.demo.entity.Campaign;
import com.example.demo.entity.Contact;
import com.example.demo.entity.EmailLog;
import com.example.demo.entity.EmailStatus;
import com.example.demo.entity.EmailTemplate;
import com.example.demo.repository.CampaignRepository;
import com.example.demo.repository.ContactRepository;
import com.example.demo.repository.EmailLogRepository;
import com.example.demo.repository.EmailTemplateRepository;
import com.example.demo.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private EmailTemplateRepository templateRepository;

    @Autowired
    private EmailLogRepository emailLogRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private JavaMailSender mailSender;



    // =========================
    // CREATE TEMPLATE
    // =========================
    @Override
    public void createTemplate(EmailTemplateRequestDTO dto) {

        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new RuntimeException("Template name is required");
        }
        if (dto.getSubject() == null || dto.getSubject().isBlank()) {
            throw new RuntimeException("Template subject is required");
        }
        if (dto.getBody() == null || dto.getBody().isBlank()) {
            throw new RuntimeException("Template body is required");
        }

        EmailTemplate template = new EmailTemplate();
        template.setName(dto.getName());
        template.setSubject(dto.getSubject());
        template.setBody(dto.getBody());

        templateRepository.save(template);
    }

    // =========================
    // SEND EMAIL (TEMPLATE BASED)
    // =========================
    @Override
    public void sendEmail(EmailSendRequestDTO dto) {

        // ================= VALIDATION =================
        if (dto.getContactId() == null) {
            throw new RuntimeException("Contact ID required");
        }

        if (dto.getTemplateId() == null) {
            throw new RuntimeException("Template ID required");
        }

        // ================= FETCH CONTACT =================
        Contact contact = contactRepository.findById(dto.getContactId())
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (contact.getEmail() == null || contact.getEmail().isBlank()) {
            throw new RuntimeException("Contact email missing");
        }

        // ================= FETCH TEMPLATE =================
        EmailTemplate template = templateRepository
                .findById(dto.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Template not found"));

        // ================= FETCH CAMPAIGN (OPTIONAL) =================
        Campaign campaign = null;

        if (dto.getCampaignId() != null) {
            campaign = campaignRepository
                    .findById(dto.getCampaignId())
                    .orElse(null);   // no exception
        }

        // ================= MESSAGE BUILD =================
        String finalMessage = template.getBody()
                .replace("{{firstName}}",
                        contact.getFirstName() != null
                                ? contact.getFirstName()
                                : "Customer");

        // ================= CREATE EMAIL LOG =================
        EmailLog log = new EmailLog();

        log.setContact(contact);
        log.setCampaign(campaign);
        log.setEmail(contact.getEmail());
        log.setChannel("EMAIL");
        log.setMessage(finalMessage);
        log.setStatus(EmailStatus.PENDING);
        log.setOutcome(dto.getOutcome());
        log.setNextAction(dto.getNextAction());
        log.setRetryCount(0);
        log.setOpened(false);
        log.setClicked(false);
        log.setSentAt(LocalDateTime.now());

        // ================= SEND EMAIL =================
        try {

            sendRealEmail(
                    contact.getEmail(),
                    template.getSubject(),
                    finalMessage
            );

            log.setStatus(EmailStatus.SENT);

        } catch (Exception e) {

            log.setStatus(EmailStatus.FAILED);
            log.setErrorMessage(e.getMessage());
        }

        // ================= SAVE LOG =================
        emailLogRepository.save(log);

        System.out.println(
                "Saved EmailLog ID = " + log.getEmailId()
        );
    }
    // =========================
    // SMTP SEND
    // =========================
    private void sendRealEmail(String to, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("rohithjp221103@gmail.com"); // must match SMTP username
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    // =========================
    // EMAIL LOGS
    // =========================
    // =========================
// EMAIL LOGS
// =========================
    @Override
    public List<EmailLogResponseDTO> getEmailLogs() {

        return emailLogRepository.findAll()
                .stream()
                .map(log -> new EmailLogResponseDTO(
                        log.getEmailId(),
                        log.getContact() != null ? log.getContact().getEmail() : null,
                        log.getStatus(),
                        log.getSentAt() != null ? log.getSentAt().toLocalDate() : null,
                        log.getContact() != null ? log.getContact().getFirstName() : null,
                        log.getOutcome(),        // make sure field exists in entity
                        log.getNextAction()
                ))
                .toList();
    }

    // =========================
    // FUTURE FEATURES
    // =========================
    // mail open tracking
    @Override
    public void markEmailOpened(Long emailLogId) {
        EmailLog log = emailLogRepository.findById(emailLogId)
                .orElseThrow(() -> new RuntimeException("Email log not found"));

        log.setOpened(true);
        emailLogRepository.save(log);
    }

    // email clicking tracking
    @Override
    public void markEmailClicked(Long emailLogId) {
        EmailLog log = emailLogRepository.findById(emailLogId)
                .orElseThrow(() -> new RuntimeException("Email log not found"));

        log.setClicked(true);
        emailLogRepository.save(log);
    }

    @Override
    public void unsubscribeContact(Long contactId) {
        // unsubscribe logic later
    }


    @Override
    @Scheduled(fixedDelay = 300000) // every 5 minutes
    public void retryFailedEmails() {

        List<EmailLog> failedEmails =
                emailLogRepository.findByStatus(EmailStatus.FAILED);

        for (EmailLog log : failedEmails) {

            try {
                sendRealEmail(
                        log.getEmail(),
                        "Retry Email",
                        log.getMessage()
                );

                log.setStatus(EmailStatus.SENT);
                log.setErrorMessage(null);

            } catch (Exception e) {

                log.setRetryCount(
                        log.getRetryCount() == null ? 1 : log.getRetryCount() + 1
                );
                log.setErrorMessage(e.getMessage());

                // Optional hard limit
                if (log.getRetryCount() >= 3) {
                    log.setStatus(EmailStatus.PENDING);                }
            }

            emailLogRepository.save(log);
        }
    }

    // =========================
// UPDATE EMAIL STATUS
// =========================
    @Override
    public void updateEmailStatus(Long emailLogId, EmailStatus status) {

        if (status == null) {
            throw new RuntimeException("Email status is required");
        }

        EmailLog log = emailLogRepository.findById(emailLogId)
                .orElseThrow(() -> new RuntimeException("Email log not found"));

        log.setStatus(status);

        // Optional tracking logic
        if (status == EmailStatus.SENT) {
            log.setSentAt(LocalDateTime.now());
        }

        emailLogRepository.save(log);
    }

    // =========================
// PASSWORD RESET EMAIL
// =========================
    public void sendPasswordResetEmail(String to, String token) {

        String resetLink =
                "http://localhost:587/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("rohithjp221103@gmail.com");
        message.setTo(to);
        message.setSubject("Password Reset Request");

        message.setText(
                "Hello,\n\n" +
                        "Click the link below to reset your password:\n"
                        + resetLink +
                        "\n\nThis link will expire in 15 minutes."
        );

        mailSender.send(message);
    }




}
