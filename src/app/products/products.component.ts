import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductsService } from '../products-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productName !: string;
  products !: string[]
  private productsSub!: Subscription;
  constructor(private productsService:ProductsService) {
  }
  ngOnDestroy(): void {
    this.productsSub.unsubscribe();
  }
  ngOnInit(): void {
    this.products = this.productsService.getProducts();
    this.productsSub =
    this.productsService.productsUpdated.subscribe({
      next: _ => this.products = this.productsService.getProducts()
    });
  }
  addProduct(form: NgForm) {
    if (!form.valid) return;
    this.productsService.addProduct(form.value.productName);
  }

  onRemoveProduct(pName: string) {
    this.products = this.products.filter(p => p !== pName);
  }
}