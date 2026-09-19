import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MandalDataService } from '../../services/mandal-data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'block w-full'
  },
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
      
      <!-- Chart 1: वर्गणी - स्त्रोतानुसार वितरण (Vertical Bar Chart) -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-4.5 md:p-5 flex flex-col justify-between h-full">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm sm:text-base font-bold text-slate-800 font-devanagari">
            {{ mandalData.t('वर्गणी - स्त्रोतानुसार वितरण', 'Vargani - Distribution by Source') }}
          </h3>
        </div>
        <div class="relative w-full h-[220px]">
          <canvas #barCanvas></canvas>
        </div>
      </div>

      <!-- Chart 2: जमा - खर्चाचा आढावा (Pie Chart) -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-4.5 md:p-5 flex flex-col justify-between h-full">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm sm:text-base font-bold text-slate-800 font-devanagari">
            {{ mandalData.t('जमा - खर्चाचा आढावा', 'Income - Expense Overview') }}
          </h3>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-3 min-h-[220px]">
          <div class="relative w-[150px] sm:w-[170px] h-[150px] sm:h-[170px] shrink-0">
            <canvas #pieCanvas></canvas>
          </div>
          <!-- Custom Legend matching reference image -->
          <div class="flex flex-row sm:flex-col justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-slate-700 font-devanagari flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-[#22c55e] inline-block shrink-0"></span>
              <span>{{ mandalData.t('वर्गणी', 'Donations') }} ({{ mandalData.formatNum(mandalData.kpi().totalVargani, true) }})</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-[#ef4444] inline-block shrink-0"></span>
              <span>{{ mandalData.t('खर्च', 'Expenses') }} ({{ mandalData.formatNum(mandalData.kpi().totalKharch, true) }})</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-[#3b82f6] inline-block shrink-0"></span>
              <span>{{ mandalData.t('शिल्लक', 'Balance') }} ({{ mandalData.formatNum(mandalData.kpi().balanceAmount, true) }})</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Chart 3: खर्चाचे वितरण (Horizontal Bar Chart) -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-4.5 md:p-5 flex flex-col justify-between h-full">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm sm:text-base font-bold text-slate-800 font-devanagari">
            {{ mandalData.t('खर्चाचे वितरण', 'Expense Distribution') }}
          </h3>
        </div>
        <div class="relative w-full h-[220px]" [class.hidden]="mandalData.expenseDistribution().length === 0">
          <canvas #horizontalBarCanvas></canvas>
        </div>
        @if (mandalData.expenseDistribution().length === 0) {
          <div class="flex flex-col items-center justify-center h-[220px] text-center text-slate-400 p-4">
            <span class="text-3xl mb-1.5">📊</span>
            <p class="text-xs font-devanagari font-semibold text-slate-600">
              {{ mandalData.t('या निवडीसाठी खर्चाची नोंद उपलब्ध नाही.', 'No expense records available for this selection.') }}
            </p>
          </div>
        }
      </div>

    </div>
  `
})
export class DashboardChartsComponent implements AfterViewInit, OnDestroy {
  readonly mandalData = inject(MandalDataService);

  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('horizontalBarCanvas') horizontalBarCanvas!: ElementRef<HTMLCanvasElement>;

  private barChart: Chart | null = null;
  private pieChart: Chart | null = null;
  private horizontalBarChart: Chart | null = null;

  constructor() {
    // Reactive effect to rebuild or update charts when data or digit language changes
    effect(() => {
      // track dependencies
      this.mandalData.selectedLanguage();
      this.mandalData.buildingDistribution();
      this.mandalData.kpi();
      this.mandalData.expenseDistribution();
      this.mandalData.useMarathiDigits();

      this.updateCharts();
    });
  }

  ngAfterViewInit() {
    this.createBarChart();
    this.createPieChart();
    this.createHorizontalBarChart();
  }

  ngOnDestroy() {
    this.barChart?.destroy();
    this.pieChart?.destroy();
    this.horizontalBarChart?.destroy();
  }

  private createBarChart() {
    const ctx = this.barCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.mandalData.buildingDistribution();
    const mandal = this.mandalData;

    // Plugin to draw value labels above bars (e.g. १,८०,००० / 1,80,000)
    const valueLabelsPlugin = {
      id: 'valueLabels',
      afterDatasetsDraw(chart: any) {
        const { ctx, data } = chart;
        ctx.save();
        ctx.font = '600 11px Mukta, sans-serif';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        chart.getDatasetMeta(0).data.forEach((bar: any, index: number) => {
          const val = data.datasets[0].data[index];
          if (val > 0) {
            ctx.fillText(mandal.formatNum(val), bar.x, bar.y - 4);
          }
        });
        ctx.restore();
      }
    };

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => mandal.translateBuilding(d.building)),
        datasets: [{
          data: data.map(d => d.amount),
          backgroundColor: data.map(d => d.color),
          borderRadius: 3,
          barThickness: 38
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 20 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${mandal.t('रक्कम', 'Amount')}: ${mandal.formatNum(ctx.raw, true)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 10, family: 'Mukta, sans-serif' },
              color: '#64748b',
              callback: (val) => mandal.formatNum(Number(val))
            },
            grid: {
              color: '#f1f5f9'
            },
            border: {
              dash: [4, 4]
            }
          },
          x: {
            ticks: {
              font: { size: 11, family: 'Mukta, sans-serif', weight: 'bold' as any },
              color: '#334155'
            },
            grid: { display: false }
          }
        }
      },
      plugins: [valueLabelsPlugin]
    });
  }

  private createPieChart() {
    const ctx = this.pieCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const mandal = this.mandalData;

    // Percentages: 55% Vargani, 29% Kharch, 16% Balance
    const piePercentagesPlugin = {
      id: 'piePercentages',
      afterDatasetsDraw(chart: any) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        ctx.save();
        ctx.font = 'bold 12px Mukta, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const labels = [
          mandal.toMarathiDigits('55%'),
          mandal.toMarathiDigits('29%'),
          mandal.toMarathiDigits('16%')
        ];
        meta.data.forEach((arc: any, index: number) => {
          const center = arc.getCenterPoint();
          ctx.fillText(labels[index], center.x, center.y);
        });
        ctx.restore();
      }
    };

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [mandal.t('वर्गणी', 'Donations'), mandal.t('खर्च', 'Expenses'), mandal.t('शिल्लक', 'Balance')],
        datasets: [{
          data: [55, 29, 16],
          backgroundColor: ['#22c55e', '#ef4444', '#3b82f6'],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${mandal.toMarathiDigits(ctx.raw)}%`
            }
          }
        }
      },
      plugins: [piePercentagesPlugin]
    });
  }

  private createHorizontalBarChart() {
    const ctx = this.horizontalBarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.mandalData.expenseDistribution().filter(d => d.amount > 0);
    const mandal = this.mandalData;
    const maxVal = data.length > 0 ? Math.max(...data.map(d => d.amount)) : 10000;

    // Plugin for right aligned value labels: e.g. ₹ १,००,०००
    const horizontalValueLabelsPlugin = {
      id: 'horizontalValueLabels',
      afterDatasetsDraw(chart: any) {
        const { ctx, data } = chart;
        ctx.save();
        ctx.font = 'bold 11px Mukta, sans-serif';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        chart.getDatasetMeta(0).data.forEach((bar: any, index: number) => {
          const val = data.datasets[0].data[index];
          if (val > 0) {
            ctx.fillText(mandal.formatNum(val, true), bar.x + 8, bar.y);
          }
        });
        ctx.restore();
      }
    };

    this.horizontalBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => mandal.translateCategory(d.category)),
        datasets: [{
          data: data.map(d => d.amount),
          backgroundColor: data.map(d => d.color),
          borderRadius: 3,
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { right: 75 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${mandal.t('रक्कम', 'Amount')}: ${mandal.formatNum(ctx.raw, true)}`
            }
          }
        },
        scales: {
          x: {
            display: false,
            beginAtZero: true,
            max: Math.round(maxVal * 1.35)
          },
          y: {
            ticks: {
              font: { size: 11, family: 'Mukta, sans-serif', weight: 'bold' as any },
              color: '#334155'
            },
            grid: { display: false }
          }
        }
      },
      plugins: [horizontalValueLabelsPlugin]
    });
  }

  private updateCharts() {
    const mandal = this.mandalData;

    // 1. Update Bar Chart
    const bData = this.mandalData.buildingDistribution();
    if (this.barChart) {
      this.barChart.data.labels = bData.map(d => mandal.translateBuilding(d.building));
      this.barChart.data.datasets[0].data = bData.map(d => d.amount);
      this.barChart.data.datasets[0].backgroundColor = bData.map(d => d.color);
      this.barChart.update();
    }

    // 2. Update Pie Chart
    if (this.pieChart) {
      this.pieChart.data.labels = [mandal.t('वर्गणी', 'Donations'), mandal.t('खर्च', 'Expenses'), mandal.t('शिल्लक', 'Balance')];
      this.pieChart.update();
    }

    // 3. Update Horizontal Bar Chart (Hide 0 values)
    const expData = this.mandalData.expenseDistribution().filter(d => d.amount > 0);
    if (this.horizontalBarChart) {
      this.horizontalBarChart.data.labels = expData.map(d => mandal.translateCategory(d.category));
      this.horizontalBarChart.data.datasets[0].data = expData.map(d => d.amount);
      this.horizontalBarChart.data.datasets[0].backgroundColor = expData.map(d => d.color);
      const maxVal = expData.length > 0 ? Math.max(...expData.map(d => d.amount)) : 10000;
      if (this.horizontalBarChart.options.scales?.['x']) {
        this.horizontalBarChart.options.scales['x'].max = Math.round(maxVal * 1.35);
      }
      this.horizontalBarChart.update();
    } else if (this.horizontalBarCanvas?.nativeElement && expData.length > 0) {
      this.createHorizontalBarChart();
    }
  }
}


