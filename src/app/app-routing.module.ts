import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tab2',
    redirectTo: '/tabs/tab2',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'createReport',
    redirectTo: '/tabs/createReport',
    pathMatch: 'full'
  },
  {
    path: 'listReports',
    redirectTo: '/tabs/listReports',
    pathMatch: 'full'
  },
  {
    path: 'neighborhoodReportList',
    redirectTo: '/tabs/neighborhoodReportList',
    pathMatch: 'full'
  },
  {
    path: 'webchat',
    redirectTo: '/tabs/webchat',
    pathMatch: 'full'
  },
  {
    path: 'create-report',
    loadChildren: () => import('./create-report/create-report.module').then( m => m.CreateReportPageModule)
  },
  {
    path: 'my-report-data',
    loadChildren: () => import('./my-report-data/my-report-data.module').then( m => m.MyReportDataPageModule)
  },
  {
    path: 'edit-report',
    loadChildren: () => import('./edit-report/edit-report.module').then( m => m.EditReportPageModule)
  },
  {
    path: 'list-reports',
    loadChildren: () => import('./list-reports/list-reports.module').then( m => m.ListReportsPageModule)
  },
  {
    path: 'neighbodhoor-report-list',
    loadChildren: () => import('./neighbodhoor-report-list/neighbodhoor-report-list.module').then( m => m.NeighbodhoorReportListPageModule)
  },
  {
    path: 'online-report-data',
    loadChildren: () => import('./online-report-data/online-report-data.module').then( m => m.OnlineReportDataPageModule)
  },
  {
    path: 'webchat',
    loadChildren: () => import('./webchat/webchat.module').then( m => m.WebchatPageModule)
  },
  {
    path: 'register-account',
    loadChildren: () => import('./register-account/register-account.module').then( m => m.RegisterAccountPageModule)
  },
  {
    path: 'create-notification',
    loadChildren: () => import('./create-notification/create-notification.module').then( m => m.CreateNotificationPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
