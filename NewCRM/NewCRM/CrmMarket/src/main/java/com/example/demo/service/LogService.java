package com.example.demo.service;

import com.example.demo.dto.LogRequestDTO;
import com.example.demo.dto.LogTableDTO;

import java.util.List;

public interface LogService {
    void logActivity(LogRequestDTO dto);

    List<LogTableDTO> getDashboardActivities();
}
