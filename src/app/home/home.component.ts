import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatSidenavModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  chosenType: string | null = null;
  chosenMag: string | null = null;
  chosenLocation: string | null = null;
  chosenDateRange: string | null = null;
  chosenSortOption: string | null = null;
  documents: any[] | null = null;

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  sendSearchRequest() {
    const params: any = {
        type: this.chosenType,
        mag: this.chosenMag,
        location: this.chosenLocation,
        dateRange: this.chosenDateRange,
        sortOption: this.chosenSortOption,
      };

    this.httpClient.get<any>(this.url, { params }).subscribe(
      (response: any) => {
        console.log(response);
        this.documents = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
