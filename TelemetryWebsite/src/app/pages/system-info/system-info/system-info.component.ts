import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-system-info',
  standalone: true,
  imports: [],
  templateUrl: './system-info.component.html',
  styleUrl: './system-info.component.scss'
})
export class SystemInfoComponent {
  public dashboardName: string = "";
  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.dashboardName = params.get('dashboardName')?? "";
    });
  }
}
