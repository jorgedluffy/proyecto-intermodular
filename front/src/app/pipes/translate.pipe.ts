import { Pipe, PipeTransform, inject } from '@angular/core';
import { ConfigService } from '../services/config.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Hace que el pipe se re-ejecute reactivamente ante cambios en Signals de ConfigService
})
export class TranslatePipe implements PipeTransform {
  private configService = inject(ConfigService);

  transform(key: string): string {
    return this.configService.translate(key);
  }
}
