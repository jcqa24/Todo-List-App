package com.codetla.todolist.service;

import com.codetla.todolist.dto.TodoRequestDTO;
import com.codetla.todolist.dto.TodoResponseDTO;
import com.codetla.todolist.exception.ResourceNotFoundException;
import com.codetla.todolist.model.Todo;
import com.codetla.todolist.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    @Autowired
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<TodoResponseDTO> getAllTodos() {
        return todoRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public TodoResponseDTO getTodoById(Long id) {
        Todo todo = findTodoEntityById(id);
        return toResponseDTO(todo);
    }

    public TodoResponseDTO createTodo(TodoRequestDTO requestDTO) {
        Todo todo = new Todo();
        todo.setTitle(requestDTO.getTitle());
        todo.setDescription(requestDTO.getDescription());
        // completed no se setea: por defecto es false (definido en la entidad)

        Todo saved = todoRepository.save(todo);
        return toResponseDTO(saved);
    }

    public TodoResponseDTO updateTodo(Long id, TodoRequestDTO requestDTO) {
        Todo todo = findTodoEntityById(id);
        todo.setTitle(requestDTO.getTitle());
        todo.setDescription(requestDTO.getDescription());

        Todo updated = todoRepository.save(todo);
        return toResponseDTO(updated);
    }

    public void deleteTodo(Long id) {
        Todo todo = findTodoEntityById(id);
        todoRepository.delete(todo);
    }

    public List<TodoResponseDTO> getCompletedTodos(boolean completed) {
        return todoRepository.findByCompleted(completed)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ---- Métodos privados de apoyo ----

    private Todo findTodoEntityById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
    }

    private TodoResponseDTO toResponseDTO(Todo todo) {
        return new TodoResponseDTO(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isCompleted()
        );
    }
}