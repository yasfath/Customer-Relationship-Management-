package com.example.demo.controller;

import com.example.demo.dto.DealDTO;
import com.example.demo.entity.Deal;
import com.example.demo.service.DealService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@CrossOrigin
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    // Convert Qualified Lead → Deal
    @PostMapping("/create")
    public Deal createDeal(@RequestBody DealDTO dto) {
        return dealService.createDeal(dto);
    }

    @GetMapping("/getalldeals")
    public List<Deal> getAllDeals() {
//        System.out.println(dealService.getAllDeals());
        return dealService.getAllDeals();
    }

    @GetMapping("/stage/{stage}")
    public List<Deal> getDealsByStage(@PathVariable String stage) {
        return dealService.getDealsByStage(stage);
    }


    // UPDATE
    @PutMapping("/{id}")
    public Deal updateDeal(
            @PathVariable Long id,
            @RequestBody DealDTO dto) {

        return dealService.updateDeal(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteDeal(@PathVariable Long id) {
        dealService.deleteDeal(id);
        return "Deal deleted successfully";
    }
}
