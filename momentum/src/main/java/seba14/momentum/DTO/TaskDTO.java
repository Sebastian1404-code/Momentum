package seba14.momentum.DTO;

import java.time.LocalDateTime;

public class TaskDTO {

    private String name;

    private LocalDateTime startDate;

    private int duration;
    private Long userId;

    public TaskDTO(String name, LocalDateTime startDate, int duration, Long userId) {
        this.name = name;
        this.startDate = startDate;
        this.duration = duration;
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
