package edu.example.backend.service;

import edu.example.backend.dto.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO placeOrder(OrderDTO dto, String buyerUsername);
    List<OrderDTO> getMyOrders(String buyerUsername);
}
