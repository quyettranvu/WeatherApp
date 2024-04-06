import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-earthquake',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    HomeComponent,
  ],
  templateUrl: './earthquake.component.html',
  styleUrl: './earthquake.component.scss',
})
export class EarthquakeComponent implements OnInit {
  chosenType: string | null = null;
  chosenMag: string | null = null;
  chosenLocation: string | null = null;
  chosenDateRange: string | null = null;
  chosenSortOption: string | null = null;
  documents: any[] | null = null;

  url = environment.apiUrl + '/results';

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}

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
      },
    );
  }
}
