import { Component, inject, OnInit, effect } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class OverviewComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);

  expenses = this.expenseService.expenses;
  categories = this.categoryService.categories;

  // --- CONFIGURACIÓN GRÁFICO DE LÍNEAS (Evolución) ---
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingreso',
        fill: false,
        tension: 0.1,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6',
      },
      {
        data: [],
        label: 'Gasto',
        fill: false,
        tension: 0.1,
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
        pointBackgroundColor: '#ef4444',
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
    },
  };

  // --- CONFIGURACIÓN GRÁFICO CIRCULAR (Categorías) ---
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
    },
  };

  constructor() {
    effect(() => {
      this.updateCharts(this.expenses(), this.categories());
    });
  }

  ngOnInit() {
    this.expenseService.loadExpenses();
    this.categoryService.loadCategories();
  }

  private updateCharts(gastos: any[], categorias: any[]) {
    if (!gastos || !categorias) return;

    // --- Process Pie Chart (Gastos por Categoría) ---
    const expensesByCategory = new Map<string, number>();
    gastos.forEach(g => {
      // Filtrar solo los que sean de tipo "gasto" si existe el tipo, 
      // o agrupar todo si asumimos que la vista es de gastos.
      if (g.tipo && g.tipo.toLowerCase() !== 'gasto') return;

      const catName = typeof g.categoria === 'object' && g.categoria?.nombre ? g.categoria.nombre : (g.categoria || 'Sin categoría');
      expensesByCategory.set(catName, (expensesByCategory.get(catName) || 0) + g.cantidad);
    });

    const pieLabels = Array.from(expensesByCategory.keys());
    const pieData = Array.from(expensesByCategory.values());
    const pieColors = pieLabels.map(label => {
      const cat = categorias.find(c => c.nombre === label);
      return cat?.color || '#cbd5e1'; // default gray
    });

    this.pieChartData = {
      labels: pieLabels,
      datasets: [{
        data: pieData,
        backgroundColor: pieColors,
        hoverBackgroundColor: pieColors,
      }]
    };

    // --- Process Line Chart (Evolución por Mes) ---
    // Extract months
    const monthlyData = new Map<string, { ingresos: number, gastos: number }>();
    
    gastos.forEach(g => {
      if (!g.fecha) return;
      const d = new Date(g.fecha);
      const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, { ingresos: 0, gastos: 0 });
      }
      
      const current = monthlyData.get(monthYear)!;
      if (g.tipo && g.tipo.toLowerCase() === 'ingreso') {
        current.ingresos += g.cantidad;
      } else {
        current.gastos += g.cantidad;
      }
    });

    // Sort months chronological
    const sortedMonths = Array.from(monthlyData.keys()).sort();
    
    this.lineChartData = {
      labels: sortedMonths,
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: sortedMonths.map(m => monthlyData.get(m)!.ingresos)
        },
        {
          ...this.lineChartData.datasets[1],
          data: sortedMonths.map(m => monthlyData.get(m)!.gastos)
        }
      ]
    };
  }
}
