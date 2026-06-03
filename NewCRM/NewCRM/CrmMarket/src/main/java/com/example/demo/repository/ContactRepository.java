package com.example.demo.repository;

import com.example.demo.dto.ContactTableDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Contact;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
//    Optional<Contact> findByEmail(String email);
//
//
//    Long countBy();
//
//    Long countByCreatedAtAfter(LocalDateTime date);
//
//    @Query("SELECT COUNT(DISTINCT a.contact.contactId) FROM Activity a")
//    Long countContactsWithActivities();
//
//    @Query("SELECT COUNT(DISTINCT l.contact.contactId) FROM Lead l")
//    Long countLinkedLeads();
//
//    @Query("""
//        SELECT new com.example.demo.dto.ContactTableDTO(
//          c.contactId,
//          CONCAT(c.firstName,' ',c.lastName),
//          c.email,
//          c.phone,
//          c.company,
//          l.leadId,
//          c.assignedStaff
//        )
//        FROM Contact c
//        LEFT JOIN Lead l ON l.contact = c
//    """)
//    List<ContactTableDTO> fetchContacts();
//
//    @Query("""
//        SELECT new com.example.demo.dto.ContactTableDTO(
//          c.contactId,
//          CONCAT(c.firstName,' ',c.lastName),
//          c.email,
//          c.phone,
//          c.company,
//          l.leadId,
//          c.assignedStaff
//        )
//        FROM Contact c
//        LEFT JOIN Lead l ON l.contact = c
//        WHERE
//          (:search IS NULL OR
//           LOWER(c.firstName) LIKE LOWER(CONCAT('%',:search,'%')) OR
//           LOWER(c.email) LIKE LOWER(CONCAT('%',:search,'%')))
//    """)
//    List<ContactTableDTO> searchContacts(String search);

    Optional<Contact> findByEmailAndProfileId(String email, String profileId);

    Long countByProfileId(String profileId);

    Long countByProfileIdAndCreatedAtAfter(String profileId, LocalDateTime date);

    @Query("""
        SELECT COUNT(DISTINCT a.contact.contactId)
        FROM Activity a
        WHERE a.contact.profileId = :profileId
    """)
    Long countContactsWithActivities(String profileId);

    @Query("""
        SELECT COUNT(DISTINCT l.contact.contactId)
        FROM Lead l
        WHERE l.contact.profileId = :profileId
    """)
    Long countLinkedLeads(String profileId);

    @Query("""
        SELECT new com.example.demo.dto.ContactTableDTO(
          c.contactId,
          CONCAT(c.firstName,' ',c.lastName),
          c.email,
          c.phone,
          c.company,
          l.leadId,
          c.assignedStaff
        )
        FROM Contact c
        LEFT JOIN Lead l ON l.contact = c
        WHERE c.profileId = :profileId
    """)
    List<ContactTableDTO> fetchContacts(String profileId);


    @Query("""
        SELECT new com.example.demo.dto.ContactTableDTO(
          c.contactId,
          CONCAT(c.firstName,' ',c.lastName),
          c.email,
          c.phone,
          c.company,
          l.leadId,
          c.assignedStaff
        )
        FROM Contact c
        LEFT JOIN Lead l ON l.contact = c
        WHERE c.profileId = :profileId
        AND (
          :search IS NULL OR
          LOWER(c.firstName) LIKE LOWER(CONCAT('%',:search,'%')) OR
          LOWER(c.email) LIKE LOWER(CONCAT('%',:search,'%'))
        )
    """)
    List<ContactTableDTO> searchContacts(String search, String profileId);
}
