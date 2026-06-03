package com.example.demo.repository;

import com.example.demo.entity.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface EmailTemplateRepository
        extends JpaRepository<EmailTemplate, Long> {

    // 🔹 Find template by name
    Optional<EmailTemplate> findByName(String name);

    // 🔹 Get only active templates
    Optional<EmailTemplate> findByTemplateIdAndActiveTrue(Long templateId);
}
