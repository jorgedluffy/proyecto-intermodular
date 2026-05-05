import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from '../../services/category.service';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-modal.html',
})
export class CategoryModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() categoryToEdit: Categoria | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Categoria>>();

  categoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      color: ['#cbd5e1'],
      activo: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryToEdit'] && this.categoryToEdit) {
      this.categoryForm.patchValue(this.categoryToEdit);
    } else if (changes['isOpen'] && this.isOpen && !this.categoryToEdit) {
      this.categoryForm.reset({ color: '#cbd5e1', activo: true });
    }
  }

  onSave() {
    if (this.categoryForm.valid) {
      this.save.emit(this.categoryForm.value);
    }
  }

  onClose() {
    this.close.emit();
    this.categoryForm.reset({ color: '#cbd5e1', activo: true });
  }
}
