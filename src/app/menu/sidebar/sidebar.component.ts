import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ssg-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  @Input() categories: String[] = [];
  @Output() selectedList = new EventEmitter<String[]>();

  // hot fix for making the loading page less weird
  loaded: boolean = false;

  displayCategories: String[] | undefined;

  constructor() { }

  ngOnChanges() {
    this.displayCategories = [];

    if(this.categories.length != 0) {
      this.loaded=true;
    }
  }

  toggleSelect(category: String) {
    // If the category is in the array, remove it
    if(this.displayCategories?.includes(category)) {
      const toRemoveIndex = this.displayCategories?.indexOf(category);
      this.displayCategories?.splice(toRemoveIndex,1);
    }
    // Otherwise, add it to the array
    else{
      this.displayCategories?.push(category);
    }

    this.selectedList.emit(this.displayCategories)
  }

}
