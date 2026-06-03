package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.DealDTO;
import com.example.demo.entity.Deal;
import com.example.demo.entity.DealStage;
import com.example.demo.entity.Lead;
import com.example.demo.repository.DealRepository;
import com.example.demo.repository.LeadRepository;
import com.example.demo.service.DealService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DealServiceImpl implements DealService {

    private final DealRepository dealRepository;
    private final LeadRepository leadRepository;

    public DealServiceImpl(DealRepository dealRepository, LeadRepository leadRepository) {
        this.dealRepository = dealRepository;
        this.leadRepository = leadRepository;
    }

    @Override
    public Deal createDeal(DealDTO dto) {

        Lead lead = leadRepository.findById(dto.getLeadId())
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        Deal deal = new Deal();
        deal.setDealName(dto.getDealName());
        deal.setAmount(dto.getAmount());
        deal.setCloseDate(dto.getCloseDate());
        deal.setLead(lead);
        deal.setStage(dto.getStage());

        return dealRepository.save(deal);
    }

    @Override
    public List<Deal> getAllDeals() {
        String profileId = TenantContext.getCurrentTenant();
        return dealRepository.findByProfileId(profileId);
    }

    @Override
    public List<Deal> getDealsByStage(String stage) {
        String profileId = TenantContext.getCurrentTenant();

        return dealRepository.findByStageAndProfileId(
                DealStage.valueOf(stage),
                profileId
        );
    }


    // UPDATE
    @Override
    public Deal updateDeal(Long id, DealDTO dto) {

        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        if (dto.getDealName() != null)
            deal.setDealName(dto.getDealName());

        if (dto.getAmount() != null)
            deal.setAmount(dto.getAmount());

        if (dto.getStage() != null)
            deal.setStage(dto.getStage());

        if (dto.getCloseDate() != null)
            deal.setCloseDate(dto.getCloseDate());

        if (dto.getLeadId() != null) {
            Lead lead = leadRepository.findById(dto.getLeadId())
                    .orElseThrow(() -> new RuntimeException("Lead not found"));
            deal.setLead(lead);
        }

        return dealRepository.save(deal);
    }

    // DELETE
    @Override
    public void deleteDeal(Long id) {
        dealRepository.deleteById(id);
    }

}
