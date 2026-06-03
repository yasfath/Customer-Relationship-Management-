package com.example.demo.dto;


import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class LogTableDTO {

    private LocalDateTime date;


    private Long logId;
    private LocalDateTime createdAt;
    private String outcome;
    private String notes;

    private String personName;

    private String nextAction;
    private String activityType;

    private String nextActionType;
    private LocalDate nextActionDate;
    private LocalTime nextActionTime;

    private String status;
    public LogTableDTO() {
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public String getNextAction() {
        return nextAction;
    }

    public void setNextAction(String nextAction) {
        this.nextAction = nextAction;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LogTableDTO(LocalDateTime date, String outcome, String personName, String nextAction, String status) {
        this.date = date;
        this.outcome = outcome;
        this.personName = personName;
        this.nextAction = nextAction;
        this.status = status;
    }

    public LogTableDTO(
            Long logId,
            LocalDateTime createdAt,
            String outcome,
            String notes,
            String personName,
            String nextAction,
            String activityType,
            String nextActionType,
            LocalDate nextActionDate,
            LocalTime nextActionTime,
            String status
    ) {
        this.logId = logId;
        this.createdAt = createdAt;
        this.outcome = outcome;
        this.notes = notes;
        this.personName = personName;
        this.nextAction = nextAction;
        this.activityType = activityType;
        this.nextActionType = nextActionType;
        this.nextActionDate = nextActionDate;
        this.nextActionTime = nextActionTime;
        this.status = status;
    }
}
