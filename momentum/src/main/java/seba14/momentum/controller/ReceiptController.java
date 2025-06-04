package seba14.momentum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import seba14.momentum.DTO.ReceiptRequest;
import seba14.momentum.Service.ReceiptService;
import seba14.momentum.repository.ReceiptRepository;
import seba14.momentum.repository.UserRepository;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    private final ReceiptRepository receiptRepository;
    private final UserRepository userRepository;

    public ReceiptController(ReceiptRepository receiptRepository, UserRepository userRepository) {
        this.receiptRepository = receiptRepository;
        this.userRepository = userRepository;
    }

    /**
     * Saves a new receipt and its items for a given user.
     *
     * @param request Receipt data from the frontend.
     * @return Response indicating success or failure.
     */
    @PostMapping
    public ResponseEntity<?> saveReceipt(@RequestBody ReceiptRequest request) {
        System.out.println("here");
        return receiptService.saveReceipt(request);
    }

    /**
     * Retrieves all receipts associated with a specific user.
     *
     * @param userId ID of the user.
     * @return List of receipts or 404 if none found.
     */
    @GetMapping("/user")
    public ResponseEntity<?> getReceiptsByUser(@RequestParam Long userId) {
        System.out.println("stay");
        List<ReceiptRequest> receipts = receiptService.getAllReceipts(userId);
        if (receipts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(receipts);
    }

    /**
     * Retrieves a receipt by its ID.
     *
     * @param id ID of the receipt.
     * @return Receipt data or 404 if not found.
     */
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getReceiptById(@PathVariable Long id) {
        System.out.println("here");
        ReceiptRequest receipts = receiptService.getReceiptById(id);
        if (receipts == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(receipts);
    }
}
