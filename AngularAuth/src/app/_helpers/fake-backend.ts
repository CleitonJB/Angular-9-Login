import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '../_models/user';

const users: User[] = [
    { 
        OPER_seq_oper: 0,
        OPER_login: 'Cleiton',
        OPER_senha: '123',
        OPER_nome_operador: 'Cleiton-ADM',
        cod_oper_inc: 0,
        dat_inclusao: null,
        cod_oper_alt: 0,
        dat_alteracao: null, 
    }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('http://vcmobile.com.br/VictorProjetoEstagio/Hackathon/WebApi/V01/Operadores_ValidarLogin_Post') && method === 'POST':
                    return authenticate();
                case url.endsWith('http://vcmobile.com.br/VictorProjetoEstagio/Hackathon/WebApi/V01/Operadores_SelecionarTodos_Get') && method === 'GET':
                    return getUsers();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { OPER_login, OPER_senha } = body;
            const user = users.find(x => x.OPER_login === OPER_login && x.OPER_senha === OPER_senha);
            if (!user) return error('Username or password is incorrect');
            return ok({
                OPER_seq_oper: user.OPER_seq_oper,
                OPER_login: user.OPER_login,
                OPER_senha: user.OPER_senha,
                OPER_nome_operador: user.OPER_nome_operador,
                cod_oper_inc: user.cod_oper_inc,
                dat_inclusao: user.dat_inclusao,
                cod_oper_alt: user.cod_oper_alt,
                dat_alteracao: user.dat_alteracao,
                token: 'fake-jwt-token'
            })
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};