package edu.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import edu.example.backend.entity.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("buyerUsername")
    private String buyerUsername;

    @JsonProperty("farmerUsername")
    private String farmerUsername;

    @JsonProperty("cropType")
    private String cropType;

    @JsonProperty("category")
    private String category;

    @JsonProperty("monthlyQuantity")
    private Integer monthlyQuantity;

    @JsonProperty("deliveryFrequency")
    private String deliveryFrequency;

    @JsonProperty("durationMonths")
    private Integer durationMonths;

    @JsonProperty("monthlyPrice")
    private Double monthlyPrice;

    @JsonProperty("startDate")
    private LocalDate startDate;

    @JsonProperty("endDate")
    private LocalDate endDate;

    @JsonProperty("status")
    private ContractStatus status;

    @JsonProperty("notes")
    private String notes;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
}
