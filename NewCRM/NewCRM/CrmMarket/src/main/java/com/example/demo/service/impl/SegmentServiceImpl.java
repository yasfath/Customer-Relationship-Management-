package com.example.demo.service.impl;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.SegmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SegmentServiceImpl implements SegmentService {

	@Autowired
    private  SegmentRepository segmentRepository;
	@Autowired
    private  SegmentContactRepository segmentContactRepository;
	@Autowired
    private ContactRepository contactRepository;

    @Override
    public SegmentResponseDTO createSegment(SegmentRequestDTO request) {

        Segment segment = new Segment();
        segment.setName(request.getName());
        segment.setDescription(request.getDescription());

        Segment savedSegment = segmentRepository.save(segment);

        SegmentResponseDTO response = new SegmentResponseDTO();
        response.setSegmentId(savedSegment.getSegmentId());
        response.setName(savedSegment.getName());
        response.setDescription(savedSegment.getDescription());

        return response;
    }

    @Override
    public void addContactToSegment(Long segmentId, Long contactId) {

        Segment segment = segmentRepository.findById(segmentId)
                .orElseThrow(() -> new RuntimeException("Segment not found"));

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        SegmentContact segmentContact = new SegmentContact();
        segmentContact.setSegment(segment);
        segmentContact.setContact(contact);

        segmentContactRepository.save(segmentContact);
    }

    @Override
    public List<SegmentContactDTO> getSegmentContacts(Long segmentId) {

        Segment segment = segmentRepository.findById(segmentId)
                .orElseThrow(() -> new RuntimeException("Segment not found"));

        return segmentContactRepository.findBySegment(segment)
                .stream()
                .map(sc -> {
                    SegmentContactDTO dto = new SegmentContactDTO();
                    dto.setContactId(sc.getContact().getContactId());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
