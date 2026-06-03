package com.example.demo.repository;

import com.example.demo.entity.ChatRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {

    @Query("""
    SELECT m.roomId FROM ChatRoomMember m
    WHERE m.staffId = :staffId
    """)
    List<Long> findRoomIdsByStaff(Long staffId);

    List<ChatRoomMember> findByStaffId(Long staffId);

    void deleteByRoomId(Long roomId);

    boolean existsByRoomIdAndStaffId(Long roomId, Long staffId);
}