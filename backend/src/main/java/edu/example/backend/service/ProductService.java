package edu.example.backend.service;

import edu.example.backend.dto.ProductDTO;

import java.util.List;

public interface ProductService {
    ProductDTO addProduct(ProductDTO dto, String farmerUsername);
    List<ProductDTO> getAllProducts();
    List<ProductDTO> getMyProducts(String farmerUsername);
    ProductDTO updateProduct(Long id, ProductDTO dto, String farmerUsername);
    void deleteProduct(Long id, String farmerUsername);
}
