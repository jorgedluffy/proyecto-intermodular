import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService, Gasto } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { ExpenseModalComponent } from '../../components/expense-modal/expense-modal';
import { ToastService } from '../../components/toast/toast.service';
import { ConfirmService } from '../../components/confirm/confirm.service';
import { ConfigService } from '../../services/config.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ExpenseModalComponent, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  public configService = inject(ConfigService);

  expenses = this.expenseService.expenses;
  categories = this.categoryService.categories;

  isModalOpen = false;
  selectedExpense: Gasto | null = null;

  searchTerm = signal('');
  sortColumn = signal<keyof Gasto | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredExpenses = computed(() => {
    let exps = [...this.expenses()];
    const term = this.searchTerm().toLowerCase();

    if (term) {
      exps = exps.filter(g =>
        g.descripcion.toLowerCase().includes(term) ||
        this.getCategoryName(g.categoria).toLowerCase().includes(term) ||
        (g.tipo && g.tipo.toLowerCase().includes(term))
      );
    }

    const col = this.sortColumn();
    if (col) {
      exps.sort((a: any, b: any) => {
        let valA = a[col];
        let valB = b[col];

        if (col === 'categoria') {
          valA = this.getCategoryName(valA).toLowerCase();
          valB = this.getCategoryName(valB).toLowerCase();
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return this.sortDirection() === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection() === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return exps;
  });

  ngOnInit() {
    this.expenseService.loadExpenses();
    this.categoryService.loadCategories();
  }

  // Helper method to extract the name if categoria is populated
  getCategoryName(categoria: any): string {
    if (!categoria) return 'Sin categoría';
    return typeof categoria === 'object' ? categoria.nombre : categoria;
  }

  openModal(expense: Gasto | null = null) {
    this.selectedExpense = expense;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedExpense = null;
  }

  onSaveExpense(expenseData: Partial<Gasto>) {
    const observer = {
      next: () => {
        this.closeModal();
        this.toastService.success(
          this.selectedExpense 
            ? this.configService.translate('TOAST_EDIT_EXP_SUCCESS') 
            : this.configService.translate('TOAST_ADD_EXP_SUCCESS')
        );
      },
      error: (err: any) => {
        console.error(err);
        this.toastService.error(this.configService.translate('TOAST_ERROR') + ': ' + (err.error?.error || err.message));
      }
    };

    if (this.selectedExpense && this.selectedExpense._id) {
      this.expenseService.updateExpense(this.selectedExpense._id, expenseData).subscribe(observer);
    } else {
      this.expenseService.addExpense(expenseData).subscribe(observer);
    }
  }

  async deleteExpense(id: string | undefined) {
    if (!id) return;
    const confirmed = await this.confirmService.ask(this.configService.translate('CONFIRM_DELETE_EXPENSE'));
    if (confirmed) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.toastService.success(this.configService.translate('TOAST_DELETE_EXP_SUCCESS'));
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.error(this.configService.translate('TOAST_ERROR') + ': ' + (err.error?.error || err.message));
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.expenseService.importFile(file).subscribe({
        next: (res: any) => {
          this.toastService.success(this.configService.translate('TOAST_IMPORT_SUCCESS'));
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.error(this.configService.translate('TOAST_IMPORT_ERROR') + ': ' + (err.error?.error || err.message));
        }
      });
    }
    event.target.value = null; // reset to allow selecting the same file again
  }

  updateSearchTerm(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  sortBy(column: keyof Gasto | string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column as keyof Gasto);
      this.sortDirection.set('asc');
    }
  }
}
