// src/app/app.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoService } from './services/todo';
import { Todo } from './models/todo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'todo-frontend';
}