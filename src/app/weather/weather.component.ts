import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnInit {
  showFilter = false;

  ngOnInit(): void {}
}
