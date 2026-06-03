package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.*;
import com.example.demo.entity.Contact;
import com.example.demo.repository.ContactRepository;
import com.example.demo.service.ContactService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository repo;

    public ContactServiceImpl(ContactRepository repo) {
        this.repo = repo;
    }

    //  CREATE CONTACT + RETURN DASHBOARD
    @Override
    public ContactResponseDTO create(ContactRequestDTO dto) {

        Contact contact = new Contact();

        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setEmail(dto.getEmail());
        contact.setPhone(dto.getPhone());
        contact.setSource(dto.getSource());
        contact.setCompany(dto.getCompany());
        contact.setAssignedStaff(dto.getAssignedStaff());

        Contact saved = repo.save(contact);

        return mapToResponse(saved);
    }


    //  DASHBOARD STATS
    @Override
    public ContactStatsDTO getStats() {

        String profileId = TenantContext.getCurrentTenant();

        ContactStatsDTO dto = new ContactStatsDTO();

        dto.setTotalContacts(repo.countByProfileId(profileId));

        dto.setContactsWithActivities(
                repo.countContactsWithActivities(profileId)
        );

        dto.setLinkedLeads(
                repo.countLinkedLeads(profileId)
        );

        dto.setRecentlyAdded(
                repo.countByProfileIdAndCreatedAtAfter(
                        profileId,
                        LocalDateTime.now().minusDays(30)
                )
        );

        return dto;
    }


    //  GET ALL
    @Override
    public List<ContactTableDTO> getAll() {

        String profileId = TenantContext.getCurrentTenant();
        return repo.fetchContacts(profileId);
    }

    //  SEARCH
    @Override
    public List<ContactTableDTO> search(String keyword) {

        String profileId = TenantContext.getCurrentTenant();
        return repo.searchContacts(keyword,profileId);
    }

    // UPDATE
    @Override
    public ContactResponseDTO update(Long id, ContactRequestDTO dto) {

        Contact contact = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setPhone(dto.getPhone());
        contact.setCompany(dto.getCompany());
        contact.setAssignedStaff(dto.getAssignedStaff());

        return mapToResponse(repo.save(contact));
    }

    //  DELETE
    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    //  ENTITY → RESPONSE MAPPER
    private ContactResponseDTO mapToResponse(Contact c) {

        ContactResponseDTO r = new ContactResponseDTO();

        r.setId(c.getContactId());
        r.setName(c.getFirstName() + " " + c.getLastName());
        r.setEmail(c.getEmail());
        r.setPhone(c.getPhone());
        r.setCompany(c.getCompany());
        r.setAssignedStaff(c.getAssignedStaff());

        return r;
    }
}