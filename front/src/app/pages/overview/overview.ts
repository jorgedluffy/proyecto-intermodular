import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts'; // Importante

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [BaseChartDirective], // Importamos la directiva aquí
  templateUrl: './overview.html',
  styleUrl: './overview.css', // O .scss
})
export class OverviewComponent {
  // --- CONFIGURACIÓN GRÁFICO DE LÍNEAS (Evolución) ---
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Income',
        fill: false, // Solo línea
        tension: 0.1, // Suavizado de curva
        borderColor: '#3b82f6', // Azul (Tailwind blue-500)
        backgroundColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6',
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Expense',
        fill: false,
        tension: 0.1,
        borderColor: '#ef4444', // Rojo (Tailwind red-500)
        backgroundColor: '#ef4444',
        pointBackgroundColor: '#ef4444',
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false, // Para que se adapte al contenedor de Tailwind
    plugins: {
      legend: { display: true, position: 'bottom' },
    },
  };

  // --- CONFIGURACIÓN GRÁFICO CIRCULAR (Categorías) ---
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Food', 'Rent', 'Transport', 'Entertainment'],
    datasets: [
      {
        data: [300, 500, 100, 150],
        backgroundColor: [
          // Colores del mockup
          '#fca5a5', // Rojo claro
          '#fcd34d', // Amarillo
          '#60a5fa', // Azul
          '#4ade80', // Verde
        ],
        hoverBackgroundColor: ['#f87171', '#fbbf24', '#3b82f6', '#22c55e'],
      },
    ],
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }, // Leyenda a la derecha como en tu imagen
    },
  };
}
