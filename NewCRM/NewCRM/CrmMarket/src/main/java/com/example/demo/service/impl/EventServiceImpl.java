package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.EventRequestDTO;
import com.example.demo.dto.EventResponseDTO;
import com.example.demo.dto.EventStatus;
import com.example.demo.entity.Contact;

import com.example.demo.entity.Event;
import com.example.demo.repository.ContactRepository;
import com.example.demo.repository.EmailLogRepository;
import com.example.demo.repository.EventRepository;
import com.example.demo.service.EventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository repo;
    private final ContactRepository contactRepo;

    private final EmailLogRepository emailLogRepo;

    public EventServiceImpl(EventRepository repo,
                            ContactRepository contactRepo, EmailLogRepository emailLogRepo) {
        this.repo = repo;
        this.contactRepo = contactRepo;
        this.emailLogRepo = emailLogRepo;
    }
    @Override
    public void createEvent(EventRequestDTO dto) {

        Event e = new Event();
        mapDtoToEntity(dto, e);
        repo.save(e);
    }

    @Override
    public void updateEvent(Long id, EventRequestDTO dto) {

        Event e = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        mapDtoToEntity(dto, e);
        repo.save(e);
    }

    @Override
    public void deleteEvent(Long id) {
        repo.deleteById(id);
    }


    @Override
    public Page<Event> getAllEvents(int page, int size, EventStatus status) {

        String profileId = TenantContext.getCurrentTenant();

        Pageable pageable = PageRequest.of(page, size, Sort.by("eventId").descending());

        if (status != null) {
            return repo.findByStatusAndProfileId(status, profileId, pageable);
        }

        return repo.findByProfileId(profileId, pageable);
    }

    @Override
    public Page<EventResponseDTO> getAllEventsbystats(
            int page,
            int size,
            EventStatus status) {

        String profileId = TenantContext.getCurrentTenant();

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());

        Page<Event> events;

        if (status != null) {
            events = repo.findByStatusAndProfileId(status, profileId, pageable);
        } else {
            events = repo.findByProfileId(profileId, pageable);
        }

        return events.map(e -> {

            EventResponseDTO dto = new EventResponseDTO();

            dto.setId(e.getEventId());
            dto.setDate(e.getDate());
            dto.setTime(e.getTime());
            dto.setType(e.getType());
            dto.setSubject(e.getSubject());
            dto.setStatus(e.getStatus());

            dto.setContactId(e.getContact().getContactId());
            dto.setContactName(
                    e.getContact().getFirstName() + " " +
                            e.getContact().getLastName()
            );

            dto.setEmail(e.getContact().getEmail());
            dto.setPhone(e.getContact().getPhone());

            return dto;
        });
    }

    private void mapDtoToEntity(EventRequestDTO dto, Event e) {

        Contact contact = contactRepo.findById(dto.getContactId())
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        e.setDate(dto.getDate());
        e.setTime(dto.getTime());
        e.setType(dto.getType());
        e.setSubject(dto.getSubject());
        e.setContact(contact);
        e.setStatus(dto.getStatus());
    }







}
