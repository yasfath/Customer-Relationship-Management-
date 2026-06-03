package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.EmailService;
import com.example.demo.service.impl.TemplateService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/emails")
public class EmailController {
    @Autowired
    private  EmailService emailService;

    private final TemplateService templateService;

    public EmailController(EmailService emailService, TemplateService templateService) {
        this.emailService = emailService;
        this.templateService = templateService;
    }


    // 🔹 Create Email Template
    @PostMapping("/templates")
    public ResponseEntity<String> createTemplate(
            @RequestBody EmailTemplateRequestDTO dto) {

        emailService.createTemplate(dto);
        return ResponseEntity.ok("Email template created successfully");
    }

    @PostMapping("/addtemplates")
    public ResponseEntity<String> addTemplate(
            @RequestBody MessageTemplateDTO dto) {

        templateService.saveTemplate(dto);
        return ResponseEntity.ok("Template saved");
    }


    // 🔹 Send Email (REAL-TIME)
    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(
            @RequestBody EmailSendRequestDTO dto) {

        emailService.sendEmail(dto);
        return ResponseEntity.ok("Email sent successfully");
    }

    // 🔹 Get Email Logs
    @GetMapping("/logs")
    public ResponseEntity<List<EmailLogResponseDTO>> getLogs() {

        List<EmailLogResponseDTO> logs = emailService.getEmailLogs();
        return ResponseEntity.ok(logs);
    }


    // mail opean tracking
    @GetMapping("/track/open/{emailLogId}")
    public void trackOpen(@PathVariable Long emailLogId) {
        emailService.markEmailOpened(emailLogId);
    }


    //email clicking tracking
    @GetMapping("/track/click/{emailLogId}")
    public void trackClick(
            @PathVariable Long emailLogId,
            @RequestParam String url,
            HttpServletResponse response) throws IOException {

        emailService.markEmailClicked(emailLogId);
        response.sendRedirect(url);
    }


    // retry email
    @PostMapping("/retry-failed")
    public ResponseEntity<String> retryFailedEmails() {

        emailService.retryFailedEmails();
        return ResponseEntity.ok("Retry process executed");
    }

    //
    @PutMapping("/status/{emailLogId}")
    public String updateEmailStatus(
            @PathVariable Long emailLogId,
            @RequestBody EmailStatusUpdateDTO dto) {

        emailService.updateEmailStatus(emailLogId, dto.getStatus());
        return "Email status updated successfully";
    }



}
