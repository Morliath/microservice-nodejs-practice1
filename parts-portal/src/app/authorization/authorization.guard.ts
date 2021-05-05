import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private atuhService: AuthenticationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if(!this.atuhService.isAuthenticated()){
      this.router.navigate(['/login']);
    }
    return true;
  }
}
