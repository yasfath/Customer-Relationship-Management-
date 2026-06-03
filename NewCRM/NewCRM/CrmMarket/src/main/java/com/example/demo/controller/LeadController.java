package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.LeadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    // =========================
    // CREATE LEAD
    // =========================
    @PostMapping("/create")
    public ResponseEntity<LeadResponseDTO> createLead(
            @RequestBody LeadRequestDTO request) {

        LeadResponseDTO response = leadService.createLead(request);
        return ResponseEntity.ok(response);
    }


    // =========================
    // UPDATE LEAD STATUS
    // =========================
    @PutMapping("/update/stats/{id}")
    public ResponseEntity<String> updateLeadStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        leadService.updateLeadStatus(id, status);

        return ResponseEntity.ok("Lead status updated successfully");
    }

    // =========================
    // ADD INTERACTION
    // =========================
    @PostMapping("/{id}/interactions")
    public ResponseEntity<String> addInteraction(
            @PathVariable Long id,
            @RequestBody LeadInteractionDTO dto) {

        leadService.addInteraction(id, dto);
        return ResponseEntity.ok("Interaction added successfully");
    }

    // =========================
    // LEAD DASHBOARD STATS
    // =========================
    @GetMapping("/stats")
    public ResponseEntity<LeadStatsDTO> getLeadStats() {

        return ResponseEntity.ok(
                leadService.getLeadStats()
        );
    }

    // =========================
    // GET ALL LEADS (TABLE VIEW)
    // =========================
    @GetMapping("/getallleads")
    public ResponseEntity<List<LeadTableDTO>> getAllLeads() {

        return ResponseEntity.ok(
                leadService.getAllLeads()
        );
    }

    // =========================
    // FILTER LEADS
    // =========================
    @GetMapping("/filter")
    public ResponseEntity<List<LeadTableDTO>> filterLeads(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignedTo,
            @RequestParam(required = false) String search) {

        return ResponseEntity.ok(
                leadService.filterLeads(status, assignedTo, search)
        );
    }

    // =========================
    // 🔮 FUTURE SCOPE 3
    // AUTO SEGMENT LEAD
    // =========================
    @PutMapping("/{id}/auto-segment")
    public ResponseEntity<String> autoSegmentLead(
            @PathVariable Long id) {

        leadService.autoSegmentLead(id);
        return ResponseEntity.ok("Lead auto-segmented successfully");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<LeadResponseDTO> updateLead(
            @PathVariable Long id,
            @RequestBody LeadRequestDTO request) {

        LeadResponseDTO response = leadService.updateLead(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLead(@PathVariable Long id) {

        leadService.deleteLead(id);
        return ResponseEntity.ok("Lead deleted successfully");
    }
}
