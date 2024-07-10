import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, NgSwitch } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { HoursComponent } from '../hours/hours.component';
import { MenuComponent } from '../menu/menu.component';
import { CartComponent } from '../cart/cart.component';
import { SubmittedComponent } from '../submitted/submitted.component';
import { MenuItem } from '../menu/MenuItem';
import { CartItem } from '../cart/CartItem';
import { MainService } from './services/main.service';

@Component({
  selector: 'ssg-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [CommonModule, NgSwitch, HomeComponent, HoursComponent, MenuComponent, CartComponent, SubmittedComponent]
})
export class MainComponent {
  menuPosition: any;
  logoSrc: String;
  cartSrc: String;
  currentPage: String;
  openStatus: String;

  cart: MenuItem[] = [];
  displayCart: CartItem[] = []
  
  constructor(private mainService: MainService) {
    this.logoSrc = "assets/images/logo.webp";
    this.cartSrc = "assets/images/cart.svg";
    this.currentPage = "home";
    this.openStatus = "CLOSED";
  }

  ngOnInit() {
    if(localStorage.getItem("cart") != null) {
      var temp = JSON.parse(localStorage.getItem("cart")!)
      // I love how javascript just allows this LMAO
      for(let i = 0; i<temp.length; i++) {
        this.cart.push(temp[i])
      }
    }
    
    if(localStorage.getItem('currentPage')!=null) {
      this.currentPage = localStorage.getItem('currentPage')!;
    }

    this.mainService.isOpen().subscribe( isOpen=> {
      if(isOpen[0] == true) {
        this.openStatus = "OPEN"
      }
      else this.openStatus = "CLOSED"
    })

    this.scrollToTop();
  }

  togglePage(page : string) {
    this.currentPage = page;
    localStorage.setItem('currentPage', page);
    this.scrollToTop();
  }
  
  scrollToTop() {
    setTimeout(()=>window.scrollTo(0,0), 50);
  }

  addToCart(item: MenuItem) {
    var copy: MenuItem = structuredClone(item)
    this.cart.push(copy);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.clear();
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
}

