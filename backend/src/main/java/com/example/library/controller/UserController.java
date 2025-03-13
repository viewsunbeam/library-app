package com.example.library.controller;
import com.example.library.entity.User;
import com.example.library.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 获取所有用户
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 根据ID获取用户
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String cardId) {
        Optional<User> user = userRepository.findById(cardId);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 添加新用户
    @PostMapping
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            User savedUser = userRepository.save(user);
            response.put("message", "借书证添加成功");
            response.put("user", savedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "添加失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 删除用户
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String cardId) {
        Map<String, Object> response = new HashMap<>();
        return userRepository.findById(cardId)
                .map(user -> {
                    userRepository.delete(user);
                    response.put("message", "借书证删除成功");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("message", "用户不存在");
                    return ResponseEntity.notFound().build();
                });
    }
}