package com.example.demo.dto;



public class MonthlyLeadsDTO {
    private Integer month;      // 1-12
    private String monthName;   // Jan
    private Long count;

    public MonthlyLeadsDTO(Integer month, Long count) {
        this.month = month;
        this.count = count;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public String getMonthName() {
        return monthName;
    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
