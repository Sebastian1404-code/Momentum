package seba14.momentum.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import seba14.momentum.DTO.ReceiptMapper;
import seba14.momentum.DTO.ReceiptRequest;
import seba14.momentum.model.Item;
import seba14.momentum.model.Receipt;
import seba14.momentum.model.User;
import seba14.momentum.repository.ReceiptRepository;
import seba14.momentum.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Saves a receipt and its associated items to the database.
     *
     * @param request DTO containing receipt and item details.
     * @return HTTP response indicating success or failure.
     */
    public ResponseEntity<?> saveReceipt(ReceiptRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Receipt receipt = new Receipt();
        receipt.setUser(user);
        receipt.setStore(request.getStore());
        receipt.setLocation(request.getLocation());
        receipt.setReceiptDate(LocalDateTime.now());
        receipt.setPaymentMethod(request.getPaymentMethod());

        List<Item> items = request.getItems().stream().map(dto -> {
            Item item = new Item();
            item.setName(dto.getName());
            item.setQuantity(dto.getQuantity());
            item.setUnitPrice(dto.getUnit_price());
            item.setTotalPrice(dto.getTotal_price());
            item.setReceipt(receipt);
            return item;
        }).collect(Collectors.toList());

        receipt.setItems(items);

        double total = items.stream().mapToDouble(Item::getTotalPrice).sum();
        receipt.setTotal(total);

        receiptRepository.save(receipt);

        return ResponseEntity.ok("Receipt saved");
    }

    /**
     * Retrieves all receipts for a given user.
     *
     * @param userId ID of the user.
     * @return List of receipt DTOs.
     */
    public List<ReceiptRequest> getAllReceipts(Long userId) {
        if (!userRepository.existsById(userId)) {
            return Collections.emptyList();
        }
        List<Receipt> receipts = receiptRepository.findAllByUserIdOrderByDateDesc(userId);
        return receipts.stream()
                .map(ReceiptMapper::toDTO)
                .peek(receipt -> receipt.setUserId(userId))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single receipt by its ID.
     *
     * @param id Receipt ID.
     * @return Receipt DTO or null if not found.
     */
    public ReceiptRequest getReceiptById(Long id) {
        Optional<Receipt> receiptOpt = receiptRepository.findById(id);
        return receiptOpt.map(ReceiptMapper::toDTO).orElse(null);
    }
}
