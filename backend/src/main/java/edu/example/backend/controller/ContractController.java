package edu.example.backend.controller;

import edu.example.backend.dto.ContractDTO;
import edu.example.backend.service.ContractService;
import edu.example.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/contracts")
@CrossOrigin
public class ContractController {

    private final ContractService contractService;

    @PostMapping
    public ResponseEntity<APIResponse> postRequest(
            @RequestBody ContractDTO dto,
            Authentication auth) {

        ContractDTO contract = contractService.postRequest(dto, auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Contract request posted successfully")
                        .data(contract)
                        .build()
        );
    }

    @GetMapping("/open")
    public ResponseEntity<APIResponse> getOpenRequests() {
        List<ContractDTO> contracts = contractService.getOpenRequests();

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Open contract requests loaded")
                        .data(contracts)
                        .build()
        );
    }

    @PutMapping("/{id}/apply")
    public ResponseEntity<APIResponse> applyToContract(
            @PathVariable Long id,
            Authentication auth) {

        ContractDTO contract = contractService.applyToContract(id, auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Application submitted successfully")
                        .data(contract)
                        .build()
        );
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<APIResponse> acceptApplication(
            @PathVariable Long id,
            Authentication auth) {

        ContractDTO contract = contractService.acceptApplication(id, auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Application accepted — contract is now active!")
                        .data(contract)
                        .build()
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<APIResponse> rejectApplication(
            @PathVariable Long id,
            Authentication auth) {

        ContractDTO contract = contractService.rejectApplication(id, auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Application rejected — request is open again")
                        .data(contract)
                        .build()
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<APIResponse> cancelContract(
            @PathVariable Long id,
            Authentication auth) {

        ContractDTO contract = contractService.cancelContract(id, auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Contract cancelled")
                        .data(contract)
                        .build()
        );
    }

    @GetMapping("/my/buyer")
    public ResponseEntity<APIResponse> getMyContractsAsBuyer(Authentication auth) {
        List<ContractDTO> contracts = contractService.getMyContractsAsBuyer(auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Your contracts loaded")
                        .data(contracts)
                        .build()
        );
    }

    @GetMapping("/my/farmer")
    public ResponseEntity<APIResponse> getMyContractsAsFarmer(Authentication auth) {
        List<ContractDTO> contracts = contractService.getMyContractsAsFarmer(auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Your contracts loaded")
                        .data(contracts)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<APIResponse> getAllContracts() {
        List<ContractDTO> contracts = contractService.getAllContracts();

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("All contracts loaded")
                        .data(contracts)
                        .build()
        );
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<APIResponse> completeContract(@PathVariable Long id) {
        ContractDTO contract = contractService.completeContract(id);

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Contract marked as completed")
                        .data(contract)
                        .build()
        );
    }
}