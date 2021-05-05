import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthenticationService } from "../auth.service";
import { Subscription } from 'rxjs';

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSubs:Subscription;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.authStatusSubs = this.authService.getTokenStatusListener()
      .subscribe( authenticationStatus => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }

  onLogin(form: NgForm, event) {
    if (form.invalid) {
      return;
    } else {
      this.isLoading = true;
      switch (event.submitter.id) {
        case "loginButton":
          this.authService.authenticate(form.value.email, form.value.password);
          break;
        case "signupButton":
          this.authService.createUser(form.value.email, form.value.password);
          break;
        default:
          break;
      }
    }
  }
}
