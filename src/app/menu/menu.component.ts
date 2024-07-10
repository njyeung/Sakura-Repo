import { Component, EventEmitter, Output, SkipSelf } from '@angular/core';
import { MenuService } from './services/menu.service';
import { MenuItem } from './MenuItem';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ItemsContainerComponent } from './items-container/items-container.component';

@Component({
  selector: 'ssg-menu',
  standalone: true,
  imports: [SidebarComponent, ItemsContainerComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  @Output() cart = new EventEmitter<MenuItem>;

  constructor(private menuService: MenuService) {  }  

  // VARIABLES DERIVED FROM API
  public menu: MenuItem[] = [];
  public categories: String[] = [];
  public isLunchTime: Boolean = false;
  public isOpen: Boolean = false;

  // VARIABLES DERIVED FROM SIDEBAR CHILD
  // displayCategories initializes with ALL categories, selectedCategories initialized with NONE
  public displayCategories: String[] = []; selectedCategories: String[] = []; 
  
  changeSelectedCategories(list: String[]) {
    this.selectedCategories = [...list];
    if(this.selectedCategories.length == 0) {
      this.displayCategories= [...this.categories];
    }
    else{
      this.displayCategories = [...this.selectedCategories];
    }
    window.scrollTo(0,0);
  }

  // VARIABLES DERIVED FROM MAIN CHILD

  addToCart(item : MenuItem) {
    if(item.individualNotes == undefined) {
      item.individualNotes = "";
    }
    this.cart.emit(item)
  }

  ngOnInit() {
    this.menuService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.displayCategories = categories;
    })
    this.menuService.getMenu().subscribe(menu => {
      this.menu = menu;
    })
    this.menuService.isLunchTime().subscribe(isLunchTime => {
      this.isLunchTime = isLunchTime[0];
    })
    this.menuService.isOpen().subscribe(isOpen => {
      this.isOpen = isOpen[0];
    })
  }
}
