package com.example.library.dto;
import lombok.Data;


@Data
public class LoginRequest {
    private String adminId;
    private String password;

    // Getters and Setters
}