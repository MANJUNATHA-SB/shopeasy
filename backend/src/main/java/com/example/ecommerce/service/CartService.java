package com.example.ecommerce.service;

import com.example.ecommerce.dto.cart.AddCartItemRequest;
import com.example.ecommerce.dto.cart.CartResponse;
import com.example.ecommerce.dto.cart.UpdateCartItemRequest;

public interface CartService {
    CartResponse getCartForUser(Long userId);
    CartResponse addItemToCart(Long userId, AddCartItemRequest request);
    CartResponse updateCartItem(Long userId, Long cartItemId, UpdateCartItemRequest request);
    CartResponse removeCartItem(Long userId, Long cartItemId);
}
