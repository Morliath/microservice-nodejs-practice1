import { Component, OnInit, OnDestroy } from '@angular/core';
import { Part } from '../part.model';
import { PartService } from '../part.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../authorization/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-part-list',
  templateUrl: './part-list.component.html',
  styleUrls: ['./part-list.component.css']
})
export class PartListComponent implements OnInit, OnDestroy {
  parts: Part[] = [];
  isLoading = false;
  authenticated = false;
  BACKEND_URL = environment.imagesURL;

  private partSubs: Subscription;
  private tokenListenerSubs: Subscription;

  constructor(private partService: PartService, private authService: AuthenticationService, private router: Router) { }

  ngOnDestroy(): void {
    this.partSubs.unsubscribe();
    this.tokenListenerSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.partService.getPartList();
    this.partSubs = this.partService.getPartUpdateListener()
      .subscribe((partList: Part[]) => {
        this.isLoading = false;
        this.parts = partList;
      });

    this.authenticated = this.authService.isAuthenticated();

    this.tokenListenerSubs = this.authService
      .getTokenStatusListener()
      .subscribe(status => {
        this.authenticated = status;
      });
  }

  getUserId() {
    return this.authService.getUserName();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.partService.deletePart(id)
      .subscribe(() => {
        this.partService.removePart(id);
        this.router.navigate(["/"]);
      }, () => {
        this.isLoading = false;
      });
  }
}


