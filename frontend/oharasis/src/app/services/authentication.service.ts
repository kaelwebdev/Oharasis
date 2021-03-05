import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {LoginObject} from "../models/login-object.model";
import { Usuario } from '../interfaces/usuario.interface';
import { UsuarioService } from "../../app/services/usuario.service"; 
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(public _usuarioS:UsuarioService) {
    }

    login(loginObj: LoginObject): Observable<Usuario[]> {
        return this._usuarioS.getUsuario(loginObj.username,loginObj.password);
    }

    logout():boolean{
        return true;
    }
    
}