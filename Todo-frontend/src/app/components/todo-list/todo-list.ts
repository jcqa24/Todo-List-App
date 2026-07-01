import { Component, OnInit, signal, computed } from '@angular/core';
import {CommonModule} from '@angular/common';
import {TodoService} from '../../services/todo';
import {Todo} from '../../models/todo';
import {TodoForm} from '../todo-form/todo-form';



@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoForm],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})

export class TodoList implements OnInit {
  todos = signal<Todo[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  openCount = computed(() => this.todos().filter(todo => !todo.completed).length);

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void{
    this.loading.set(true);
    this.todoService.getTodos().subscribe({
      next: (data: Todo[]) => {
        this.todos.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar las tareas. Intenta más tarde.');
        console.error(error);
        this.loading.set(false);
      }
    });
  }

  toggleCompleted(todo: Todo): void {
    if(!todo.id) return;
    const updated = {...todo,completed: !todo.completed};
    this.todoService.updateTodo(todo.id, updated).subscribe({
      next: (data: Todo) => {
        todo.completed = data.completed;
      },
      error: (error) => {
        this.errorMessage.set('Error al actualizar la tarea. Intenta más tarde.');
        console.error(error);
      }
    });
  }
    deleteTodo(id: number | undefined): void {
    if (!id) return;
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.loadTodos(),
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  formatId(index: number): string {
    return String(index + 1).padStart(3, '0');
  }
  }





