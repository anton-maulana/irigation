import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-html-marker',
  template: `
    <h5>{{ data.location_name }}</h5>
    <p>
      {{ data.descriptions }}
    </p>
  `
})
export class HTMLMarkerComponent {
  @Input() data;
}
