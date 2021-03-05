import { Component, OnInit } from '@angular/core';
import * as anime from '../../../assets/libs/lib-anime/anime.min.js';
import { MessageService } from '../../services/message.service';
import swal from 'sweetalert2';

// Declaraciones jQuery
declare let jQuery: any;
declare let $: any;
declare let particlesJS: any;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public _MessageService: MessageService) {

   }

  ngOnInit() {
    // tslint:disable-next-line:only-arrow-functions
    particlesJS.load('particle-js-register-form', './assets/config-particles/particles.json', function() {
      console.log('callback - particle-js-register-form config loaded');
    });
  }

  contactForm(form) {
    this._MessageService.sendMessage(form).subscribe(() => {
      swal({
        position: 'center',
        type: 'success',
        title: 'Registro enviado!',
        text: 'Espera un tiempo hasta que se haga valido el registro',
        showConfirmButton: true
      });
    });
    }

}
