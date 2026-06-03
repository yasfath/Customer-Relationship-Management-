	package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.SegmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/segments")
public class SegmentController {

    private final SegmentService segmentService;

    public SegmentController(SegmentService segmentService) {
        this.segmentService = segmentService;
    }

    // 🔹 Create Segment
    @PostMapping("/create")
    public ResponseEntity<SegmentResponseDTO> createSegment(
            @RequestBody SegmentRequestDTO request) {
        return ResponseEntity.ok(segmentService.createSegment(request));
    }

    // 🔹 Add Contact to Segment
    @PostMapping("/{segmentId}/contacts")
    public ResponseEntity<String> addContact(
            @PathVariable Long segmentId,
            @RequestBody SegmentContactDTO dto) {

        segmentService.addContactToSegment(segmentId, dto.getContactId());
        return ResponseEntity.ok("Contact added to segment");
    }

    // 🔹 Get Segment Contacts
    @GetMapping("/{segmentId}/contacts")
    public ResponseEntity<List<SegmentContactDTO>> getSegmentContacts(
            @PathVariable Long segmentId) {

        return ResponseEntity.ok(segmentService.getSegmentContacts(segmentId));
    }
}
