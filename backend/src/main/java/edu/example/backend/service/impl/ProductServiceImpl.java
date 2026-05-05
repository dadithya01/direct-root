package edu.example.backend.service.impl;

import edu.example.backend.dto.ProductDTO;
import edu.example.backend.entity.Product;
import edu.example.backend.repository.ProductRepository;
import edu.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public ProductDTO addProduct(ProductDTO dto, String farmerUsername) {
        // Map DTO → Entity
        Product product = modelMapper.map(dto, Product.class);
        product.setFarmerUsername(farmerUsername);
        product.setCreatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);

        // Map Entity → ResponseDTO
        return modelMapper.map(saved, ProductDTO.class);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .toList();
    }

    @Override
    public List<ProductDTO> getMyProducts(String farmerUsername) {
        return productRepository.findByFarmerUsername(farmerUsername)
                .stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .toList();
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO dto, String farmerUsername) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.getFarmerUsername().equals(farmerUsername))
            throw new RuntimeException("Not your product");
        product.setName(dto.getName());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setDescription(dto.getDescription());
        return modelMapper.map(productRepository.save(product), ProductDTO.class);
    }

    @Override
    public void deleteProduct(Long id, String farmerUsername) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getFarmerUsername().equals(farmerUsername)) {
            throw new RuntimeException("You can only delete your own products");
        }

        productRepository.delete(product);
    }


}