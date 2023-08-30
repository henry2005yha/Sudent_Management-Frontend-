import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { StudentListComponent } from './student-list/student-list.component';

const routes: Routes = [
  {path:'', redirectTo:'student',pathMatch:"full"},
  {path:'student/register/:syskey',component:FormComponent},
  {path:'student/register',component:FormComponent},
  {path:'student',component:StudentListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
