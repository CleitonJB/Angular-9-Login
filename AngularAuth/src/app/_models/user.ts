export class User {
    OPER_seq_oper: number;
    OPER_login: string;
    OPER_senha: string;
    OPER_nome_operador: string;
    cod_oper_inc: number;
    dat_inclusao: Date;
    cod_oper_alt: number;
    dat_alteracao: Date;
    token?: string;
}

/*
    https://www.techiediaries.com/angular/jwt-authentication-angular-9-example/
*/