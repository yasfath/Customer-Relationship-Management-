package com.example.demo.repository;

import com.example.demo.entity.AIPredictionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIPredictionLogRepository
        extends JpaRepository<AIPredictionLog, Long> {
}
