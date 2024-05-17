import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class GraphqlService {
    private apiUrl = 'https://localhost:7044/graphql';
    GET_ALL_STUDENT = gql`
    query {
        get {
          id
          name
          age
          class
          rollNumber
        }
      }
    `
    constructor(private http: HttpClient, private apollo: Apollo) { }

    getAll(queryString: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { query: this.GET_ALL_STUDENT });
    }
}