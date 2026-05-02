import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);
  categories = this.categoryService.categories;

  ngOnInit() {
    this.categoryService.loadCategories();
  }
}
