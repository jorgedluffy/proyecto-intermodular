import { Component, inject, OnInit } from '@angular/core';
import { CategoryService, Categoria } from '../../services/category.service';
import { CategoryModalComponent } from '../../components/category-modal/category-modal';

@Component({
  selector: 'app-categories',
  imports: [CategoryModalComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);
  categories = this.categoryService.categories;

  isModalOpen = false;
  selectedCategory: Categoria | null = null;

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
      next: () => this.closeModal(),
      error: (err: any) => {
        console.error(err);
        alert('Error al guardar: ' + (err.error?.error || err.message));
      }
    };

    if (this.selectedCategory && this.selectedCategory._id) {
      this.categoryService.updateCategory(this.selectedCategory._id, categoryData).subscribe(observer);
    } else {
      this.categoryService.addCategory(categoryData).subscribe(observer);
    }
  }

  deleteCategory(id: string | undefined) {
    if (id && confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe();
    }
  }
}
