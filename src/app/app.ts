import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { LoadingService } from './services/loading.service';
import { MandalDataService } from './services/mandal-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly showExcelModal = signal<boolean>(false);
  readonly loadingService = inject(LoadingService);
  readonly mandalData = inject(MandalDataService);
  private readonly router = inject(Router);


  constructor() {
    // Listen to router events for smooth top-pinned progress bar
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.startTopBar();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.stopTopBar();
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  openExcelModal() {
    this.showExcelModal.set(true);
    this.closeMobileMenu();
  }

  closeExcelModal() {
    this.showExcelModal.set(false);
  }

  async onExcelFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      await this.mandalData.loadExcelFromFile(file);
      // Reset file input value so selecting the same file again triggers change
      input.value = '';
    }
  }

  downloadExcelTemplate() {
    this.mandalData.downloadExcelTemplate();
  }

  async reloadFromPublicExcel() {
    await this.mandalData.loadMasterExcelFromPublic();
  }
}

