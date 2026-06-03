package com.example.demo.dto;

public class PredictionResponseDTO {

    private int leadScore;
    private double conversionProbability;
    private String recommendation;

    public PredictionResponseDTO() {}

    public PredictionResponseDTO(int leadScore,
                                 double conversionProbability,
                                 String recommendation) {
        this.leadScore = leadScore;
        this.conversionProbability = conversionProbability;
        this.recommendation = recommendation;
    }

    public int getLeadScore() {
        return leadScore;
    }

    public void setLeadScore(int leadScore) {
        this.leadScore = leadScore;
    }

    public double getConversionProbability() {
        return conversionProbability;
    }

    public void setConversionProbability(double conversionProbability) {
        this.conversionProbability = conversionProbability;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
