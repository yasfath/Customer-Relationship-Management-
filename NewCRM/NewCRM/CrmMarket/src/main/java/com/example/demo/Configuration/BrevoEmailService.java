package com.example.demo.Configuration;

import com.example.demo.entity.Lead;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.ObjectMapper;


import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class BrevoEmailService {

    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${brevo.api-key}")
    private String apiKey;

    @Value("${mail.from.address}")
    private String fromAddress;

    @Value("${mail.from.name}")
    private String fromName;

    @Async
    public void sendHtmlMail(String to, String subject, String htmlBody) {

        try {

            Map<String, Object> payload = Map.of(
                    "sender", Map.of(
                            "email", fromAddress,
                            "name", fromName
                    ),
                    "to", List.of(
                            Map.of("email", to)
                    ),
                    "subject", subject,
                    "htmlContent", htmlBody
            );

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .header("api-key", apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 300) {
                throw new RuntimeException(
                        "Brevo Error: " + response.statusCode() + " - " + response.body()
                );
            }

            System.out.println("Email sent → " + to);
            System.out.println("Brevo Response: " + response.body());

        } catch (Exception e) {
            throw new RuntimeException("Email send failed: " + to, e);
        }
    }

    public void sendOtpEmail(String email, String name, String otp) {

        String subject = "Password Reset OTP";

        String htmlBody = buildOtpTemplate(name,otp);

        sendHtmlMail(email, subject, htmlBody);
    }


    public void sendWelcomeEmail(Lead lead) {

        String email = lead.getContact().getEmail();

        if (email == null || email.isBlank()) {
            return; // do not send if email missing
        }

        String subject = "Welcome to Our Service 🎉";

        String body = """
            <h2>Hi %s,</h2>
            <p>Thank you for showing interest.</p>
            <p>Our team will contact you shortly.</p>
            <br/>
            <p>Regards,<br/>CRM Team</p>
            """
                .formatted(
                        lead.getContact().getFirstName() != null
                                ? lead.getContact().getFirstName()
                                : "Customer"
                );

        sendHtmlMail(
                email,
                subject,
                body
        );
    }


    private String buildOtpTemplate(String name, String otp) {

        return """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset OTP</title>
    </head>
    <body style="font-family: Arial, sans-serif; background:#f3f4f6; padding:30px;">

    <table width="100%%" cellpadding="0" cellspacing="0">
    <tr>
    <td align="center">

    <table width="500px" style="background:#ffffff;border-radius:10px;padding:30px;">
    
    <tr>
    <td align="center" style="padding-bottom:20px;">
        <h2 style="color:#4f46e5;">Account Security</h2>
        <p>Password reset – one time passcode (OTP)</p>
    </td>
    </tr>

    <tr>
    <td>

    <p>Hello %s,</p>

    <p>We received a request to reset your password.</p>

    <p style="margin-top:20px;">Your OTP:</p>

    <div style="
        font-size:28px;
        letter-spacing:10px;
        font-weight:bold;
        padding:15px;
        background:#f1f5f9;
        border-radius:8px;
        text-align:center;
        margin:20px 0;
    ">
        %s
    </div>

    <p>This OTP is valid for <b>1 minute</b>.</p>

    <p>If you did not request a password reset, you can safely ignore this email.</p>

    <br>

    <p style="font-size:12px;color:#6b7280;">
    © 2025 Marketing CRM | All Rights Reserved
    </p>

    </td>
    </tr>

    </table>

    </td>
    </tr>
    </table>

    </body>
    </html>
    """.formatted(name, otp);
    }

}
