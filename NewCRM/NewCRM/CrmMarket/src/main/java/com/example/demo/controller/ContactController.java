package com.example.demo.controller;

import com.example.demo.dto.ContactRequestDTO;
import com.example.demo.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ContactRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(service.search(q));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        return ResponseEntity.ok(service.getStats());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody ContactRequestDTO dto) {
        return ResponseEntity.ok(service.update(id,dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Contact deleted");
    }
}
