import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@env/environment';
import mapboxgl, { LngLat, LngLatBounds } from 'mapbox-gl';

mapboxgl.accessToken = environment.mapBoxKey;

@Component({
  imports: [DecimalPipe],
  templateUrl: './fullscreen-map-page.component.html',
})
export class FullscreenMapPageComponent implements AfterViewInit {
  mapRef = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal(14);
  coordinates = signal<Pick<mapboxgl.LngLat, 'lat' | 'lng'>>({
    lat: 3.420556,
    lng: -76.522224,
  });

  async ngAfterViewInit() {
    if (!this.mapRef()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.mapRef()?.nativeElement;
    const { lat, lng } = this.coordinates();

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    this.mapListeners(map);
  }

  zoomEffect = effect(() => {
    if (!this.map()) return;

    this.map()?.zoomTo(this.zoom());
  });

  mapListeners(map: mapboxgl.Map) {
    map.on('zoomend', (event) => {
      const _zoom = event.target.getZoom();
      this.zoom.set(_zoom);
    });

    map.on('moveend', (event) => {
      const center = this.map()?.getCenter();
      if (!center) return;
      this.coordinates.set(center);
    });

    map.addControl(new mapboxgl.NavigationControl());

    this.map.set(map);
  }
}
