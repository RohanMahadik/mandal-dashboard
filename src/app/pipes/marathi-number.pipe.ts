import { Pipe, PipeTransform, inject } from '@angular/core';
import { MandalDataService } from '../services/mandal-data.service';

@Pipe({
  name: 'mnum',
  standalone: true,
  pure: false
})
export class MarathiNumberPipe implements PipeTransform {
  private mandalData = inject(MandalDataService);

  /**
   * Transforms number or text containing digits to Marathi numerals
   * @param value numeric or string value
   * @param isCurrency if true, prepends '₹ '
   */
  transform(value: any, isCurrency: boolean = false): string {
    return this.mandalData.formatNum(value, isCurrency);
  }
}
