import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrConfig } from 'ngx-toastr';
import { HighchartsChartModule } from 'highcharts-angular';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  importProvidersFrom(HttpClient),
  provideHttpClient(withFetch()),
  provideAnimations(),
  provideToastr(),
  importProvidersFrom(HighchartsChartModule)

  ]
};
