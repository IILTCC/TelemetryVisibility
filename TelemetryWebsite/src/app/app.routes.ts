import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulatorPageComponent } from './pages/simulator/simulator-page/simulator-page.component';
import { ArchivePageComponent } from './pages/archive-page/archive-page.component';
import { SystemInfoComponent } from './pages/system-info/system-info/system-info.component';

export const routes: Routes = [
    { path: 'simulator', component: SimulatorPageComponent },
    { path: 'archive', component: ArchivePageComponent },
    { path: 'system-info/:dashboardName', component:SystemInfoComponent }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }