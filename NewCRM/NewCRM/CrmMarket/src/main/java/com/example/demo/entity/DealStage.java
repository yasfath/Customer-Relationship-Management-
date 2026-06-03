package com.example.demo.entity;

public enum DealStage {

    PROSPECT,        // New / incoming lead
    QUALIFICATION,   // Lead is qualified
    PROPOSAL,        // Proposal shared
    NEGOTIATION,     // Price / terms discussion
    WON,             // Deal closed successfully
    LOST             // Deal failed
}
