import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MenuItem } from '../MenuItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ssg-items-container',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './items-container.component.html',
  styleUrl: './items-container.component.scss'
})
export class ItemsContainerComponent {
  @Input() menu: MenuItem[] = [];
  @Input() selectedCategories: String[] = [];
  @Input() categories: String[] = []

  @Output() cart = new EventEmitter<MenuItem>();

  display: Map<String, MenuItem[]> = new Map()

  bruh: MenuItem | undefined;

  selectedOption: any;
  select2Options: string[] = [];
  select3Options: string[] = [];

  errorMessage: any;

  constructor() { }

  

  ngOnChanges() {
    // This is really inefficent, figure out better algo later
    this.display = new Map()
    this.selectedCategories.forEach(category => {
      var temp = []
      for(let i = 0; i<this.menu.length; i++) {
        if(this.menu[i].category == category) {
          temp.push(this.menu[i]);
        }
      }
      this.display.set(category, temp)  ;
    });
  }

  selectedItem : MenuItem|undefined = undefined;
  selectedQuantity: number = 1;

  select(item : MenuItem) {
    this.selectedItem = item;
  }
  quantityAdd() {
    this.selectedQuantity++;
  }
  quantitySubtract() {
    if(this.selectedQuantity<=1) {
      this.selectedQuantity = 1;
    }
    else{
      this.selectedQuantity--;
    }
  }
  openImage(link: string) {
    const confirm = window.confirm("View this image in a new tab?");
    if(confirm == true) {
      window.open(link);
    }
  }

  choose2(option: string) {
    if(this.select2Options.includes(option)) {
      this.select2Options.splice(this.select2Options.indexOf(option), 1);
    }
    else{
      this.select2Options.push(option);
    }
    console.log(this.select2Options);
  }
  choose3(option: string) {
    if(this.select3Options.includes(option)) {
      this.select3Options.splice(this.select2Options.indexOf(option), 1);
    }
    else{
      this.select3Options.push(option);
    }
    console.log(this.select3Options);
  }

  addToCart() {
    // Procedure for items that have selection
    var category: string|undefined = this.selectedItem?.category;
    var name: string|undefined = this.selectedItem?.name;
    // Choose 1
    if(category == "Sushi/Sashimi" || name == "Thai Curry Vegetable" || name == "Thai Curry Chicken" || name == "Thai Curry Shrimp" || name == "Thai Curry Beef" || name == "Thai Basil" || name == "Choose 1 Bento Box") {
      if (!this.selectedOption) {
        this.errorMessage = "Please select an option before adding to cart.";
        return;
  
      } else {
        this.errorMessage = null;
      }
        
      // Append options to front if there is one
      if(this.selectedOption!=null && this.selectedItem!.individualNotes != undefined) {
        this.selectedItem!.individualNotes = "Option: " + this.selectedOption + " --- Instructions: "+ this.selectedItem!.individualNotes;
      }
      if(this.selectedOption!=null && this.selectedItem!.individualNotes == undefined) {
        this.selectedItem!.individualNotes = "Option: " + this.selectedOption;
      }
    }
    // Choose 2
    if(name == "Choose 2 Bento Box" || name == "Any 2 Rolls") {
      if(!this.select2Options || this.select2Options.length == 0) {
        this.errorMessage = "Please select 2 options before adding to cart.";
        return;
      }
      else if(this.select2Options.length != 2) {
        this.errorMessage = "Choose only 2 options.";
        return;
      }
      else {
        this.errorMessage = null;
      }

      // Append options to front if there is one
      if(this.select2Options!=null && this.selectedItem!.individualNotes != undefined) {
        this.selectedItem!.individualNotes = "Option: " + this.select2Options[0] + " & " + this.select2Options[1] + " --- Instructions: "+ this.selectedItem!.individualNotes;
      }
      if(this.select2Options!=null && this.selectedItem!.individualNotes == undefined) {
        this.selectedItem!.individualNotes = "Option: " + this.select2Options[0] + " & " + this.select2Options[1];
      }
    }
    // Choose 3
    if(name == "Any 3 Rolls") {
      if(!this.select3Options || this.select3Options.length == 0) {
        this.errorMessage = "Please select 3 options before adding to cart.";
        return;
      }
      else if(this.select3Options.length != 3) {
        this.errorMessage = "Choose only 3 options.";
        return;
      }
      else {
        this.errorMessage = null;
      }

      // Append options to front if there is one
      if(this.select3Options!=null && this.selectedItem!.individualNotes != undefined) {
        this.selectedItem!.individualNotes = "Option: " + this.select3Options[0] + " & " + this.select3Options[1] + " & " +this.select3Options[2]  +" --- Instructions: "+ this.selectedItem!.individualNotes;
      }
      if(this.select3Options!=null && this.selectedItem!.individualNotes == undefined) {
        this.selectedItem!.individualNotes = "Option: " + this.select3Options[0] + " & " + this.select3Options[1] + " & "+ this.select3Options[2];
      }
    }

    for(let i = 0; i<this.selectedQuantity; i++) {
      this.cart.emit(structuredClone(this.selectedItem));
    }
    

    // make the button more "reactive" for people
    setTimeout(()=>{this.closePopup();},200);
  }

  closePopup() {
    this.selectedItem!.individualNotes = "";
    this.selectedItem = undefined;
    this.selectedQuantity = 1;

    this.selectedOption = null;
    this.select2Options = [];
    this.select3Options = [];

    this.errorMessage = null;
  }
}
