package com.example.demo.service.impl;

import com.example.demo.entity.AutomationRule;
import com.example.demo.entity.EmailLog;
import com.example.demo.entity.EmailStatus;
import com.example.demo.entity.Lead;
import com.example.demo.repository.AutomationRuleRepository;
import com.example.demo.repository.EmailLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AutomationService {

    private final AutomationRuleRepository ruleRepository;
    private final TemplateService templateService;
    private final EmailLogRepository emailLogRepository;

    public AutomationService(
            AutomationRuleRepository ruleRepository,
            TemplateService templateService,
            EmailLogRepository emailLogRepository) {

        this.ruleRepository = ruleRepository;
        this.templateService = templateService;
        this.emailLogRepository = emailLogRepository;
    }

    public void handleEvent(String event, Lead lead) {

        List<AutomationRule> rules =
                ruleRepository.findByTriggerEventAndActiveTrue(event);

        for (AutomationRule rule : rules) {

            String template =
                    templateService.getTemplate(rule.getTemplateName());

            if (template == null || lead == null) continue;

            String message = template
                    .replace("{{name}}",
                            lead.getContact().getFirstName());

            System.out.println("AUTOMATION EMAIL SENT: " + message);

            EmailLog log = new EmailLog();
            log.setContact(lead.getContact());
            log.setEmail(lead.getContact().getEmail());
            log.setChannel(rule.getChannel());
            log.setMessage(message);
            log.setStatus(EmailStatus.SENT);
            log.setSentAt(LocalDateTime.now());

            emailLogRepository.save(log);
        }
    }
}
