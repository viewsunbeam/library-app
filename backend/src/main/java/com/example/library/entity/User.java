package com.example.library.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Users")
public class User {
    @Id
    private String cardId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String contact;
    
    private String borrowedBooks = "";
    
    // 构造函数
    public User() {}
    
    public User(String cardId, String name, String contact) {
        this.cardId = cardId;
        this.name = name;
        this.contact = contact;
    }

    // Getters and Setters
    public String getCardId() { return cardId; }
    public void setCardId(String cardId) { this.cardId = cardId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    
    public String getBorrowedBooks() { return borrowedBooks; }
    public void setBorrowedBooks(String borrowedBooks) { this.borrowedBooks = borrowedBooks; }
}