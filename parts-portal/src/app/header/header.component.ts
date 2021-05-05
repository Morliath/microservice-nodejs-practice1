import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../authorization/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private tokenListenerSubs: Subscription;
  authenticated = false;
  userName: string;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticated = this.authService.isAuthenticated();
    this.userName = this.authService.getUserName();

    this.tokenListenerSubs = this.authService
      .getTokenStatusListener()
      .subscribe( status => {
        this.authenticated = status;
        this.userName = this.authService.getUserName();
      });
  }

  ngOnDestroy(){
    this.tokenListenerSubs.unsubscribe();
  }

  onLogout(){
    this.userName = '';
    this.authService.logOut();
  }

}
