package seba14.momentum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import seba14.momentum.model.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
}