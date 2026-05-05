import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gasto } from '../../services/expense.service';
import { Categoria } from '../../services/category.service';

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-modal.html',
})
export class ExpenseModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() expenseToEdit: Gasto | null = null;
  @Input() categories: Categoria[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Gasto>>();

  expenseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      fecha: [new Date().toISOString().split('T')[0]],
      descripcion: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(0.01)]],
      tipo: ['Gasto', Validators.required],
      categoria: ['', Validators.required],
      source: ['Manual', Validators.required],
      nota: ['Sin nota', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expenseToEdit'] && this.expenseToEdit) {
      this.expenseForm.patchValue({
        ...this.expenseToEdit,
        fecha: this.expenseToEdit.fecha 
          ? new Date(this.expenseToEdit.fecha).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
        categoria: typeof this.expenseToEdit.categoria === 'object' && this.expenseToEdit.categoria !== null
          ? (this.expenseToEdit.categoria as Categoria)._id 
          : this.expenseToEdit.categoria
      });
    } else if (changes['isOpen'] && this.isOpen && !this.expenseToEdit) {
      this.expenseForm.reset({
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'Gasto',
        source: 'Manual',
        nota: 'Sin nota'
      });
    }
  }

  onSave() {
    if (this.expenseForm.valid) {
      this.save.emit(this.expenseForm.value);
    }
  }

  onClose() {
    this.close.emit();
    this.expenseForm.reset({ tipo: 'Gasto', source: 'Manual', fecha: new Date().toISOString().split('T')[0], nota: 'Sin nota' });
  }
}
