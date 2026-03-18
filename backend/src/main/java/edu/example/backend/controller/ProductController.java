package edu.example.backend.controller;

import edu.example.backend.dto.ProductDTO;
import edu.example.backend.entity.Product;
import edu.example.backend.repository.ProductRepository;
import edu.example.backend.service.ProductService;
import edu.example.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/products")
@CrossOrigin
public class ProductController {

    private final ProductService productService;

    // FARMER — post a new product
    @PostMapping
    public ResponseEntity<APIResponse> addProduct(
            @RequestBody ProductDTO dto,
            Authentication auth) {

        ProductDTO product = productService.addProduct(dto, auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Product listed successfully")
                        .data(product)
                        .build()
        );
    }

    // ADMIN + BUYER — browse all products
    @GetMapping
    public ResponseEntity<APIResponse> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Products loaded successfully")
                        .data(products)
                        .build()
        );
    }

    // FARMER — view only their own listings
    @GetMapping("/my")
    public ResponseEntity<APIResponse> getMyProducts(Authentication auth) {
        List<ProductDTO> products = productService.getMyProducts(auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Your listings loaded successfully")
                        .data(products)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDTO dto,
            Authentication auth) {
        ProductDTO updated = productService.updateProduct(id, dto, auth.getName());
        return ResponseEntity.ok(APIResponse.builder()
                .status(200).message("Product updated").data(updated).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse> deleteProduct(
            @PathVariable Long id,
            Authentication auth) {
        productService.deleteProduct(id, auth.getName());
        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Product deleted successfully")
                        .data(null)
                        .build()
        );
    }
}