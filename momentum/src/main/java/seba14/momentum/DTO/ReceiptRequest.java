package seba14.momentum.DTO;


import lombok.*;
import seba14.momentum.model.Item;

import java.time.LocalDateTime;
import java.util.List;


@Data
@Getter
@Setter
@NoArgsConstructor
public class ReceiptRequest {
    private Long receiptId;
    private String store;
    private String location;
    private List<ProductDTO> items;
    private Long userId;
    private PaymentMethod paymentMethod;
    private double total;
    private LocalDateTime receiptDate;  // Java 8+ datetime

    public ReceiptRequest() {
    }

    public ReceiptRequest(String store, String location, List<ProductDTO> items, Long userId, PaymentMethod paymentMethod, double total, LocalDateTime receiptDate, Long receiptId) {

        this.store = store;
        this.location = location;
        this.items = items;
        this.userId = userId;
        this.paymentMethod = paymentMethod;
        this.total=total;
        this.receiptDate=receiptDate;
        this.receiptId=receiptId;
    }

    public Long getReceiptId() {
        return receiptId;
    }

    public void setReceiptId(Long receiptId) {
        this.receiptId = receiptId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStore() {
        return store;
    }

    public void setStore(String store) {
        this.store = store;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<ProductDTO> getItems() {
        return items;
    }

    public void setItems(List<ProductDTO> items) {
        this.items = items;
    }
}

