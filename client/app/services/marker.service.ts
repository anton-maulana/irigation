import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { MarkerModel } from '../shared/models/marker.model';

import Pusher from 'pusher-js';


@Injectable({
    providedIn: 'root',
})

export class MarkerService {
    private markerSubject: Subject<MarkerModel> = new Subject<MarkerModel>();
    private pusherClient: Pusher;

    constructor(private http: HttpClient) {
        this.pusherClient = new Pusher('bd5a6b968e9d62571952', { cluster: 'ap1' });

        const channel = this.pusherClient.subscribe('realtime-marker');

        channel.bind('posts', data => {
            this.markerSubject.next(<MarkerModel>data.body);
        });
    }

    bindMarker(): Observable<MarkerModel> {
        return this.markerSubject.asObservable();
    }

    getMarkers(): Observable<MarkerModel[]> {
        return this.http.get<MarkerModel[]>('/api/markers');
    }

    countMarkers(): Observable<number> {
        return this.http.get<number>('/api/markers/count');
    }

    addCat(marker: MarkerModel): Observable<MarkerModel> {
        return this.http.post<MarkerModel>('/api/marker', marker);
    }

    getCat(marker: MarkerModel): Observable<MarkerModel> {
        return this.http.get<MarkerModel>(`/api/marker/${marker._id}`);
    }

    editCat(marker: MarkerModel): Observable<any> {
        return this.http.put(`/api/marker/${marker._id}`, marker, { responseType: 'text' });
    }

    deleteCat(marker: MarkerModel): Observable<any> {
        return this.http.delete(`/api/marker/${marker._id}`, { responseType: 'text' });
    }
}
