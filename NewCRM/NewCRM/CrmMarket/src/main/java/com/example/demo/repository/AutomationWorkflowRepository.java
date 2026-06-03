package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.AutomationTrigger;
import com.example.demo.entity.AutomationWorkflow;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface AutomationWorkflowRepository
        extends JpaRepository<AutomationWorkflow, Long> {

    List<AutomationWorkflow> findByTriggerEventAndActive(
            AutomationTrigger trigger, Boolean active);
}
