import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private expenseService = inject(ExpenseService);
  expenses = this.expenseService.expenses;

  ngOnInit() {
    this.expenseService.loadExpenses();
  }

  // Helper method to extract the name if categoria is populated
  getCategoryName(categoria: any): string {
    if (!categoria) return 'Sin categoría';
    return typeof categoria === 'object' ? categoria.nombre : categoria;
  }
}
