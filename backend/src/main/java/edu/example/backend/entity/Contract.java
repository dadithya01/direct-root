package edu.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String buyerUsername;

    private String farmerUsername;

    private String cropType;
    private String category;
    private Integer monthlyQuantity;
    private String deliveryFrequency;

    private Integer durationMonths;

    private Double monthlyPrice;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private ContractStatus status;

    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}