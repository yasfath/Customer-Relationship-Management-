package com.example.demo.repository;

import com.example.demo.dto.StaffTableDTO;
import com.example.demo.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    boolean existsByEmail(String email);

    @Query("""
      SELECT new com.example.demo.dto.StaffTableDTO(
        s.staffId,
        s.name,
        s.email,
        s.role,
        s.status
      )
      FROM Staff s
      WHERE s.profileId = :profileId
    """)
    List<StaffTableDTO> fetchStaffTable(String profileId);

    long countByProfileId(String profileId);

    Optional<Staff> findByEmail(String email);

    Optional<Staff> findByResetToken(String token);
}