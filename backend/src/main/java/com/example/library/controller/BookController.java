package com.example.library.controller;

import com.example.library.entity.Book;
import com.example.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    // 获取所有书籍或根据关键词搜索
    @GetMapping
    public List<Book> getBooks(@RequestParam(required = false) String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            return bookRepository.searchBooks(keyword);
        }
        return bookRepository.findAll();
    }

    // 根据ID获取书籍
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Optional<Book> book = bookRepository.findById(id);
        return book.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 添加新书籍
    @PostMapping
    public ResponseEntity<Map<String, Object>> addBook(@RequestBody Book book) {
        Map<String, Object> response = new HashMap<>();
        try {
            Book savedBook = bookRepository.save(book);
            response.put("message", "图书添加成功");
            response.put("book", savedBook);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "添加失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 更新书籍
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Map<String, Object> response = new HashMap<>();
        return bookRepository.findById(id)
                .map(existingBook -> {
                    existingBook.setTitle(book.getTitle());
                    existingBook.setAuthor(book.getAuthor());
                    existingBook.setIsbn(book.getIsbn());
                    existingBook.setQuantity(book.getQuantity());
                    Book updatedBook = bookRepository.save(existingBook);
                    response.put("message", "图书更新成功");
                    response.put("book", updatedBook);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("message", "图书不存在");
                    return ResponseEntity.notFound().build();
                });
    }

    // 删除书籍
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBook(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return bookRepository.findById(id)
                .map(book -> {
                    bookRepository.delete(book);
                    response.put("message", "图书删除成功");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("message", "图书不存在");
                    return ResponseEntity.notFound().build();
                });
    }
}