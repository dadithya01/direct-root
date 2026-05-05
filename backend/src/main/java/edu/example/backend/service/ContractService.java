package edu.example.backend.service;

import edu.example.backend.dto.ContractDTO;

import java.util.List;

public interface ContractService {
    ContractDTO postRequest(ContractDTO dto, String buyerUsername);
    List<ContractDTO> getOpenRequests();
    ContractDTO applyToContract(Long contractId, String farmerUsername);
    ContractDTO acceptApplication(Long contractId, String buyerUsername);
    ContractDTO rejectApplication(Long contractId, String buyerUsername);
    ContractDTO cancelContract(Long contractId, String username);
    List<ContractDTO> getMyContractsAsBuyer(String buyerUsername);
    List<ContractDTO> getMyContractsAsFarmer(String farmerUsername);
    List<ContractDTO> getAllContracts();
    ContractDTO completeContract(Long contractId);
}
