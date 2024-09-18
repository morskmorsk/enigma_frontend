import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product-list
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts()
      .pipe(
        catchError(error => {
          this.errorMessage = this.errorService.getErrorMessage(error);
          return of([]);
        })
      )
      .subscribe(
        (data) => {
          this.products = data;
        }
      );
  }
}
