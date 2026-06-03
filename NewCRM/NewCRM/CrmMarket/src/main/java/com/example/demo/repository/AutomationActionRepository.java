package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.AutomationAction;
import com.example.demo.entity.AutomationWorkflow;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface AutomationActionRepository
        extends JpaRepository<AutomationAction, Long> {

    List<AutomationAction> findByWorkflow(AutomationWorkflow workflow);
}
