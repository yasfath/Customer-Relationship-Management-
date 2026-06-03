package com.example.demo.service;

import com.example.demo.dto.*;

import java.util.List;

public interface SegmentService {

    SegmentResponseDTO createSegment(SegmentRequestDTO request);

    void addContactToSegment(Long segmentId, Long contactId);

    List<SegmentContactDTO> getSegmentContacts(Long segmentId);
}
