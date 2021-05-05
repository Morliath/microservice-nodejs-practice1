import { Part } from './part.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment'

const BACKEND_URL = environment.apiURL + '/part';

@Injectable({ providedIn: 'root' })
export class PartService {
  private partList: Part[] = [];
  private partListUpdated = new Subject<Part[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPartList() {
    this.http
      .get<Part[]>(BACKEND_URL)
      .pipe(
        map((partData) => {
          return {
            partList: partData.map(part => {
              return {
                title: part.title,
                content: part.content,
                id: part.id,
                partNumber: part.partNumber,
                imagePath: part.imagePath,
                createdBy: part.createdBy
              }
            })
          }
        })
      )
      .subscribe((responseData) => {
        console.log(responseData);
        this.partList = responseData.partList;
        this.partListUpdated.next([...this.partList]);
      });
  }

  getPart(id: string) {
    return this.http.get<Part[]>(BACKEND_URL);
  }

  getPartUpdateListener() {
    return this.partListUpdated.asObservable();
  }

  addPart(title: string, content: string, partNumber: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('partNumber', partNumber);
    postData.append('image', image, title);

    this.http.post<{ message: string, part: Part }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        const part: Part = {
          id: responseData.part.id,
          title: title,
          content: content,
          partNumber: partNumber,
          imagePath: responseData.part.imagePath,
          createdBy: null
        };

        this.partList.push(part);
        this.partListUpdated.next([...this.partList]);
        this.router.navigate(['/']);
      });
  }

  updatePart(id: string, title: string, content: string, partNumber: string, image: File | string, createdBy: string) {
    let postData: Part | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("partNumber", partNumber);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        partNumber: partNumber,
        imagePath: image,
        createdBy: createdBy
      };
    }

    this.http
      .put(BACKEND_URL, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePart(partId: string) {
    return this.http.delete(BACKEND_URL + '/' + partId);
  }

  removePart(id: string) {
    const updatedPartList = this.partList.filter(part => part.id !== id);
    this.partList = updatedPartList;
    this.partListUpdated.next([...this.partList]);
  }
}
