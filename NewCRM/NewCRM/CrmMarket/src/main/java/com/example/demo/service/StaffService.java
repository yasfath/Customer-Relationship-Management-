package com.example.demo.service;

import com.example.demo.dto.StaffRequestDTO;
import com.example.demo.dto.StaffTableDTO;
import com.example.demo.dto.UpdateProfileRequestDTO;

import java.util.List;

public interface StaffService {

    void createStaff(StaffRequestDTO dto);

    void updateStaff(Long id, StaffRequestDTO dto);

    void updateStaffProfile(Long staffId, UpdateProfileRequestDTO dto);

    void changeStatus(Long id);

    List<StaffTableDTO> getAllStaff();

    void deleteStaff(Long id);
}
