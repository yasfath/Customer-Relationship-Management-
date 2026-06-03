package com.example.demo.repository;

import com.example.demo.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    @Query("""
SELECT r
FROM ChatRoom r
JOIN ChatRoomMember m ON r.id = m.roomId
WHERE r.profileId = :profileId
AND m.profileId = :profileId
AND m.staffId = :staffId
""")
    List<ChatRoom> findRoomsForStaff(String profileId, Long staffId);
}