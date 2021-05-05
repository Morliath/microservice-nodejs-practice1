import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

import { environment } from '../../environments/environment'

const BACKEND_URL = environment.loginURL + '/user';

@Injectable({ providedIn: "root" })
export class AuthenticationService {

  private token: string;
  private tokenStatusListener = new Subject<boolean>();
  private tokenTimer;
  private userName: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUserName(){
    return this.userName;
  }

  getTokenStatusListener() {
    return this.tokenStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const userData = {
      email: email,
      password: password,
    };

    this.http
      .post( BACKEND_URL + '/', userData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(["/"]);
      },
      error => {
        this.tokenStatusListener.next(false);
      });
  }

  authenticate(email: string, password: string) {
    const userData = {
      email: email,
      password: password,
    };

    this.http
      .post<{ token: string; expiresIn: number; userID: string }>(
        BACKEND_URL + "/login",
        userData
      )
      .subscribe(
        (response) => {
          const expirationDate = this.login(
            response.token,
            response.expiresIn,
            email
          );

          this.saveAuthData(this.token, expirationDate, email);

          this.tokenStatusListener.next(true);
          this.router.navigate(["/"]);
        },
        (error) => {
          this.tokenStatusListener.next(false);
          console.error(error);
        }
      );
  }

  login(token, expiresIn, email) {
    this.token = token;
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, expiresIn);
    this.userName = email;
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    console.log(expirationDate);

    return expirationDate;
  }

  logOut() {
    this.token = null;
    this.tokenStatusListener.next(false);
    this.clearAuthData();
    this.userName = '';
    clearTimeout(this.tokenTimer);

    this.router.navigate(["/"]);

  }

  private saveAuthData(token: string, expirationDate: Date, userID: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userID", userID);
  }

  verifyLoginStatus() {
    const expirationDate = new Date(localStorage.getItem("expirationDate"));
    const expiresIn = expirationDate.getTime() - new Date().getTime();

    console.log(expirationDate);
    console.log(expiresIn / 1000);

    if (expiresIn > 0) {

      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");
      this.login(token, expiresIn, userID);

      this.tokenStatusListener.next(true);

      console.log("Token still valid " + userID);

      this.router.navigate(["/"]);
    }
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userID");
  }
}
