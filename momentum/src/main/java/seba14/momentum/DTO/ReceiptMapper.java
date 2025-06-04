package seba14.momentum.DTO;

import seba14.momentum.model.Receipt;

import java.util.List;
import java.util.stream.Collectors;

public class ReceiptMapper {

    public static ReceiptRequest toDTO(Receipt receipt) {

        List<ProductDTO> itemDTOs = receipt.getItems().stream()
                .map(item -> new ProductDTO(item.getName(), item.getQuantity(), item.getUnitPrice(),item.getTotalPrice()))
                .collect(Collectors.toList());
        System.out.println("Receipt" + receipt.getReceiptDate());

        return new ReceiptRequest(
                receipt.getStore(),
                receipt.getLocation(),
                itemDTOs,
                1L,
                receipt.getPaymentMethod(),
                receipt.getTotal(),
                receipt.getReceiptDate(),
                receipt.getId()

        );
    }
}
