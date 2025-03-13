package com.example.library.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "LibraryRecords")
public class LibraryRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rid;
    
    private String cardNo;
    
    private String bookNo;
    
    private LocalDateTime lentDate;
    
    private LocalDateTime returnDate;
    
    private String operator;
    
    // 构造函数
    public LibraryRecord() {}
    
    // Getters and Setters
    public Long getRid() { return rid; }
    public void setRid(Long rid) { this.rid = rid; }
    
    public String getCardNo() { return cardNo; }
    public void setCardNo(String cardNo) { this.cardNo = cardNo; }
    
    public String getBookNo() { return bookNo; }
    public void setBookNo(String bookNo) { this.bookNo = bookNo; }
    
    public LocalDateTime getLentDate() { return lentDate; }
    public void setLentDate(LocalDateTime lentDate) { this.lentDate = lentDate; }
    
    public LocalDateTime getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDateTime returnDate) { this.returnDate = returnDate; }
    
    public String getOperator() { return operator; }
    public void setOperator(String operator) { this.operator = operator; }
}