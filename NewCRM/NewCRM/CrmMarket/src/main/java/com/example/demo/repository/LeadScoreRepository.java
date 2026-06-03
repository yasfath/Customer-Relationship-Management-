package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Lead;
import com.example.demo.entity.LeadScore;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface LeadScoreRepository
        extends JpaRepository<LeadScore, Long> {

    Optional<LeadScore> findByLead(Lead lead);
}
