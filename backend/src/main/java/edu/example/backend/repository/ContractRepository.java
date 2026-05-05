package edu.example.backend.repository;

import edu.example.backend.entity.Contract;
import edu.example.backend.entity.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByBuyerUsername(String buyerUsername);

    List<Contract> findByFarmerUsername(String farmerUsername);

    List<Contract> findByStatus(ContractStatus status);

    List<Contract> findByBuyerUsernameAndStatus(String buyerUsername, ContractStatus status);
    List<Contract> findByFarmerUsernameAndStatus(String farmerUsername, ContractStatus status);
}