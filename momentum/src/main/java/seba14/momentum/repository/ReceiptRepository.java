package seba14.momentum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import seba14.momentum.model.Receipt;

import java.util.List;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    @Query("select r from Receipt r")
    List<Receipt> findAllByUserIdOrderByDateDesc(Long userId);
}
