import { Injectable, signal } from '@angular/core';

export interface ConfirmData {
  message: string;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private questionSignal = signal<ConfirmData | null>(null);
  public question = this.questionSignal.asReadonly();

  ask(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.questionSignal.set({ message, resolve });
    });
  }

  confirm(value: boolean): void {
    const current = this.questionSignal();
    if (current) {
      current.resolve(value);
      this.questionSignal.set(null);
    }
  }
}
