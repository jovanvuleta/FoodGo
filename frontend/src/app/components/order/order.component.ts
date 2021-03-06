import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Meal } from 'src/app/models/meal.model';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/models/order.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Status } from 'src/app/models/status.model';
import { Ingredients } from 'src/app/models/ingredients.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.sass']
})
export class OrderComponent implements OnInit {
  @Input()
  mealOrder: Array<Meal>;
  @ViewChild('closeOrderModal', { static: true }) closeOrderModal: ElementRef;
  @Output() mealOrderChange = new EventEmitter();
  @Input()
  restaurantOrder: Restaurant;

  orderPrice = 0;
  mealCount: Array<number> = [];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
  }

  private mealsToSet() {
  let data = this.mealOrder.map(meal =>  meal.name).reduce(function (acc, curr) {
      if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }

      return acc;
    }, {});
    let mealCount = Object.keys(data).map(key => ({ name: String(key), count: data[key] }));
    this.mealCount = mealCount.map(meal => meal.count);
    let mealSet = this.mealOrder.map(meal => meal).filter((value, index, self) => 
    self.map(meal => meal.name).indexOf(value.name) === index || self.map(i => i.ingredients.map(i=>i.name).join(" ")).indexOf(value.ingredients.map(i=>i.name).join(" ")) === index)
    return mealSet;
  }

  private hasOrders(): boolean {
    if (this.mealOrder == undefined || this.mealOrder.length == 0 || this.mealOrder == null) {
      return false;
    }
    this.orderPrice = this.mealOrder.map(meal => meal.price).reduce((accumulator, currentValue) => accumulator + currentValue);
    let ingredientsPrice = this.mealOrder.map(m => m.ingredients.length == 0 ? 0 : m.ingredients.map(i => i.price).
      reduce((accumulator, currentValue) => accumulator + currentValue)).
      reduce((accumulator, currentValue) => accumulator + currentValue);
    this.orderPrice = this.orderPrice + ingredientsPrice;
    return true;
  }

  private addToOrder(meal: Meal) {
    this.mealOrder.push(meal);
    this.mealOrderChange.emit(this.mealOrder);
  }

  private removeFromOrder(mealName: string, ingredients: Array<Ingredients>) {
    var ingredientsNames = ingredients.map(ingredient => ingredient.name);
    var id = this.mealOrder.findIndex(meal => meal.name == mealName && meal.ingredients.length === ingredientsNames.length && meal.ingredients
      .every((value, index) => value.name === ingredientsNames[index]));
    this.mealOrder.splice(id, 1)
    this.mealOrderChange.emit(this.mealOrder);
  }

  private hasOrder(mealName: string, ingredients: Array<Ingredients>) {
    var ingredientsNames = ingredients.map(ingredient => ingredient.name);
    return this.mealOrder.filter(meal => meal.name == mealName && meal.ingredients.length === ingredientsNames.length && meal.ingredients
      .every((value, index) => value.name === ingredientsNames[index])).length != 1;
  }

  private clearOneOrder(mealName: string, ingredients: Array<Ingredients>) {
    var ingredientsNames = ingredients.map(ingredient => ingredient.name);
    this.mealOrder = this.mealOrder.filter(meal => meal.name != mealName || !(meal.ingredients.length === ingredientsNames.length && meal.ingredients
      .every((value, index) => value.name === ingredientsNames[index])));
    this.mealOrderChange.emit(this.mealOrder);
  }

  private clearOrder() {
    this.mealOrder = [];
    this.mealOrderChange.emit(this.mealOrder);
  }


  private mealIngredientsJSON() {
    let mealSet = this.mealsToSet();
    return mealSet.map(m=>m.mealId).reduce(function (acc, curr, id) {
      if (typeof acc[curr] == 'undefined') {  
        acc[curr] = []; 
      }
	  acc[curr].push(mealSet[id].ingredients.length>0?mealSet[id].ingredients.map(i =>i.ingredientId):[]);   
      return acc;
    }, {});
  }

  private sendOrder() {
    let customer = JSON.parse(localStorage.getItem("customer"));
    let mealIds = [];
    this.mealsToSet().forEach(function(meal){
      if(!mealIds.includes(meal.mealId)) mealIds.push(meal.mealId);
    });

    let order: Order = {
      orderId: null,
      customerId: customer.customerId,
      address: customer.addresses[0], // dodati da odabere adresu 
      restaurantId: this.restaurantOrder.restaurantId,
      restaurant: this.restaurantOrder,
      status: Status.IN_PROGRESS,
      meals: this.mealOrder,
      comment: null,
      timestamp: new Date(),
      price: this.orderPrice,
      notes: null, // TDOO add note
      mark: null,
      meals_ids: mealIds.join(', '),
      meal_ingredients_ids: JSON.stringify(this.mealIngredientsJSON()),
      meal_count: this.mealCount.map(m => m.toString()).join(", ")
    }
    let orderRecieved = this.orderService.send(order);
    if (orderRecieved) {
      this.clearOrder();
    }
    this.closeOrderModal.nativeElement.click();
  }

  private loggedIn(): boolean {
    if (localStorage.getItem("customer")) {
      return true;
    }
    return false;
  }

}
