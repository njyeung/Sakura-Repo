import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from '../menu/MenuItem';
import { CommonModule } from '@angular/common';
import { CartItem } from './CartItem';
import { CartService } from './services/cart.service';
import { Order } from './Order'
import { catchError, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ssg-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  @Input() cart: MenuItem[] = []
  @Input() displayCart: CartItem[] = []

  subtotal: number = 0.00
  tax: number = 0.00
  tip: number = 0.00
  total: number = 0.00

  checkout: boolean = false;
  error: boolean = false;
  @Output() submitEvent = new EventEmitter<string>();

  // Form data
  name: string | undefined = "";
  email: string | undefined = "";
  phoneNumber: string | undefined = "";
  instructions: string | undefined = "";
  
  loadingAnimation = false;

  // Error data
  errorHeader: string = ""
  errorDescription: string = ""
  errorSrc : string = "assets/images/red-x.png" // src image for the error

  async onSubmit(orderform : HTMLFormElement) {

    var formData: FormData = new FormData(orderform);

    this.name = formData.get("name")?.toString();
    this.email = formData.get("email")?.toString();
    this.phoneNumber = formData.get("phone")?.toString();
    this.instructions = formData.get("instructions")?.toString();

    if(this.name === undefined || this.email === undefined || this.phoneNumber === undefined || this.instructions === undefined) {
      return;
    }

    var ids : number[] = [];
    var individualNotes: string[] = [];
    this.cart.forEach((menuItem)=> {ids.push(menuItem.id); individualNotes.push(menuItem.individualNotes);});
    
    if(this.displayTip!='') {
      this.tip = 0.00  
    }
    this.tip = Number(this.displayTip)

    var order: Order = {
      email: this.email,
      phone: this.phoneNumber,
      name: this.name,
      notes: this.instructions,
      items: ids,
      individualNotes: individualNotes,
      tip: this.tip
    };
    
    this.cartService.submitForm(order)
    .pipe(catchError(error => {
      this.afterSubmit(error.status, error.error);
      return throwError(error);
    })).subscribe(response => {      
      this.afterSubmit(200, "");
    });

    this.loadingAnimation = true;
  }

  afterSubmit(status: number, message: string) {
    this.loadingAnimation = false;
    switch (status) {
      // Order has been received
      case 200: {
        this.clear();
        this.error = false;
        this.submitEvent.emit('submitted');
        return;
      }
      // .NET threw this, prolly bad formatting. Reload website and try again
      case 400: {
        this.errorHeader = "ERROR 400"
        this.errorDescription = "Unknown user error. Reload website and try again."
        this.error = true;
        setTimeout(()=>{document.getElementById("scroll-to-error")?.scrollIntoView();}, 100);
        return;
      }
      // We are currently closed
      case 401: {
        this.errorHeader = "We are currently closed"
        this.errorDescription = "Visit hours to see when orders can be placed"
        this.error = true;
        setTimeout(()=>{document.getElementById("scroll-to-error")?.scrollIntoView();}, 100);
        return;
      }
      // Order contains lunch menu item. Clear the cart of lunch items and try again
      case 402: {
        this.errorHeader = "Order Contains Lunch Item"
        this.errorDescription = "Trying to order lunch items during dinner period. Please remove them or clear cart and try again."
        this.error = true;
        setTimeout(()=>{document.getElementById("scroll-to-error")?.scrollIntoView();}, 100);
        return;
      }
      // Form was filled out incorrectly
      case 403: {
        this.errorHeader = "Form was filled out incorrectly"
        this.errorDescription = message;
        this.error = true;
        setTimeout(()=>{document.getElementById("scroll-to-error")?.scrollIntoView();}, 100);
        return;
      }
      // Probably 500
      default: {
        this.errorHeader = "ERROR " + status
        this.errorDescription = "Server Broke :(  --- " + message;
        this.error = true;
        setTimeout(()=>{document.getElementById("scroll-to-error")?.scrollIntoView();}, 100);
      }
    }
  }

  constructor(private cartService : CartService) {}
  
  ngOnInit() {
    
  }

  isArrowKey(evt: any) {
    // Dump arrow up and down inputs
    if(evt.keyCode === 38 || evt.keyCode === 40) {
      return false;
    }

    return true;
  }

  // This is so stupid
  isValidKey(evt : any){
    let charCode = (evt.which) ? evt.which : evt.keyCode;

    // Dump all non-number inputs
    if (charCode != 46 && charCode > 31 
      && (charCode < 48 || charCode > 57))
        return false;
    
    return true;
  }

  // This is even more stupid
  keyArray = ""
  displayTip = ''
  formatTip(event: any) {
    let key = event.key;
    
    if(key=='Backspace') {
      // catch backspace
      this.keyArray = this.keyArray.slice(0,this.keyArray.length-1);
    }
    else if(!/^[0-9]$/i.test(key)) {
      // catch if input is not a number
      return;
    }
    else{
      this.keyArray += key;
    }
    
    // get rid of leading 0s
    this.keyArray = this.keyArray.replace(/^0+(?=\d)/, '');

    let front = this.keyArray.slice(0, this.keyArray.length-2);
    if(front.length==0) {
      front = '0';
    }
    let back = this.keyArray.slice(this.keyArray.length-2, this.keyArray.length)
    if(back.length==1){
      back = '0' + back;
    }

    // Formatting display string
    let result: string = front + '.' + back
    if(result == "0.") {
      result = ''
    }
    console.log(result)
    console.log(this.keyArray)
    this.displayTip = result;
    

    // Recalculate total and add tip
    this.stackItems();
    this.total = this.total + Number(this.displayTip)
  }

  toggleCheckout() {
    this.checkout = true;
    setTimeout(()=>{document.getElementById("scroll-to-order-form")?.scrollIntoView();}, 100)
  }

  clear() {
    // Doing this instead of = [] so it updates cart object for app.component
    while(this.cart.length != 0) {
      this.cart.pop();
    }
    this.stackItems();
    this.updateLocalStorage();
  }

  remove(item: MenuItem) {
    for(let i = this.cart.length-1; i>=0; i--) {
      if(this.cart[i].id == item.id && this.cart[i].individualNotes == item.individualNotes) {
        this.cart.splice(i, 1);
        break;
      }
    }
    this.stackItems();
    this.updateLocalStorage();
  }

  add(item: MenuItem) {
    setTimeout(()=>{},200);
    var copy: MenuItem = structuredClone(item);
    this.cart.push(copy);
    this.stackItems();
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.clear();
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  ngOnChanges() {
    this.stackItems()
  }

  
  // This algo is really inefficent but oh well
  stackItems() { 
    
    this.displayCart = []

    for(let i = 0; i<this.cart.length; i++) {
      var temp = this.cart[i]

      // Tries to find item in displayCart
      var found = false;
      for(let j = 0; j<this.displayCart.length; j++) {
        if(this.displayCart[j].item.id == temp.id && this.displayCart[j].item.individualNotes == temp.individualNotes) {
          this.displayCart[j].quantity++;
          found = true;
          break;
        }
      }
      if(found == true) continue;

      // If not found, push item to end of cart
      else{
        this.displayCart.push({item: temp, quantity:1})
      } 
    }

    // Update totals and tax
    this.subtotal = 0.00
    this.tax = 0.00
    this.total = 0.00

    this.displayCart.forEach(cartItem=> {
      this.subtotal += cartItem.item.price * cartItem.quantity;
    })
    this.tax = this.subtotal * 0.05;
    this.total = this.subtotal + this.tax;
  }
}
