package com.example.demo.dto;

import com.example.demo.entity.CampaignStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public class CampaignStatusDTO {
    private CampaignStatus status;
    private Long count;

    public CampaignStatus getStatus() {
        return status;
    }

    public void setStatus(CampaignStatus status) {
        this.status = status;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public CampaignStatusDTO(CampaignStatus status, Long count) {
        this.status = status;
        this.count = count;
    }

    public CampaignStatusDTO() {
    }
}
