package com.example.demo.service.impl;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.AutomationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AutomationServiceImpl implements AutomationService {

	@Autowired
    private  AutomationWorkflowRepository workflowRepository;
	@Autowired
    private  AutomationActionRepository actionRepository;

    

    @Override
    public void createWorkflow(AutomationWorkflowRequestDTO dto) {

        AutomationWorkflow workflow = new AutomationWorkflow();
        workflow.setName(dto.getName());
        workflow.setTriggerEvent(
                AutomationTrigger.valueOf(dto.getTriggerEvent()));
        workflow.setActive(true);

        workflowRepository.save(workflow);
    }

    @Override
    public void addAction(Long workflowId, AutomationActionDTO dto) {

        AutomationWorkflow workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));

        AutomationAction action = new AutomationAction();
        action.setWorkflow(workflow);
        action.setActionType(
                AutomationActionType.valueOf(dto.getActionType()));
        action.setDelayMinutes(dto.getDelayMinutes());
        action.setActionValue(dto.getActionValue());

        actionRepository.save(action);
    }

    @Override
    public void triggerAutomation(AutomationTriggerDTO dto) {

        AutomationTrigger trigger =
                AutomationTrigger.valueOf(dto.getTriggerEvent());

        List<AutomationWorkflow> workflows =
                workflowRepository.findByTriggerEventAndActive(
                        trigger, true);

        for (AutomationWorkflow workflow : workflows) {
            List<AutomationAction> actions =
                    actionRepository.findByWorkflow(workflow);

            for (AutomationAction action : actions) {
                //  Placeholder for execution engine
                System.out.println(
                        "Executing action: " + action.getActionType()
                        + " for lead " + dto.getLeadId());
            }
        }
    }
}
