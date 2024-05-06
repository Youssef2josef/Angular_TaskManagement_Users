import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartTaskComponent } from './chart-task/chart-task.component';
import { ListTaskComponent } from './list-task/list-task.component';

const routes: Routes = [

  { path: 'list', component: ListTaskComponent },
  { path: 'chart', component: ChartTaskComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
