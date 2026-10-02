package com.example.ecommerce.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        List<OrderItemResponse> items,
        BigDecimal totalPrice,
        String shippingAddress,
        String paymentMethod,
        LocalDateTime createdAt
) {}
