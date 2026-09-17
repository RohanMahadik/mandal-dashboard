import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /** Full-screen cultural splash / action loader */
  readonly isFullscreenLoading = signal<boolean>(true);
  
  /** Top-pinned rapid route progress bar */
  readonly isTopBarLoading = signal<boolean>(false);

  /** Primary Devanagari spiritual blessing or heading */
  readonly primaryMessage = signal<string>('॥ गणपती बाप्पा मोरया ॥');

  /** Sub-status text */
  readonly subMessage = signal<string>('माहिती लोड होत आहे...');

  private hideTimeout: any = null;

  constructor() {
    // Initial application startup splash screen (shows for 850ms then smoothly fades out)
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.hideFullscreen();
      }, 900);
    }
  }

  /**
   * Display the full-screen attractive cultural loader
   * @param primary Main heading text (default: '॥ गणपती बाप्पा मोरया ॥')
   * @param sub Subtitle / status (default: 'माहिती लोड होत आहे...')
   * @param autoHideMs Optional duration after which it automatically fades out
   */
  showFullscreen(
    primary: string = '॥ गणपती बाप्पा मोरया ॥',
    sub: string = 'माहिती लोड होत आहे...',
    autoHideMs: number = 0
  ) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.primaryMessage.set(primary);
    this.subMessage.set(sub);
    this.isFullscreenLoading.set(true);

    if (autoHideMs > 0) {
      this.hideTimeout = setTimeout(() => {
        this.hideFullscreen();
      }, autoHideMs);
    }
  }

  /**
   * Smoothly hide the full-screen loader
   */
  hideFullscreen() {
    this.isFullscreenLoading.set(false);
  }

  /**
   * Show top-pinned slim route progress bar
   */
  startTopBar() {
    this.isTopBarLoading.set(true);
  }

  /**
   * Complete and hide top-pinned slim route progress bar
   */
  stopTopBar() {
    // Slight delay so the user perceives the smooth completion
    setTimeout(() => {
      this.isTopBarLoading.set(false);
    }, 250);
  }
}
