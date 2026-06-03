package com.example.demo.controller;

import com.example.demo.dto.StaffRequestDTO;
import com.example.demo.dto.StaffTableDTO;
import com.example.demo.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin
public class StaffController {

    private final StaffService service;

    public StaffController(StaffService service) {
        this.service = service;
    }

    // CREATE USER
    @PostMapping("/create")
    public ResponseEntity<String> create(
            @RequestBody StaffRequestDTO dto) {

        service.createStaff(dto);
        return ResponseEntity.ok("User created");
    }

    // UPDATE USER
    @PutMapping("/{id}")
    public ResponseEntity<String> update(
            @PathVariable Long id,
            @RequestBody StaffRequestDTO dto) {

        service.updateStaff(id, dto);
        return ResponseEntity.ok("User updated");
    }

    // ACTIVATE / DEACTIVATE
    @PutMapping("/{id}/status")
    public ResponseEntity<String> toggleStatus(
            @PathVariable Long id) {

        service.changeStatus(id);
        return ResponseEntity.ok("Status changed");
    }

    // TABLE DATA
    @GetMapping("alllist")
    public ResponseEntity<List<StaffTableDTO>> list() {
        return ResponseEntity.ok(service.getAllStaff());
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {

        service.deleteStaff(id);
        return ResponseEntity.ok("User deleted");
    }

}
