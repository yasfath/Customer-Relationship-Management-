package com.example.demo.repository;

import com.example.demo.entity.Deal;
import com.example.demo.entity.DealStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    List<Deal> findByStage(DealStage stage);

    List<Deal> findByProfileId(String profileId);

    List<Deal> findByStageAndProfileId(DealStage stage, String profileId);

    void deleteByDealIdAndProfileId(Long dealId, String profileId);
}
