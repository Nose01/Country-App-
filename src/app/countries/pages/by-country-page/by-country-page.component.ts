import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: ``
})
export class ByCountryPageComponent implements OnInit{
  constructor(private countriesService:CountriesService){}


  public countries :Country[] = [];
  public initialValue:string="";

  ngOnInit(): void {
    this.countries= this.countriesService.cacheStore.byCountries.countries;
    this.initialValue= this.countriesService.cacheStore.byCountries.term;

  }

  searchByCountryPais(term:string):void{
    this.countriesService.searchCountryPais(term)
    .subscribe(countries =>{
      this.countries=countries
    })
  }

}
