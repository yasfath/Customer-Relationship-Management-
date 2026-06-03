package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.StaffRequestDTO;
import com.example.demo.dto.StaffTableDTO;
import com.example.demo.dto.UpdateProfileRequestDTO;
import com.example.demo.entity.Staff;
import com.example.demo.entity.StaffRole;
import com.example.demo.entity.StaffStatus;
import com.example.demo.repository.StaffRepository;
import com.example.demo.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffServiceImpl implements StaffService {

    private final StaffRepository repo;
    private final PasswordEncoder encoder;
    private final StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    public StaffServiceImpl(StaffRepository repo,
                            PasswordEncoder encoder, StaffRepository staffRepo, StaffRepository staffRepository) {
        this.repo = repo;
        this.encoder = encoder;
        this.staffRepository = staffRepository;
    }

    @Override
    public void createStaff(StaffRequestDTO dto) {

        if (repo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Staff s = new Staff();

        s.setName(dto.getName());
        s.setEmail(dto.getEmail());
        s.setPassword(encoder.encode(dto.getPassword()));
        s.setRole(StaffRole.valueOf(dto.getRole().toUpperCase()));
        s.setStatus(StaffStatus.ACTIVE);

        // Optional fields
        s.setPhoneNumber(dto.getPhoneNumber());
        s.setLocation(dto.getLocation());
        s.setBio(dto.getBio());
        s.setProfileImage(dto.getProfileImage());

        repo.save(s);
    }

    @Override
    public void updateStaff(Long id, StaffRequestDTO dto) {

        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (dto.getName() != null) {
            staff.setName(dto.getName());
        }

        if (dto.getEmail() != null) {
            staff.setEmail(dto.getEmail());
        }

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            staff.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getRole() != null) {
            staff.setRole(StaffRole.valueOf(dto.getRole().toUpperCase()));
        }

        if (dto.getPhoneNumber() != null) {
            staff.setPhoneNumber(dto.getPhoneNumber());
        }

        if (dto.getLocation() != null) {
            staff.setLocation(dto.getLocation());
        }

        if (dto.getBio() != null) {
            staff.setBio(dto.getBio());
        }

        if (dto.getProfileImage() != null) {
            staff.setProfileImage(dto.getProfileImage());
        }

        staffRepository.save(staff);
    }

    @Override
    public void updateStaffProfile(Long staffId, UpdateProfileRequestDTO dto) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if(dto.getFullName()!=null)
            staff.setName(dto.getFullName());

        if(dto.getPhoneNumber()!=null)
            staff.setPhoneNumber(dto.getPhoneNumber());

        if(dto.getLocation()!=null)
            staff.setLocation(dto.getLocation());

        if(dto.getBio()!=null)
            staff.setBio(dto.getBio());

        if(dto.getProfileImageUrl()!=null)
            staff.setProfileImage(dto.getProfileImageUrl());

        staffRepository.save(staff);
    }

    @Override
    public void changeStatus(Long id) {

        Staff s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        s.setStatus(
                s.getStatus() == StaffStatus.ACTIVE
                        ? StaffStatus.INACTIVE
                        : StaffStatus.ACTIVE
        );

        repo.save(s);
    }

    @Override
    public List<StaffTableDTO> getAllStaff() {

        String profileId = TenantContext.getCurrentTenant();
        return repo.fetchStaffTable(profileId);
    }

    @Override
    public void deleteStaff(Long id) {

        Staff staff = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        repo.delete(staff);
    }
}