import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'markers',
    loadComponent: () =>
      import('./pages/markers-page/markers-page.component').then(
        (m) => m.MarkersPageComponent
      ),
    title: 'Marcadores',
  },
  {
    path: 'houses',
    loadComponent: () =>
      import('./pages/houses-page/houses-page.component').then(
        (m) => m.HousesPageComponent
      ),
    title: 'Casas - Propiedades disponibles',
  },
  {
    path: 'fullscreen',
    loadComponent: () =>
      import('./pages/fullscreen-map-page/fullscreen-map-page.component').then(
        (m) => m.FullscreenMapPageComponent
      ),
    title: 'FullScreen Map',
  },
  {
    path: '**',
    redirectTo: 'fullscreen',
  },
];
