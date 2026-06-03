package com.example.demo.service;

import com.example.demo.dto.*;

import java.util.List;

public interface ContactService {

    //  CREATE CONTACT + RETURN DASHBOARD
    ContactResponseDTO create(ContactRequestDTO dto);

    List<ContactTableDTO> getAll();

    List<ContactTableDTO> search(String keyword);

    ContactStatsDTO getStats();

    ContactResponseDTO update(Long id, ContactRequestDTO dto);

    void delete(Long id);
}
