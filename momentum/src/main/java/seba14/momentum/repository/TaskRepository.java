package seba14.momentum.repository;

// TaskRepository.java

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import seba14.momentum.model.Task;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserId(Long userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.startDate >= :startOfDay AND t.startDate < :endOfDay")
    List<Task> findTasksFromToday(Long userId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
