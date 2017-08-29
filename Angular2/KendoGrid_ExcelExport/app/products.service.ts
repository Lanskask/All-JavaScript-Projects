import { Injectable } from '@angular/core';
import { sampleProducts } from './products';

@Injectable()
export class ProductService {
  public products: any[] = sampleProducts;
  
  getData() {
    console.log('In service getData');
    return this.products;
  }
  
}