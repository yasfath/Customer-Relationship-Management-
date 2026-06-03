package com.example.demo.service;

import com.example.demo.dto.EventRequestDTO;
import com.example.demo.dto.EventResponseDTO;
import com.example.demo.dto.EventStatus;
import com.example.demo.entity.Event;
import org.springframework.data.domain.Page;

public interface EventService {

    void createEvent(EventRequestDTO dto);

    void updateEvent(Long id, EventRequestDTO dto);

    void deleteEvent(Long id);

    Page<Event> getAllEvents(int page, int size, EventStatus status);


    Page<EventResponseDTO> getAllEventsbystats(
            int page,
            int size,
            EventStatus status);
}
