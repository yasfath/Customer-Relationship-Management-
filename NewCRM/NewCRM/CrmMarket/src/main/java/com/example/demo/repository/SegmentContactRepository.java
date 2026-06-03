package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Segment;
import com.example.demo.entity.SegmentContact;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SegmentContactRepository extends JpaRepository<SegmentContact, Long> {

    List<SegmentContact> findBySegment(Segment segment);
}
