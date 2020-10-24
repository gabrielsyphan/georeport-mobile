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
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
