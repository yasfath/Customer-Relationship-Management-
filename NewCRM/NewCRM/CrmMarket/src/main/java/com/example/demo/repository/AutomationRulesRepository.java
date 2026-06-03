package com.example.demo.repository;

import com.example.demo.entity.AutomationRules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutomationRulesRepository extends JpaRepository<AutomationRules,Long> {
    List<AutomationRules> findByObjectTypeAndEventTypeAndEnabledTrue(
            String objectType,
            String eventType
    );
}
