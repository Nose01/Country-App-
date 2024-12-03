import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Country, CoatOfArms } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';


@Injectable({providedIn: 'root'})
export class CountriesService {

  private url:string = "https://restcountries.com/v3.1"

  public cacheStore:CacheStore={
    byCapital : {term:"" , countries:[]},
    byCountries : {term:"" , countries:[]},
    byRegion : {region:"" , countries:[]},

  }

  constructor(private httpClient: HttpClient) {
    this.loadToLocalStorage();
  }

private saveToLocalStorage(){
  localStorage.setItem("cacheStore",JSON.stringify(this.cacheStore))
}

private loadToLocalStorage(){
  if (!localStorage.getItem("cacheStore")) return;
  this.cacheStore= JSON.parse(localStorage.getItem("cacheStore")!);
}

  private getCountriesRequest(url:string):Observable<Country[]>{
    return this.httpClient.get<Country[]>(url)
    .pipe(
      catchError( ()=> of([]) ),//of() para crear un observable -> of( [] )  un observable vacio
      // delay(2000)
    )
  }

  searchCountryByAlphaCode(code:string):Observable<Country | null>{

    const url =`${this.url}/alpha/${code}`

    return this.httpClient.get<Country[]>( url )
    .pipe(
      map( c=> c.length > 0 ? c[0]:null),
      catchError( () => of(null))
    );

  }

  searchCapital(term:string): Observable<Country[]> {
    const url =`${this.url}/capital/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => this.cacheStore.byCapital = {term,countries}),
      tap(() => this.saveToLocalStorage() ),
    )
  }

  searchCountryPais(term:string):Observable<Country[]>{
    const url:string =`${this.url}/name/${term}`
    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => this.cacheStore.byCountries = {term,countries}),
      tap(() => this.saveToLocalStorage() ),
    )
  }

  searchRegion(region:Region):Observable<Country[]>{
    const url:string =`${this.url}/region/${region}`

    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => this.cacheStore.byRegion = {region,countries}),
      tap(() => this.saveToLocalStorage() ),
    )
  }

}
