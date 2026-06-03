package com.example.demo.dto;

public class SegmentResponseDTO {

    private Long segmentId;
    private String name;
    private String description;
	public SegmentResponseDTO(Long segmentId, String name, String description) {
		super();
		this.segmentId = segmentId;
		this.name = name;
		this.description = description;
	}
	public SegmentResponseDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getSegmentId() {
		return segmentId;
	}
	public void setSegmentId(Long segmentId) {
		this.segmentId = segmentId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
}
