import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import {StorageService} from "../services/storage.service";
@Injectable({
    providedIn: 'root'
})
export class AuthorizatedGuard implements CanActivate {
  constructor(private router: Router,
              private storageService: StorageService) { }
  canActivate(ruta:ActivatedRouteSnapshot) {

    let roles = ruta.data["roles"] as Array<string>;
    if (this.storageService.isAuthenticated(roles)) {
      return true;
    }
    this.router.navigate(['/acceso-denegado']);
    return false;
  }
}