package edu.example.backend.service.impl;

import edu.example.backend.dto.ContractDTO;
import edu.example.backend.entity.Contract;
import edu.example.backend.entity.ContractStatus;
import edu.example.backend.repository.ContractRepository;
import edu.example.backend.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final ModelMapper modelMapper;

    @Override
    public ContractDTO postRequest(ContractDTO dto, String buyerUsername) {
        Contract contract = modelMapper.map(dto, Contract.class);
        contract.setId(null);
        contract.setBuyerUsername(buyerUsername);
        contract.setFarmerUsername(null);
        contract.setStatus(ContractStatus.PENDING);
        contract.setStartDate(null);
        contract.setEndDate(null);
        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());

        return modelMapper.map(contractRepository.save(contract), ContractDTO.class);
    }

    @Override
    public List<ContractDTO> getOpenRequests() {
        return contractRepository.findByStatus(ContractStatus.PENDING)
                .stream()
                .map(c -> modelMapper.map(c, ContractDTO.class))
                .toList();
    }

    @Override
    public ContractDTO applyToContract(Long contractId, String farmerUsername) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract request not found"));

        if (contract.getStatus() != ContractStatus.PENDING) {
            throw new RuntimeException("This contract is no longer open for applications");
        }

        if (contract.getBuyerUsername().equals(farmerUsername)) {
            throw new RuntimeException("You cannot apply to your own contract request");
        }

        contract.setFarmerUsername(farmerUsername);
        contract.setStatus(ContractStatus.APPLIED);
        contract.setUpdatedAt(LocalDateTime.now());

        return modelMapper.map(contractRepository.save(contract), ContractDTO.class);
    }

    @Override
    public ContractDTO acceptApplication(Long contractId, String buyerUsername) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (!contract.getBuyerUsername().equals(buyerUsername)) {
            throw new RuntimeException("You are not the buyer of this contract");
        }

        if (contract.getStatus() != ContractStatus.APPLIED) {
            throw new RuntimeException("No pending application to accept");
        }

        // Set contract dates from today
        LocalDate start = LocalDate.now();
        contract.setStartDate(start);
        contract.setEndDate(start.plusMonths(contract.getDurationMonths()));
        contract.setStatus(ContractStatus.ACTIVE);
        contract.setUpdatedAt(LocalDateTime.now());

        return modelMapper.map(contractRepository.save(contract), ContractDTO.class);
    }

    @Override
    public ContractDTO rejectApplication(Long contractId, String buyerUsername) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (!contract.getBuyerUsername().equals(buyerUsername)) {
            throw new RuntimeException("You are not the buyer of this contract");
        }

        if (contract.getStatus() != ContractStatus.APPLIED) {
            throw new RuntimeException("No pending application to reject");
        }

        contract.setFarmerUsername(null);
        contract.setStatus(ContractStatus.PENDING);
        contract.setUpdatedAt(LocalDateTime.now());

        return modelMapper.map(contractRepository.save(contract), ContractDTO.class);
    }

    @Override
    public ContractDTO cancelContract(Long contractId, String username) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        boolean isBuyer  = contract.getBuyerUsername().equals(username);
        boolean isFarmer = username.equals(contract.getFarmerUsername());

        if (!isBuyer && !isFarmer) {
            throw new RuntimeException("You are not part of this contract");
        }

        if (contract.getStatus() == ContractStatus.COMPLETED || contract.getStatus() == ContractStatus.CANCELLED) {
            throw new RuntimeException("Contract is already " + contract.getStatus().name().toLowerCase());
        }

        contract.setStatus(ContractStatus.CANCELLED);
        contract.setUpdatedAt(LocalDateTime.now());

        return modelMapper.map(contractRepository.save(contract), ContractDTO.class);
    }

    @Override
    public List<ContractDTO> getMyContractsAsBuyer(String buyerUsername) {
        return contractRepository.findByBuyerUsername(buyerUsername)
                .stream()
                .map(c -> modelMapper.map(c, ContractDTO.class))
                .toList();
    }

    @Override
    public List<ContractDTO> getMyContractsAsFarmer(String farmerUsername) {
        return contractRepository.findByFarmerUsername(farmerUsername)
                .stream()
                .map(c -> modelMapper.map(c, ContractDTO.class))
                .toList();
    }

    @Override
    public List<ContractDTO> getAllContracts() {
        return contractRepository.findAll()
                .stream()
                .map(c -> modelMapper.map(c, ContractDTO.class))
                .toList();
    }

    @Override
    public ContractDTO completeContract(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new RuntimeException("Only active contracts can be marked as completed");
        }

        contract.setStatus(ContractStatus.COMPLETED);
        contract.setUpdatedAt(LocalDateTime.now());

        return modelMapper.map(contractRepository.save(contract), ContractDTO.class);
    }
}