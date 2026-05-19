import { Injectable, signal, inject, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ConfigService } from './config.service';

export interface Categoria {
  _id?: string;
  nombre: string;
  color?: string;
  descripcion?: string;
  activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private apiUrl = 'http://localhost:5000/categorias';

  private categoriesSignal = signal<Categoria[]>([]);
  public categories = computed(() => this.categoriesSignal());

  constructor() {
    // Escuchar reactivamente los cambios en idioma para recargar
    effect(() => {
      this.configService.language();
      this.loadCategories();
    });
  }

  loadCategories(): void {
    this.http.get<Categoria[]>(this.apiUrl).subscribe(data => {
      this.categoriesSignal.set(data);
    });
  }

  addCategory(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria).pipe(
      tap((newCat) => {
        this.categoriesSignal.update(cats => [...cats, newCat]);
      })
    );
  }

  updateCategory(id: string, categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria).pipe(
      tap((updatedCat) => {
        this.categoriesSignal.update(cats =>
          cats.map(c => c._id === id ? updatedCat : c)
        );
      })
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.categoriesSignal.update(cats => cats.filter(c => c._id !== id));
      })
    );
  }
}
