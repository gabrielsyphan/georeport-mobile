import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'createReport',
        loadChildren: () => import('../create-report/create-report.module').then(m => m.CreateReportPageModule)
      },
      {
        path: 'listReports',
        loadChildren: () => import('../list-reports/list-reports.module').then(m => m.ListReportsPageModule)
      },
      {
        path: 'neighborhoodReportList',
        // tslint:disable-next-line:max-line-length
        loadChildren: () => import('../neighbodhoor-report-list/neighbodhoor-report-list.module').then(m => m.NeighbodhoorReportListPageModule)
      },
      {
        path: 'webchat',
        // tslint:disable-next-line:max-line-length
        loadChildren: () => import('../webchat/webchat.module').then(m => m.WebchatPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
