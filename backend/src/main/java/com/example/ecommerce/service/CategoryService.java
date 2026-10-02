package com.example.ecommerce.service;

import com.example.ecommerce.dto.category.CategoryRequest;
import com.example.ecommerce.dto.category.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse createCategory(CategoryRequest request);
}
