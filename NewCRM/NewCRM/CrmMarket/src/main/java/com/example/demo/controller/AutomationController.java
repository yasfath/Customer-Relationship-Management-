package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.AutomationRuleService;
import com.example.demo.service.AutomationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/automation")
public class AutomationController {

	@Autowired
    private  AutomationService automationService;

    @Autowired
    private AutomationRuleService automationRuleService;

    // 🔹 Create trigger event Workflow
    @PostMapping("/workflows")
    public ResponseEntity<String> createWorkflow(
            @RequestBody AutomationWorkflowRequestDTO dto) {

        automationService.createWorkflow(dto);
        return ResponseEntity.ok("Workflow created");
    }

    // 🔹 Add Action to Workflow
    @PostMapping("/workflows/{id}/actions")
    public ResponseEntity<String> addAction(
            @PathVariable Long id,
            @RequestBody AutomationActionDTO dto) {

        automationService.addAction(id, dto);
        return ResponseEntity.ok("Action added");
    }

    // 🔹 Trigger Automation
    @PostMapping("/trigger")
    public ResponseEntity<String> triggerAutomation(
            @RequestBody AutomationTriggerDTO dto) {

        automationService.triggerAutomation(dto);
        return ResponseEntity.ok("Automation triggered");
    }

    @PostMapping
    public ResponseEntity<String> createRule(
            @RequestBody AutomationRuleDto dto) {

        automationRuleService.createRule(dto);

        return ResponseEntity.ok("Automation rule created successfully");
    }
}
