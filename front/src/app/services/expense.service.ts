import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Categoria } from './category.service';

export interface Gasto {
  _id?: string;
  descripcion: string;
  nota: string;
  tipo: string;
  cantidad: number;
  categoria: string | Categoria;
  source: string;
  fecha?: string | Date;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/gastos';

  private expensesSignal = signal<Gasto[]>([]);
  public expenses = computed(() => this.expensesSignal());

  loadExpenses(): void {
    this.http.get<Gasto[]>(this.apiUrl).subscribe(data => {
      this.expensesSignal.set(data);
    });
  }

  addExpense(gasto: Partial<Gasto>): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, gasto).pipe(
      tap((newExp) => {
        this.expensesSignal.update(exps => [...exps, newExp]);
      })
    );
  }

  updateExpense(id: string, gasto: Partial<Gasto>): Observable<Gasto> {
    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, gasto).pipe(
      tap((updatedExp) => {
        this.expensesSignal.update(exps =>
          exps.map(e => e._id === id ? updatedExp : e)
        );
      })
    );
  }

  deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.expensesSignal.update(exps => exps.filter(e => e._id !== id));
      })
    );
  }

  importFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://localhost:5000/cargarCsv', formData).pipe(
      tap(() => {
        this.loadExpenses();
      })
    );
  }

  exportFile(): void {
    window.open('http://localhost:5000/descargarCsv', '_blank');
  }
}
