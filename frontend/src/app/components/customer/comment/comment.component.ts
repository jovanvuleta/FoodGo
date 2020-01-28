import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { HistoryService } from 'src/app/services/history.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.sass']
})
export class CommentComponent implements OnInit {
  @ViewChild('closeCommentModal', { static: true }) closeCommentModal: ElementRef;
  orders: Array<Order>;
  orderId = 1;
  error: any;
  commentForm: FormGroup;
  submitted = false;
  total: Array<number>;
  current: number;
  limit = 5; 
  constructor(private router: Router, private _historyService: HistoryService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this._fetchOrders(10);
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required],
    });
  }

  private _fetchOrders(limit: number = 1) {
    this._historyService.getOrders(limit).toPromise()
      .then(response => { this.orders = response; this.total = Array(Math.ceil(response.length / this.limit)); this.current = 1; })
      .catch(error => this.error = ErrorHelper.generateErrorObj(error));
  }

  private goToOrders() {
    this.router.navigate(['customer/orders']);
  }

  // convenience getter for easy access to form fields
  get f() { return this.commentForm.controls; }

  private showComments(): boolean {
    return this.orders != undefined;
  }

  addComment() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.commentForm.invalid) {
      return;
    }
    var updateOrder = this.orders.find(order => order.orderId==this.orderId);
    updateOrder.comment = this.f.comment.value;
    this._historyService.addComment(updateOrder);
    this.commentForm.reset();
    this.submitted = false;
    this.closeCommentModal.nativeElement.click();
  }

  index(id: number) {
    this.orderId = id;
  }

  resetForm() {
    this.submitted = false;
    this.closeCommentModal.nativeElement.click();
  }
  
  public receiveCurrentPage($event) {
    this.current = $event;
    console.log($event);
  }

  public getPageLimit(id: number) {
    return (((this.current - 1) * this.limit) <= id) && (id < (this.current * this.limit));
  }
}
