import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setField(field: string, value: string, expirationInSeconds?: number) {
    if(expirationInSeconds) {
      const expirationInMilliseconds = expirationInSeconds * 1000;
      const expirationDate = new Date().getTime() + expirationInMilliseconds;
      localStorage.setItem('expiration', expirationDate.toString())
    }
    return localStorage.setItem(field, value);
  }

  getField(field: string) {
    const expirationDate = localStorage.getItem('expiration');
    if(expirationDate) {
      const now = new Date().getTime();
      if(now > Number(expirationDate)) {
        localStorage.removeItem(field);
        localStorage.removeItem('expiration');
        return null;
      }
    }
    return localStorage.getItem(field);
  }
}