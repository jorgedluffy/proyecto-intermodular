import { Component, inject, OnInit, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ExpenseService, Gasto } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { ConfigService } from '../../services/config.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, TranslatePipe],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class OverviewComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);
  public configService = inject(ConfigService);

  expenses = this.expenseService.expenses;
  categories = this.categoryService.categories;

  // --- FILTERS STATE (Signals) ---
  showFilters = signal(false);
  timeframe = signal<string>('all');
  startDate = signal<string>('');
  endDate = signal<string>('');
  selectedCategory = signal<string>('');
  minAmount = signal<number | null>(null);
  maxAmount = signal<number | null>(null);

  // --- COMPUTED: Filtered Expenses ---
  filteredExpenses = computed(() => {
    let list = [...this.expenses()];
    const tf = this.timeframe();
    const cat = this.selectedCategory();
    const min = this.minAmount();
    const max = this.maxAmount();

    // 1. Timeframe filtering
    if (tf !== 'all') {
      const now = new Date();
      if (tf === 'this-month') {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        list = list.filter(e => {
          if (!e.fecha) return false;
          const d = new Date(e.fecha);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
      } else if (tf === 'last-3-months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        list = list.filter(e => {
          if (!e.fecha) return false;
          const d = new Date(e.fecha);
          return d >= threeMonthsAgo && d <= now;
        });
      } else if (tf === 'this-year') {
        const currentYear = now.getFullYear();
        list = list.filter(e => {
          if (!e.fecha) return false;
          const d = new Date(e.fecha);
          return d.getFullYear() === currentYear;
        });
      } else if (tf === 'custom') {
        const start = this.startDate();
        const end = this.endDate();
        list = list.filter(e => {
          if (!e.fecha) return false;
          const d = new Date(e.fecha).toISOString().split('T')[0];
          if (start && d < start) return false;
          if (end && d > end) return false;
          return true;
        });
      }
    }

    // 2. Category filtering
    if (cat) {
      list = list.filter(e => {
        const catId = typeof e.categoria === 'object' && e.categoria !== null 
          ? (e.categoria as any)._id 
          : e.categoria;
        return catId === cat;
      });
    }

    // 3. Amount filtering
    if (min !== null && min !== undefined && min !== 0) {
      list = list.filter(e => e.cantidad >= min);
    }
    if (max !== null && max !== undefined && max !== 0) {
      list = list.filter(e => e.cantidad <= max);
    }

    return list;
  });

  // --- COMPUTED: KPIs ---
  kpis = computed(() => {
    const list = this.filteredExpenses();
    let totalIngresos = 0;
    let totalGastos = 0;

    list.forEach(e => {
      if (e.tipo === 'Ingreso') {
        totalIngresos += e.cantidad;
      } else {
        totalGastos += e.cantidad;
      }
    });

    const balance = totalIngresos - totalGastos;
    const tasaAhorro = totalIngresos > 0 ? (balance / totalIngresos) * 100 : 0;

    return {
      totalIngresos,
      totalGastos,
      balance,
      tasaAhorro
    };
  });

  // --- CONFIGURACIÓN GRÁFICO DE LÍNEAS (Evolución) ---
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingresos',
        fill: true,
        tension: 0.3,
        borderColor: '#10b981', // emerald-500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981',
      },
      {
        data: [],
        label: 'Gastos',
        fill: true,
        tension: 0.3,
        borderColor: '#f43f5e', // rose-500
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        pointBackgroundColor: '#f43f5e',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f43f5e',
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } },
    },
    scales: {
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { callback: (val) => `${val} €` }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  // --- CONFIGURACIÓN GRÁFICO CIRCULAR (Categorías) ---
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderWidth: 2,
        borderColor: '#fff'
      },
    ],
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } },
    },
  };

  constructor() {
    effect(() => {
      const activeCurrency = this.configService.currency();
      let symbol = '€';
      if (activeCurrency === 'USD') symbol = '$';
      else if (activeCurrency === 'GBP') symbol = '£';

      this.lineChartOptions = {
        ...this.lineChartOptions,
        scales: {
          ...this.lineChartOptions.scales,
          y: {
            ...this.lineChartOptions.scales?.['y'],
            ticks: {
              callback: (val) => `${val} ${symbol}`
            }
          }
        }
      };

      this.updateCharts(this.filteredExpenses(), this.categories());
    });
  }

  ngOnInit() {
    this.expenseService.loadExpenses();
    this.categoryService.loadCategories();
  }

  toggleFilters() {
    this.showFilters.update(v => !v);
  }

  clearFilters() {
    this.timeframe.set('all');
    this.startDate.set('');
    this.endDate.set('');
    this.selectedCategory.set('');
    this.minAmount.set(null);
    this.maxAmount.set(null);
  }

  private updateCharts(gastos: any[], categorias: any[]) {
    if (!gastos || !categorias) return;

    // --- Process Pie Chart (Gastos por Categoría) ---
    const expensesByCategory = new Map<string, number>();
    gastos.forEach(g => {
      if (g.tipo && g.tipo.toLowerCase() !== 'gasto') return;

      const catName = typeof g.categoria === 'object' && g.categoria?.nombre 
        ? g.categoria.nombre 
        : (categorias.find(c => c._id === g.categoria)?.nombre || 'Sin categoría');
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
    const monthlyData = new Map<string, { ingresos: number, gastos: number }>();
    
    gastos.forEach(g => {
      if (!g.fecha) return;
      const d = new Date(g.fecha);
      const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, { ingresos: 0, gastos: 0 });
      }
      
      const current = monthlyData.get(monthYear)!;
      if (g.tipo === 'Ingreso') {
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
