import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, RouterModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    private router: Router
  ) {
  }
  public goToSimulator(): void {
    this.router.navigate(['simulator']);
  }
  public goToArchive(): void {
    this.router.navigate(['archive']);
  }
  public goToSystemInfo(dahsboardName: string): void {
    this.router.navigate(['/system-info', dahsboardName]);
  }
  public goToStatistics(): void {
    this.router.navigate(['statistics']);
  }
  public goToLiveStatistics(): void {
    this.router.navigate(['live-statistics']);
  }
}
