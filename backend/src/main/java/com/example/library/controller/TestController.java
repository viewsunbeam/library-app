// 在src/main/java/com/example/library/controller目录下创建TestController.java
package com.example.library.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/test")
    public String test() {
        return "API is working!";
    }
}