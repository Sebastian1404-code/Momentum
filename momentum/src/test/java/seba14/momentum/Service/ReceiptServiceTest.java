package seba14.momentum.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import seba14.momentum.DTO.ReceiptMapper;
import seba14.momentum.DTO.ReceiptRequest;
import seba14.momentum.Service.ReceiptService;
import seba14.momentum.model.Receipt;
import seba14.momentum.repository.ReceiptRepository;
import seba14.momentum.repository.UserRepository;
import static org.mockito.Mockito.mockStatic;
import org.mockito.MockedStatic;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReceiptServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReceiptRepository receiptRepository;

    @InjectMocks
    private ReceiptService receiptService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllReceipts_UserDoesNotExist_ReturnsEmptyList() {
        Long userId = 3L;
        when(userRepository.existsById(userId)).thenReturn(false);

        List<ReceiptRequest> result = receiptService.getAllReceipts(userId);

        assertTrue(result == null || result.isEmpty());
        verify(userRepository).existsById(userId);
        verify(receiptRepository, never()).findAllByUserIdOrderByDateDesc(anyLong());
    }



    @Test
    void testGetAllReceipts_UserExists_ReturnsMappedDTOs() {
        Long userId = 3L;
        Receipt receipt = new Receipt();
        receipt.setId(15L);
        receipt.setStore("Test Store");
        receipt.setReceiptDate(LocalDateTime.of(2024, 6, 4, 12, 0));
        receipt.setLocation("Test Location");

        ReceiptRequest mappedDTO = new ReceiptRequest();
        mappedDTO.setStore("Test Store");
        mappedDTO.setLocation("Test Location");
        mappedDTO.setReceiptDate(receipt.getReceiptDate());
        mappedDTO.setUserId(userId);

        try (MockedStatic<ReceiptMapper> mocked = mockStatic(ReceiptMapper.class)) {
            when(userRepository.existsById(userId)).thenReturn(true);
            when(receiptRepository.findAllByUserIdOrderByDateDesc(userId))
                    .thenReturn(Collections.singletonList(receipt));

            mocked.when(() -> ReceiptMapper.toDTO(receipt)).thenReturn(mappedDTO);

            List<ReceiptRequest> result = receiptService.getAllReceipts(userId);

            assertEquals(1, result.size());
            ReceiptRequest dto = result.get(0);
            assertEquals("Test Store", dto.getStore());
            assertEquals("Test Location", dto.getLocation());
            assertEquals(userId, dto.getUserId());
        }
    }

}
