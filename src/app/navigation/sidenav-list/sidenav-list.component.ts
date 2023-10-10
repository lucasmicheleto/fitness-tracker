import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy{
  @Output() sidenavClose = new EventEmitter();
  isAuth !: boolean;
  authSub !: Subscription;
  constructor(private authService: AuthService) {}
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
  ngOnInit(): void {
    this.authSub = this.authService.authChange.subscribe(status => {
      this.isAuth = status;
    })
  }
  onClose() {
    this.sidenavClose.emit();
  }

  logout() {
    this.authService.logout();
    this.onClose();
  }
}
