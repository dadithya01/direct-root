package edu.example.backend.controller;

import edu.example.backend.dto.OrderDTO;
import edu.example.backend.service.OrderService;
import edu.example.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/orders")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    // BUYER — place a new order
    @PostMapping
    public ResponseEntity<APIResponse> placeOrder(
            @RequestBody OrderDTO dto,
            Authentication auth) {

        OrderDTO order = orderService.placeOrder(dto, auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Order placed successfully")
                        .data(order)
                        .build()
        );
    }

    // BUYER — view their own order history
    @GetMapping("/my")
    public ResponseEntity<APIResponse> getMyOrders(Authentication auth) {
        List<OrderDTO> orders = orderService.getMyOrders(auth.getName());

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Order history loaded successfully")
                        .data(orders)
                        .build()
        );
    }
}
