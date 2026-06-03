package com.example.demo.service.impl;

import com.example.demo.Configuration.BrevoEmailService;
import com.example.demo.dto.AutomationRuleDto;
import com.example.demo.entity.AutomationRule;
import com.example.demo.entity.AutomationRules;
import com.example.demo.entity.EmailTemplate;
import com.example.demo.entity.Lead;
import com.example.demo.repository.AutomationRulesRepository;
import com.example.demo.repository.EmailTemplateRepository;
import com.example.demo.service.AutomationRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AutomationRuleServiceImpl implements AutomationRuleService {

    private final BrevoEmailService brevoEmailService;
   private final EmailTemplateRepository templateRepository;
   private final AutomationRulesRepository automationRulesRepository;


    public AutomationRuleServiceImpl(BrevoEmailService brevoEmailService, EmailTemplateRepository templateRepository, AutomationRulesRepository automationRulesRepository) {
        this.brevoEmailService = brevoEmailService;
        this.templateRepository = templateRepository;
        this.automationRulesRepository = automationRulesRepository;
    }

    @Override
    public void createRule(AutomationRuleDto dto) {

        EmailTemplate template = templateRepository.findById(dto.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Template not found"));

        AutomationRules rule = new AutomationRules();
        rule.setObjectType(dto.getObjectType());
        rule.setEventType(dto.getEventType());
        rule.setTemplate(template);
        rule.setEnabled(dto.isEnabled());

        automationRulesRepository.save(rule);
    }


    @Override
    public void handleEvent(String objectType, String eventType, Object entity) {

        List<AutomationRules> rules =
                automationRulesRepository
                        .findByObjectTypeAndEventTypeAndEnabledTrue(
                                objectType,
                                eventType
                        );

        for (AutomationRules rule : rules) {

            EmailTemplate template = rule.getTemplate();

            if ("LEAD".equals(objectType) && entity instanceof Lead lead) {

                String email = lead.getContact().getEmail();
                if (email == null || email.isBlank()) continue;

                // 1️⃣ Replace variables
                String processedBody = processTemplate(template.getBody(), lead);

                // 2️⃣ Wrap inside UI layout
                String finalHtml = buildEmailLayout(processedBody);

                // 3️⃣ Send full HTML
                brevoEmailService.sendHtmlMail(
                        email,
                        template.getSubject(),
                        finalHtml
                );
            }
        }
    }
    private String processTemplate(String body, Lead lead) {

        String fullName =
                safe(lead.getContact().getFirstName()) + " " +
                        safe(lead.getContact().getLastName());

        String leadStatus =
                lead.getStatus() != null ? lead.getStatus().name() : "";

        String campaignName =
                lead.getCampaign() != null ? safe(lead.getCampaign().getName()) : "";

        String leadDetailsUrl =
                "https://yourcrm.com/leads/" + lead.getLeadId(); // adjust if needed

        Map<String, String> variables = Map.of(
                "firstName", safe(lead.getContact().getFirstName()),
                "lastName", safe(lead.getContact().getLastName()),
                "fullName", fullName,
                "email", safe(lead.getContact().getEmail()),
                "phone", safe(lead.getContact().getPhone()),
                "leadStatus", leadStatus,
                "campaignName", campaignName,
                "leadDetailsUrl", leadDetailsUrl
        );

        for (Map.Entry<String, String> entry : variables.entrySet()) {
            body = body.replace(
                    "{{" + entry.getKey() + "}}",
                    entry.getValue()
            );
        }

        return body;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }


    private String buildEmailLayout(String renderedBody) {

        return """
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial, sans-serif;">
        
            <div style="max-width:600px;margin:30px auto;background:white;border-radius:10px;overflow:hidden;">
                
                <!-- HEADER -->
                <div style="background:linear-gradient(90deg,#8e7cc3,#6a5acd);padding:30px;text-align:center;color:white;">
                    <h2 style="margin:0;">Marketing Team</h2>
                    <p style="margin:5px 0 0 0;font-size:13px;">Call / Email Follow-up Response</p>
                </div>

                <!-- BODY -->
                <div style="padding:30px;font-size:14px;color:#333;">
                    %s
                </div>

                <!-- FOOTER -->
                <div style="background:#f4f4f4;padding:20px;text-align:center;font-size:12px;color:#777;">
                    © 2026 Marketing CRM | All Rights Reserved
                </div>

            </div>

        </body>
        </html>
        """.formatted(renderedBody);
    }
}
