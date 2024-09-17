// app.module.ts is the root module of the Angular application.
// It is the first file that is executed when the application is started.
// It is responsible for bootstrapping the application and loading the necessary modules.
// In this file, you need to import the HttpClientModule module from @angular/common/http.
// This module provides the necessary services to make HTTP requests.
// You can import the HttpClientModule module in the imports array of the @NgModule decorator.


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    /* ... */
  ],
  imports: [
    /* ... */
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    /* ... */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }