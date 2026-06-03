package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDate;


@Data
@NoArgsConstructor
public class LeadAnalyticsDTO {


    private LocalDate date;
    private Long email;
    private Long socialMedia;
    private Long organic;

    public LeadAnalyticsDTO(
            Date date,
            Long email,
            Long socialMedia,
            Long organic
    ) {
        this.date = date.toLocalDate();
        this.email = email;
        this.socialMedia = socialMedia;
        this.organic = organic;
    }

    //  EXACT constructor Hibernate expects


}