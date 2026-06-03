package com.example.demo.repository;

import com.example.demo.dto.EventStatus;
import com.example.demo.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Search
    Page<Event> findBySubjectContainingIgnoreCaseOrContactContainingIgnoreCase(
            String subject,
            String contact,
            Pageable pageable
    );

    Page<Event> findByProfileId(String profileId, Pageable pageable);

    Page<Event> findByStatusAndProfileId(EventStatus status, String profileId, Pageable pageable);

    // Filter by Status
    Page<Event> findByStatus(EventStatus status, Pageable pageable);

    // Combined
    Page<Event> findByStatusAndSubjectContainingIgnoreCase(
            EventStatus status,
            String subject,
            Pageable pageable
    );
}
