package com.example.demo.controller;

import com.example.demo.dto.EventRequestDTO;
import com.example.demo.dto.EventStatus;
import com.example.demo.entity.Event;
import com.example.demo.service.EventService;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody EventRequestDTO dto) {
        try {
            service.createEvent(dto);
            return ResponseEntity.status(201).body("Event created");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody EventRequestDTO dto) {

        try {
            service.updateEvent(id, dto);
            return ResponseEntity.ok("Event updated");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        try {
            service.deleteEvent(id);
            return ResponseEntity.ok("Event deleted");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Event not found");
        }
    }

    // TABLE DATA
    @GetMapping("/{status}")
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PathVariable(required = false) EventStatus status) {

        return ResponseEntity.ok(
                service.getAllEvents(page, size, status)
        );
    }

    // GET ALL EVENTS (with optional status + pagination)
    @GetMapping("/getallevents")
    public ResponseEntity<Page<Event>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) EventStatus status) {

        return ResponseEntity.ok(
                service.getAllEvents(page, size, status)
        );
    }
}
