package com.example.demo.service;

import com.example.demo.dto.DealDTO;
import com.example.demo.entity.Deal;

import java.util.List;

public interface DealService {

    Deal createDeal(DealDTO dto);

    List<Deal> getAllDeals();

    List<Deal> getDealsByStage(String stage);

    Deal updateDeal(Long id, DealDTO dto);

    void deleteDeal(Long id);

}
