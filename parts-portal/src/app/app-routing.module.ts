import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartListComponent } from './parts/part-list/part-list.component';
import { PartCreateComponent } from './parts/part-create/part-create.component';
import { LoginComponent } from './authorization/login/login.component';
import { AuthorizationGuard } from './authorization/authorization.guard';

const routes: Routes = [
  { path: '', component: PartListComponent},
  { path: 'create', component: PartCreateComponent, canActivate: [AuthorizationGuard]},
  { path: 'edit/:partId', component: PartCreateComponent, canActivate: [AuthorizationGuard]},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthorizationGuard]
})
export class AppRoutingModule {}
