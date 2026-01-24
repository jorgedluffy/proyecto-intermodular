import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categories = [
    { name: 'Electricidad', description: 'Gastos de luz', color: '#EF4444', active: true },
    {
      name: 'Hogar',
      description: 'Gastos generales no especificados (renta)',
      color: '#10B981',
      active: false,
    },
    { name: 'Supermkt', description: 'Gastos de supermercado', color: '#C4B5FD', active: true },
  ];
}
