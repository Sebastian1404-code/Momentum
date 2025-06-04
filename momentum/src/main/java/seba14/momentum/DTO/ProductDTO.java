package seba14.momentum.DTO;


import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
public class ProductDTO {
    private String name;
    private double quantity;
    private double unit_price;
    private double total_price;

    public ProductDTO(String name, double quantity, double unit_price, double total_price) {
        this.name = name;
        this.quantity = quantity;
        this.unit_price = unit_price;
        this.total_price = total_price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public double getUnit_price() {
        return unit_price;
    }

    public void setUnit_price(double unit_price) {
        this.unit_price = unit_price;
    }

    public double getTotal_price() {
        return total_price;
    }

    public void setTotal_price(double total_price) {
        this.total_price = total_price;
    }
}

