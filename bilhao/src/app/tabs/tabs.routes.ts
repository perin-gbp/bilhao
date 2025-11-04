import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'contador',
        loadComponent: () => import('../contador/contador.page').then(m => m.ContadorPage),
      },
      {
        path: 'agradecimento',
        loadComponent: () => import('../agradecimento/agradecimento.page').then(m => m.AgradecimentoPage),
      },
      {
        path: '',
        redirectTo: '/contador',
        pathMatch: 'full',
      },
    ],
  },
];
