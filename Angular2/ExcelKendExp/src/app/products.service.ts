import { Injectable } from '@angular/core';
import { sampleProducts, products } from './products';

@Injectable()
export class ProductService {
  public products: any[] = products;
  
  getData() {
    console.log('In service getData');
    // return this.products;
    console.log(products);
    return products;
  }
  
}