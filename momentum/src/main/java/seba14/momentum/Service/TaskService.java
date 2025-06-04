package seba14.momentum.Service;

// TaskService.java
import org.springframework.stereotype.Service;
import seba14.momentum.DTO.TaskDTO;
import seba14.momentum.model.Task;
import seba14.momentum.model.User;
import seba14.momentum.repository.TaskRepository;
import seba14.momentum.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retrieves all tasks for a given user.
     *
     * @param userId ID of the user.
     * @return List of tasks.
     */
    public List<Task> getAllTasksByUser(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    /**
     * Retrieves tasks scheduled for today for a given user.
     *
     * @param userId ID of the user.
     * @return List of today's tasks.
     */
    public List<Task> getTodayTasksByUser(Long userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return taskRepository.findTasksFromToday(userId, startOfDay, endOfDay);
    }

    /**
     * Creates and saves a new task.
     *
     * @param taskDTO Data transfer object containing task details.
     * @return Success message.
     */
    public String createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setName(taskDTO.getName());
        task.setDuration(taskDTO.getDuration());
        task.setStartDate(taskDTO.getStartDate());
        User user = userRepository.findById(taskDTO.getUserId()).get();
        task.setUser(user);
        taskRepository.save(task);
        return "Task Successfully Added!";
    }
}
