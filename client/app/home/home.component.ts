import { Component, OnDestroy, OnInit, ComponentFactoryResolver, Injector, ComponentRef } from '@angular/core';
import { Map, MapOptions, latLng, geoJSON, GeoJSON, tileLayer, marker, Marker, LatLng, LatLngBounds} from 'leaflet';
import { MarkerService } from '../services/marker.service';
import { MarkerModel } from '../shared/models/marker.model';
import { HTMLMarkerComponent } from './marker.component';

const GoogleMapsLayers = {
  'Hybrid' : tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }),
  'Satelite' : tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }),
  'Terrain': tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  })
};
const MAP = GoogleMapsLayers['Hybrid'];
// tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}');

interface MarkerMetaData {
  device_id: number;
  markerInstance: Marker;
  componentInstance: ComponentRef<HTMLMarkerComponent>;
}

@Component({
  selector: 'app-about',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  leafletOptions: MapOptions;
  dataLayer: GeoJSON<any>;
  titleLayers: any = GoogleMapsLayers;

  map: Map;
  layersControl: any = {};
  markersData: MarkerModel[] = [];
  markers: MarkerMetaData[] = [];

  constructor(private markerService: MarkerService, private resolver: ComponentFactoryResolver, private injector: Injector) {
    markerService.bindMarker().subscribe(data => {
      const audio = new Audio();
      audio.src = '/assets/notification.mp3';
      audio.load();
      audio.play();
      this.insertOrUpdateMarkers(data);
    });
  }

  ngOnInit() {
    this.leafletOptions = {
      layers: [this.titleLayers['Hybrid']],
      zoom: 15,
      center: latLng([ -6.905340, 108.819583 ])
    };

    this.layersControl = {
      baseLayers: this.titleLayers
    };

    this.getMarkers();
  }

  getMarkers(): void {
    this.markerService.getMarkers().subscribe(markers => {
      this.markersData = markers;

      for (const item of markers) {
        if (item.active === true) {
          this.addmarker(item);
        }
      }
    });
  }

  addmarker(markerData) {
    const factory = this.resolver.resolveComponentFactory(HTMLMarkerComponent);
    const component = factory.create(this.injector);

    component.instance.data = markerData;
    component.changeDetectorRef.detectChanges();

    const position = new LatLng(markerData.lat, markerData.long);
    const m = marker(position);

    const popupContent = component.location.nativeElement;
    m.bindPopup(popupContent).openPopup();
    m.addTo(this.map);

    this.markers.push({
      device_id: markerData.device_id,
      markerInstance: m,
      componentInstance: component
    });
  }

  removeMarker(marker) {
    // remove it from the array meta objects
    const idx = this.markers.indexOf(marker);
    this.markers.splice(idx, 1);

    // remove the marker from the map
    marker.markerInstance.removeFrom(this.map);

    // destroy the component to avoid memory leaks
    marker.componentInstance.destroy();
  }

  insertOrUpdateMarkers(data: MarkerModel): void {
    if (data.active === false) {
      const currentMarker = this.markers.find(e => e.device_id === data.device_id);

      if (currentMarker) {
        this.removeMarker(currentMarker);
      }
    } else {
      const currentMarker = this.markers.find(e => e.device_id === data.device_id);

      if (currentMarker) {
        this.removeMarker(currentMarker);
      }

      this.addmarker(data);
    }

  }

  ngOnDestroy(): void {

  }

  onMapReady(map: Map): void {
    this.map = map;
  }
}
