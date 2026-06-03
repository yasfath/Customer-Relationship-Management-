package com.example.demo.dto;

public class SegmentRequestDTO {

    private String name;
    private String description;
    
    
	public SegmentRequestDTO(String name, String description) {
		super();
		this.name = name;
		this.description = description;
	}
	public SegmentRequestDTO() {
		super();
		// TODO Auto-generated constructor stub
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
