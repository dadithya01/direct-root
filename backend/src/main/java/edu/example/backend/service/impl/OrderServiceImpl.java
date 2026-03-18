package edu.example.backend.service.impl;

import edu.example.backend.dto.OrderDTO;
import edu.example.backend.dto.OrderItemDTO;
import edu.example.backend.entity.Order;
import edu.example.backend.entity.OrderItem;
import edu.example.backend.entity.Product;
import edu.example.backend.repository.OrderRepository;
import edu.example.backend.repository.ProductRepository;
import edu.example.backend.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public OrderDTO placeOrder(OrderDTO dto, String buyerUsername) {
        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (OrderItemDTO itemDTO : dto.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));

            if (product.getQuantity() < itemDTO.getQuantity()) {
                throw new RuntimeException("Not enough stock for: " + product.getName());
            }

            // Reduce product quantity
            product.setQuantity(product.getQuantity() - itemDTO.getQuantity());
            productRepository.save(product);

            total += product.getPrice() * itemDTO.getQuantity();

            // Build OrderItem manually since some fields
            // come from Product, not from the DTO
            OrderItem orderItem = OrderItem.builder()
                    .productName(product.getName())
                    .farmerUsername(product.getFarmerUsername())
                    .priceAtPurchase(product.getPrice())
                    .quantity(itemDTO.getQuantity())
                    .build();

            orderItems.add(orderItem);
        }

        Order order = Order.builder()
                .buyerUsername(buyerUsername)
                .totalPrice(total)
                .orderedAt(LocalDateTime.now())
                .items(orderItems)
                .build();

        // Link each item back to the order before saving
        orderItems.forEach(item -> item.setOrder(order));

        Order saved = orderRepository.save(order);

        // Map saved Order → OrderResponseDTO
        return mapOrderToDTO(saved);
    }

    @Override
    public List<OrderDTO> getMyOrders(String buyerUsername) {
        return orderRepository.findByBuyerUsername(buyerUsername)
                .stream()
                .map(this::mapOrderToDTO)
                .toList();
    }

    // ModelMapper handles flat fields (id, buyerUsername, totalPrice, orderedAt)
    // Items need manual mapping since they are a nested list
    private OrderDTO mapOrderToDTO(Order order) {
        OrderDTO dto = modelMapper.map(order, OrderDTO.class);

        List<OrderItemDTO> itemDTOs = order.getItems()
                .stream()
                .map(item -> modelMapper.map(item, OrderItemDTO.class))
                .toList();

        dto.setItems(itemDTOs);
        return dto;
    }

    @Override
    public List<OrderDTO> getOrdersByFarmer(String farmerUsername) {
        return orderRepository.findOrdersByFarmerUsername(farmerUsername)
                .stream()
                .map(this::mapOrderToDTO)
                .toList();
    }
}