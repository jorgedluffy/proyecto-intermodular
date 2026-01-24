import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  expenses = [
    {
      date: '2023-10-15',
      concept: 'Groceries',
      amount: 150.0,
      type: 'Expense',
      category: 'Food',
      source: 'Credit Card',
    },
    {
      date: '2023-10-14',
      concept: 'Salary',
      amount: 3000.0,
      type: 'Income',
      category: 'Work',
      source: 'Bank Transfer',
    },
    {
      date: '2023-10-12',
      concept: 'Utilities',
      amount: 250.0,
      type: 'Expense',
      category: 'Bills',
      source: 'Direct Debit',
    },
  ];
}
