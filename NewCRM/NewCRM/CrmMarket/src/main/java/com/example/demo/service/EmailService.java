package com.example.demo.service;

import com.example.demo.dto.EmailLogResponseDTO;
import com.example.demo.dto.EmailSendRequestDTO;
import com.example.demo.dto.EmailTemplateRequestDTO;
import com.example.demo.entity.EmailStatus;

import java.util.List;

public interface EmailService {

    // 🔹 Template Management
    void createTemplate(EmailTemplateRequestDTO dto);

    // 🔹 Send Email (real-time or triggered)
    void sendEmail(EmailSendRequestDTO dto);

    // 🔹 View email sending history
    List<EmailLogResponseDTO> getEmailLogs();

    // 🔹 Track email open
    void markEmailOpened(Long emailLogId);

    // email clicking tracking
    void markEmailClicked(Long emailLogId);

    void unsubscribeContact(Long contactId);

    void retryFailedEmails();

    // =========================
// UPDATE EMAIL STATUS
// =========================
    void updateEmailStatus(Long emailLogId, EmailStatus status);

    // 🔹 Track email click


    // 🔹 Unsubscribe contact from emails

}
