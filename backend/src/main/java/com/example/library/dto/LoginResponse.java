package com.example.library.dto;
import lombok.Data;


@Data

public class LoginResponse {
    private String token;
    private String adminId;

    // Getters and Setters
}