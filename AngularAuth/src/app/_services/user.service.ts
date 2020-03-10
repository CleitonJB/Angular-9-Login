import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = "http://vcmobile.com.br/VictorProjetoEstagio/Hackathon/WebApi/V01";

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${this.apiUrl}/Operadores_SelecionarTodos_Get`);
  }

  register(user: User) {
      return this.http.post(`${this.apiUrl}/Operadores_Incluir_Post`, user);
  }
}
