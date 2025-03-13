package com.example.library.specification;

import com.example.library.entity.Book;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class BookSpecifications {

    public static Specification<Book> withDynamicQuery(
        String bookType,
        String bookName,
        String publisher,
        Integer year,
        String author,
        BigDecimal minPrice,
        BigDecimal maxPrice
    ) {
        return (Root<Book> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            Predicate predicate = cb.conjunction();

            // 添加查询条件
            if (bookType != null && !bookType.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("bookType"), bookType));
            }
            if (bookName != null && !bookName.isEmpty()) {
                predicate = cb.and(predicate, cb.like(root.get("bookName"), "%" + bookName + "%"));
            }
            if (publisher != null && !publisher.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("publisher"), publisher));
            }
            if (year != null) {
                predicate = cb.and(predicate, cb.equal(root.get("year"), year));
            }
            if (author != null && !author.isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("author"), author));
            }
            if (minPrice != null || maxPrice != null) {
                List<Predicate> pricePredicates = new ArrayList<>();
                if (minPrice != null) {
                    pricePredicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    pricePredicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
                }
                predicate = cb.and(predicate, cb.and(pricePredicates.toArray(new Predicate[0])));
            }

            return predicate;
        };
    }
}