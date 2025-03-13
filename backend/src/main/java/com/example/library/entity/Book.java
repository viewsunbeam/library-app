package com.example.library.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Books")
public class Book {
    @Id
    private String bookNo;
    
    private String bookType;
    
    @Column(nullable = false)
    private String bookName;
    
    private String publisher;
    
    private Integer year;
    
    private String author;
    
    @Column(columnDefinition = "MONEY")
    private BigDecimal price;
    
    private Integer total;
    
    private Integer storage;
    
    private LocalDateTime updateTime;
    
    // 构造函数
    public Book() {}
    
    // Getters and Setters
    public String getBookNo() { return bookNo; }
    public void setBookNo(String bookNo) { this.bookNo = bookNo; }
    
    public String getBookType() { return bookType; }
    public void setBookType(String bookType) { this.bookType = bookType; }
    
    public String getBookName() { return bookName; }
    public void setBookName(String bookName) { this.bookName = bookName; }
    
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
    
    public Integer getStorage() { return storage; }
    public void setStorage(Integer storage) { this.storage = storage; }
    
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
}