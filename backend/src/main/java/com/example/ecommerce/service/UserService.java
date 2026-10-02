package com.example.ecommerce.service;

import com.example.ecommerce.dto.auth.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
}
