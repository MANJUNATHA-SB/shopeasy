package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Product;
import org.springframework.data.jpa.domain.Specification;

// Small helper that builds WHERE clauses for /api/products?keyword=...&categoryId=...
public class ProductSpecifications {

    private ProductSpecifications() {}

    public static Specification<Product> hasKeyword(String keyword) {
        return (root, query, cb) -> (keyword == null || keyword.isBlank())
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Product> hasCategoryId(Long categoryId) {
        return (root, query, cb) -> categoryId == null
                ? cb.conjunction()
                : cb.equal(root.get("category").get("id"), categoryId);
    }
}
