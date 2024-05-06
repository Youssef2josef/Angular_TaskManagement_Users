import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { MydashboardComponent } from './demo/components/mydashboard/mydashboard.component';
import { AuthManagerGuard } from './demo/service/auth-manager.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'dashboard', component: AppLayoutComponent, canActivate: [AuthManagerGuard],
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UikitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    // New Update Template
                    { path: 'mydashboard', component: MydashboardComponent },
                    { path: 'team', loadChildren: () => import('./demo/components/teams/teams.module').then(m => m.TeamsModule) },
                    { path: 'project', loadChildren: () => import('./demo/components/project/project.module').then(m => m.ProjectModule) },
                    { path: 'task', loadChildren: () => import('./demo/components/tasks/tasks.module').then(m => m.TasksModule) },
                    { path: 'setting-account', loadChildren: () => import('./demo/components/setting-account/setting-acount.module').then(m => m.SettingAcountModule) },

                    //{ path: 'demo-support', loadChildren: () => import('./demo/components/demo/demo.module').then(m => m.DemoModule) },
                ],
            },
            { path: '', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'recovery-password', loadChildren: () => import('./demo/components/auth/recovery-password/recovery-password.module')
                .then(m => m.RecoveryPasswordModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'pages/notfound', component: NotfoundComponent },
            { path: '**', redirectTo: 'pages/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
