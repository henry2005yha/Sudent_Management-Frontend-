import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http'
import { environment } from './environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http : HttpClient) { }

  post(url: string, body: any , image?:any) {
    //console.log(body);

    return this.http.post(`${environment.url}${url}`, JSON.stringify(body), {
      headers: this.getHeaders()
    });
  }
  get(url: string) {
    //console.log(body);

    return this.http.post(`${environment.url}${url}`, {
      headers: this.getHeaders()
    });
  }

  delete(url: string, body: any) {

    return this.http.post(`${environment.url}${url}`, JSON.stringify(body), {
      headers: this.getHeaders()
    });
  }


  getImage(url: string, data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/JSON' });
    return this.http.post(`${environment.url}${url}`,data,
        { responseType: 'arraybuffer' }
      );
  }

  goUpload(url: string, file: any) {
    const fd = new FormData();

    fd.append('file', file);
    return this.http.post(`${environment.url}${url}`, fd);
  }
  
  
  getHeaders() {
    return {
      'Content-Type': 'application/json',
    }
  }
  downloadExcel(url:string): Observable<Blob> {
    return this.http.get(`${environment.url}${url}`, { responseType: 'blob' });
  }

  goUploadExcel(url: string, formData: any) {
    console.log(`${environment.url}${url}`);
    const fd = new FormData();

    fd.append('file', formData);
    this.http.post(`${environment.url}${url}`, fd);
  }
  
}
