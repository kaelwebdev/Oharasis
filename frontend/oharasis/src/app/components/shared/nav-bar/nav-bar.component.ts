import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { Usuario } from '../../../interfaces/usuario.interface';


// Declraciones de jquery
declare let jQuery: any;
declare let $: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  logueado: boolean = false;
  user: Usuario;


  constructor( private _storageS: StorageService) {

    this.user = this._storageS.getCurrentUser();


    if (_storageS.getCurrentSession() == null) {
      this.logueado = false;
    } else {
      this.logueado = true;
    }

    // Navbar effect
       // tslint:disable-next-line:only-arrow-functions
       $(window).on('scroll', function() {
        if ( $(window).scrollTop() ) {
          $('nav').addClass('black');
          $('.btn-a').addClass('btn-black');
        } else {
          $('nav').removeClass('black');
          $('.btn-a').removeClass('btn-black');
        }
      });

      // mobile menu icon change to x close
      // tslint:disable-next-line:only-arrow-functions
      $(document).ready(function() {
        // tslint:disable-next-line:only-arrow-functions
        $('.btn-collapse').on('click', function() {
          $('.animated-icon1').toggleClass('open');
        });
      });
  }

  ngOnInit() {

  }



}
