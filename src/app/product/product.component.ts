import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ProductsService } from '../products-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input() productName!: string
  @Output() productClicked = new EventEmitter();

  constructor(private productsService: ProductsService) {   
  }
  onClicked (product: string) {
    //this.productClicked.emit();
    this.productsService.removeProduct(product);
  }
}
