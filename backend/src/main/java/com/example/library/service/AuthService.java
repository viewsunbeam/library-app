package com.example.library.service;

import com.example.library.dto.LoginRequest;
import com.example.library.dto.LoginResponse;
import com.example.library.entity.Admin;
import com.example.library.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private AdminRepository adminRepository;

    public LoginResponse login(LoginRequest request) {
        Admin admin = adminRepository.findById(request.getAdminId())
            .orElseThrow(() -> new RuntimeException("管理员不存在"));

        if (!request.getPassword().equals(admin.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        // 生成简单的令牌（这里直接用 adminId 作为令牌）
        String token = admin.getAdminId();

        return new LoginResponse(token, admin.getAdminId());
    }
}