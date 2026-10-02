package com.example.ecommerce.dto.order;

import jakarta.validation.constraints.NotBlank;

public record OrderRequest(

        @NotBlank(message = "Shipping address is required")
        String shippingAddress,

        // Optional — defaults to "COD" in the service if not sent
        String paymentMethod
) {}
