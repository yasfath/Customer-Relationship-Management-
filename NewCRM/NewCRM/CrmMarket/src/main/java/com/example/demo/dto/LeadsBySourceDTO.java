package com.example.demo.dto;


public class LeadsBySourceDTO {
    private String source;   // EMAIL, SOCIAL, ORGANIC
    private Long count;

    public LeadsBySourceDTO() {
    }

    public LeadsBySourceDTO(String source, Long count) {
        this.source = source;
        this.count = count;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
