package seba14.momentum.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import seba14.momentum.DTO.TaskDTO;
import seba14.momentum.Service.TaskService;
import seba14.momentum.model.Task;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Retrieves all tasks associated with a specific user.
     *
     * @param userId ID of the user.
     * @return List of tasks.
     */
    @GetMapping("/user")
    public List<Task> getAllTasks(@RequestParam Long userId) {
        return taskService.getAllTasksByUser(userId);
    }

    /**
     * Retrieves today's tasks for a specific user.
     *
     * @param userId ID of the user.
     * @return List of today's tasks.
     */
    @GetMapping("/user/today")
    public List<Task> getTodayTasks(@RequestParam Long userId) {
        return taskService.getTodayTasksByUser(userId);
    }

    /**
     * Creates a new task for a user.
     *
     * @param task Task data from the frontend.
     * @return Response with the created task.
     */
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskDTO task) {
        return ResponseEntity.ok(taskService.createTask(task));
    }
}
