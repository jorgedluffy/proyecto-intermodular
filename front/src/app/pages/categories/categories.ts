import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService, Categoria } from '../../services/category.service';
import { CategoryModalComponent } from '../../components/category-modal/category-modal';
import { ToastService } from '../../components/toast/toast.service';
import { ConfirmService } from '../../components/confirm/confirm.service';
import { ConfigService } from '../../services/config.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CategoryModalComponent, TranslatePipe],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  public configService = inject(ConfigService);
  
  categories = this.categoryService.categories;
  searchTerm = signal('');
  isModalOpen = false;
  selectedCategory: Categoria | null = null;
  sortColumn = signal<keyof Categoria | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredCategories = computed(() => {
    let cats = [...this.categories()];
    const term = this.searchTerm().toLowerCase().trim();

    if (term) {
      cats = cats.filter(cat => 
        cat.nombre.toLowerCase().includes(term) ||
        (cat.descripcion && cat.descripcion.toLowerCase().includes(term))
      );
    }

    const col = this.sortColumn();
    if (col) {
      cats.sort((a: any, b: any) => {
        let valA = a[col];
        let valB = b[col];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        } else if (typeof valA === 'boolean') {
          valA = valA ? 1 : 0;
          valB = valB ? 1 : 0;
        }

        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';

        if (valA < valB) return this.sortDirection() === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection() === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return cats;
  });

  updateSearchTerm(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  sortBy(column: keyof Categoria | string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column as keyof Categoria);
      this.sortDirection.set('asc');
    }
  }

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  openModal(category: Categoria | null = null) {
    this.selectedCategory = category;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCategory = null;
  }

  onSaveCategory(categoryData: Partial<Categoria>) {
    const observer = {
      next: () => {
        this.closeModal();
        this.toastService.success(
          this.selectedCategory 
            ? this.configService.translate('TOAST_EDIT_CAT_SUCCESS') 
            : this.configService.translate('TOAST_ADD_CAT_SUCCESS')
        );
      },
      error: (err: any) => {
        console.error(err);
        this.toastService.error(this.configService.translate('TOAST_ERROR') + ': ' + (err.error?.error || err.message));
      }
    };

    if (this.selectedCategory && this.selectedCategory._id) {
      this.categoryService.updateCategory(this.selectedCategory._id, categoryData).subscribe(observer);
    } else {
      this.categoryService.addCategory(categoryData).subscribe(observer);
    }
  }

  async deleteCategory(id: string | undefined) {
    if (!id) return;
    const confirmed = await this.confirmService.ask(
      this.configService.translate('CONFIRM_DELETE_CATEGORY')
    );
    if (confirmed) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.toastService.success(this.configService.translate('TOAST_DELETE_CAT_SUCCESS'));
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.error(this.configService.translate('TOAST_ERROR') + ': ' + (err.error?.error || err.message));
        }
      });
    }
  }
}
