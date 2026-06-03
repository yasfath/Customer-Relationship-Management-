package com.example.demo.repository;

import com.example.demo.entity.Activity;
import com.example.demo.entity.ActivityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ActivityRepository
        extends JpaRepository<Activity, Long> {

    List<Activity> findTop10ByOrderByCreatedAtDesc();

    List<Activity> findTop10ByProfileIdOrderByCreatedAtDesc(String profileId);
    List<Activity> findByProfileId(String profileId);
    Long countBy();
    Long countByProfileId(String profileId);


    Long countByProfileIdAndStatus(String profileId, ActivityStatus status);
}
