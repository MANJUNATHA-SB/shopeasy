package com.example.ecommerce.dto.cart;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String productImageUrl,
        BigDecimal price,
        Integer quantity,
        BigDecimal subtotal
) {}
