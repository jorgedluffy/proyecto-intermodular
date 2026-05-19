import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (confirmService.question(); as q) {
      <div 
        (click)="onCancel()"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in"
      >
        <div 
          (click)="$event.stopPropagation()"
          class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border border-gray-100 animate-scale-up"
        >
          <!-- Icon & Header -->
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">¿Estás seguro?</h3>
          </div>

          <!-- Message -->
          <p class="text-sm text-gray-600 mb-6">
            {{ q.message }}
          </p>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              (click)="onCancel()"
              class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              (click)="onConfirm()"
              class="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded hover:bg-rose-600 shadow-sm shadow-rose-100 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }
    .animate-scale-up {
      animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `]
})
export class ConfirmComponent {
  public confirmService = inject(ConfirmService);

  onCancel(): void {
    this.confirmService.confirm(false);
  }

  onConfirm(): void {
    this.confirmService.confirm(true);
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.confirmService.question()) {
      this.onCancel();
    }
  }

  @HostListener('document:keydown.enter')
  handleEnterKey() {
    if (this.confirmService.question()) {
      this.onConfirm();
    }
  }
}
