package com.example.ecommerce.service;

import com.example.ecommerce.dto.order.OrderRequest;
import com.example.ecommerce.dto.order.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(Long userId, OrderRequest request);
    List<OrderResponse> getOrdersForUser(Long userId);
    OrderResponse getOrderById(Long userId, String userRole, Long orderId);
    List<OrderResponse> getAllOrders();
}
