import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '@env/environment';
import { v4 as uuid } from 'uuid';
import mapboxgl from 'mapbox-gl';
import { DecimalPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapBoxKey;

interface Marker {
  id: string;
  data: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [DecimalPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  mapRef = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if (!this.mapRef()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.mapRef()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-76.522224, 3.420556], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', this.mapClick.bind(this));

    this.map.set(map);
  }

  private mapClick(event: mapboxgl.MapMouseEvent) {
    const { lng, lat } = event.lngLat;

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const marker = new mapboxgl.Marker({ color })
      .setLngLat([lng, lat])
      .addTo(event.target);

    console.log({ markers: this.markers() });

    this.markers.update((markers) => [
      ...markers,
      {
        id: uuid(),
        data: marker,
      },
    ]);
  }

  flyToMarker(marker: mapboxgl.Marker) {
    if (!this.map()) return;

    this.map()?.flyTo({
      center: marker.getLngLat(),
      zoom: 14,
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;

    marker.data.remove();
    this.markers.update((markers) => markers.filter((m) => m.id !== marker.id));
  }
}
