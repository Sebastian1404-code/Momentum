package seba14.momentum.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import seba14.momentum.DTO.PaymentMethod;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "receipt")
@Getter
@Setter
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String store;
    private String location;

    private LocalDateTime receiptDate;  // Java 8+ datetime

    private double total;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL)
    private List<Item> items;

    // Constructors

    public Receipt()
    {

    }

    public Receipt(Long userId, String store, String location, LocalDateTime receiptDate, double total, PaymentMethod paymentMethod, User user, List<Item> items) {
        this.store = store;
        this.location = location;
        this.receiptDate = receiptDate;
        this.total = total;
        this.paymentMethod = paymentMethod;
        this.user = user;
        this.items = items;
    }
    // Getters and Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(LocalDateTime receiptDate) {
        this.receiptDate = receiptDate;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }


    public String getStore() { return store; }
    public void setStore(String store) { this.store = store; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}
