import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
        { path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
        { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
        { path: 'register/manager', loadChildren: () => import('./register-manager/register-manager.module')
        .then(m => m.RegisterManagerModule) },
        { path: 'recovery-password', loadChildren: () => import('./recovery-password/recovery-password.module').
        then(m => m.RecoveryPasswordModule) }

    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
