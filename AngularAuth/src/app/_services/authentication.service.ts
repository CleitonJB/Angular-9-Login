import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

//import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl = "http://vcmobile.com.br/VictorProjetoEstagio/Hackathon/WebApi/V01";

  logado = false;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  login(OPER_login: string, OPER_senha: string) {
      return this.http.post<any>(`${this.apiUrl}/Operadores_ValidarLogin_Post`, { OPER_login, OPER_senha })
          .pipe(map(user => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
          }));
  }

  loggedIn(){
      return this.logado;
      console.log('logado: ', this.logado);
  }

  logout() {
      // remove user from local storage to log user out
      console.log(this.currentUserValue);
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}
