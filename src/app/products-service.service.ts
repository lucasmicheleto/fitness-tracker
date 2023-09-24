import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products = ["Book"];
  productsUpdated = new Subject();
  addProduct(productName:string) {
    this.products.push(productName);
    this.productsUpdated.next(productName);
  }

  getProducts (): string[] {
    return [...this.products]
  }

  removeProduct(productName: string) {
    this.products = 
    this.products.filter(p => p !== productName);
    this.productsUpdated.next(productName);
  }
}
