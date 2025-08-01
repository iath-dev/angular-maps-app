import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@env/environment';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = environment.mapBoxKey;

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
})
export class MiniMapComponent implements AfterViewInit {
  zoom = input(14);
  center = input<Pick<mapboxgl.LngLat, 'lat' | 'lng'>>({
    lat: 40,
    lng: -76.4,
  });
  marker = input(false);
  mapRef = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);

  async ngAfterViewInit() {
    if (!this.mapRef()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.mapRef()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [this.center().lng, this.center().lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
      interactive: false,
    });

    if (this.marker()) {
      new mapboxgl.Marker().setLngLat(this.center()).addTo(map);
    }

    this.mapListeners(map);
  }

  private mapListeners(map: mapboxgl.Map) {
    this.map.set(map);
  }
}
