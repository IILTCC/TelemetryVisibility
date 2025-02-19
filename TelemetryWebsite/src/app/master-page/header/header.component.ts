import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
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
}
