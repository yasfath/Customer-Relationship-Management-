package com.example.demo.service.impl;

import com.example.demo.dto.MessageTemplateDTO;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TemplateService {

    // In-memory template store (PHASE-1)
    private final Map<String, String> templates = new HashMap<>();

    // Add or update template
    public void saveTemplate(MessageTemplateDTO dto) {
        templates.put(dto.getTemplateName(), dto.getContent());
    }

    // Fetch template by name
    public String getTemplate(String templateName) {
        return templates.get(templateName);
    }
}
