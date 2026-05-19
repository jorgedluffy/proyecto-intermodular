import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigService } from '../services/config.service';

export const configInterceptor: HttpInterceptorFn = (req, next) => {
  const configService = inject(ConfigService);

  // Clonar la request e inyectar cabeceras de idioma y moneda activos
  const clonedRequest = req.clone({
    setHeaders: {
      'Accept-Language': configService.language(),
      'X-Currency': configService.currency()
    }
  });

  return next(clonedRequest);
};
