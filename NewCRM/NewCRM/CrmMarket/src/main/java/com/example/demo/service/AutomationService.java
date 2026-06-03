package com.example.demo.service;

import com.example.demo.dto.*;

public interface AutomationService {

    void createWorkflow(AutomationWorkflowRequestDTO dto);

    void addAction(Long workflowId, AutomationActionDTO dto);

    void triggerAutomation(AutomationTriggerDTO dto);
}
