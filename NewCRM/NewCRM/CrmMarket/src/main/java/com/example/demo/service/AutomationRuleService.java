package com.example.demo.service;


import com.example.demo.dto.AutomationRuleDto;

public interface AutomationRuleService {

    void createRule(AutomationRuleDto dto);
    void handleEvent(String objectType, String eventType, Object entity);
}
