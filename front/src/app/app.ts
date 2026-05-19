import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmComponent } from './components/confirm/confirm.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastComponent, ConfirmComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('home-budget');
}
