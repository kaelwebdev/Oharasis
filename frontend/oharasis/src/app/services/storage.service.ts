import {Injectable} from "@angular/core";
import { Router } from '@angular/router';
import {Session} from "../models/session.model";
import {Usuario as User} from "../interfaces/usuario.interface";
@Injectable({
    providedIn: 'root'
})
export class StorageService {
  private localStorageService;
  private currentSession : Session = null;
  constructor(private router: Router) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }
  
  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem('currentUser', JSON.stringify(session));
  }

  loadSessionData(): Session{
    var sessionStr = this.localStorageService.getItem('currentUser');
    return (sessionStr) ? <Session> JSON.parse(sessionStr) : null;
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('currentUser');
    this.currentSession = null;
  }

  getCurrentUser(): User {
    var session: Session = this.getCurrentSession();
    return (session && session.user) ? session.user : null;
  };

  
  isAuthenticated(roles:string[]): boolean {
    return (this.getCurrentRol(roles) != null) ? true : false;
  };

  
  getCurrentRol(roles:string[]): string {
    var session = this.getCurrentSession();
   
    for (const rol of roles) {
      if(session && session.user.rol==rol){
        return session.user.rol;
      }
    }
    return  null;
  };

  logout(): void{
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }
}