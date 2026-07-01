// src/app/components/todo-form/todo-form.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css'
})
export class TodoForm {
  @Output() todoCreated = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private todoService: TodoService) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const newTodo: Todo = {
      title: this.form.value.title,
      description: this.form.value.description,
      completed: false
    };

    this.todoService.createTodo(newTodo).subscribe({
      next: () => {
        this.form.reset();
        this.todoCreated.emit();
      },
      error: (err) => console.error('Error al crear tarea:', err)
    });
  }
}