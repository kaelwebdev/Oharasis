import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import {Router} from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Session } from '../../models/session.model';
import { LoginObject } from '../../models/login-object.model';
import { Usuario } from 'src/app/interfaces/usuario.interface';

import * as anime from '../../../assets/libs/lib-anime/anime.min.js';
import swal from 'sweetalert2';



// Declaraciones para usar jQuery
declare let jQuery: any;
declare let $: any;
declare let particlesJS: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  u: Usuario = {};
  ss: Session = {user: this.u};

  // animacion svg
  morphingAnime: any;
  overlay: any;
  form: any;
  icon: any;
  clip: any;

  public error: {code: number, message: string} = null;
  public submitted: Boolean = false;

  constructor(private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private router: Router) {

    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });

   }

  ngOnInit() {
    this.cargarParticulas();
  }

  public cargarParticulas(): void {

        // tslint:disable-next-line:only-arrow-functions
        particlesJS.load('particle-js', './assets/config-particles/particles.json', function() {
          console.log('callback - particles-js config loaded');
        });
  }

  // efecto svg
  public animacionLogin(): void {
    this.morphingAnime = anime({
      targets: '.morph', // Hace referencia a path class="morph" d="M...
      d: [
        {value: 'M1048,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-535,0-535,0V0 H1048z'},
        {value: 'M1108,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-595,0-595,0V0 H1108z'},
        {value: 'M1211,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-698,0-698,0V0 H1211z'},
        {value: 'M1350,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-837,0-837,0V0 H1350z'},
        {value: 'M1455,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-942,0-942,0V0 H1455z'},
        {value: 'M1650,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-1137,0-1137,0V0 H1650z'},
        {value: 'M1875,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-1362,0-1362,0V0 H1875z'},
        {value: 'M2070,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-1557,0-1557,0V0 H2070z'},
        {value: 'M2211,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-1698,0-1698,0V0 H2211z'},
        {value: 'M2349,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-1836,0-1836,0V0 H2349z'},
        {value: 'M2460,0c0,0,85,246-240,396c-181.3,83.7,183,297-91,425c-216,100.9-119,190-182,259c-0.3,0.3-1947,0-1947,0V0 H2460z'}
      ],
      easing: 'easeOutQuint',
      duration: 1000,
      loop: false,
      autoplay: false
    });
    // tslint:disable-next-line:only-arrow-functions
      this.morphingAnime.restart();
      this.overlay = document.getElementById('morph');
      this.form = document.getElementById('login-form');
      this.icon = document.getElementById('animation-icon');
      this.clip = document.getElementsByClassName('clip')[0];
      this.overlay.classList.add('pointer');
      this.clip.classList.remove('clip');


      anime({
        targets: this.form,
        delay: 900,
        translateY: -800
      });

      anime({
        targets: this.icon,
        delay: 900,
        translateY: -800
      });

      setTimeout( () => {

        setTimeout(() => {
          $('#particle-js').remove();
        }, 1000);

        swal({
          position: 'center',
          type: 'success',
          title: '¡Bienvenido!',
          text: 'Usuario Correcto',
          showConfirmButton: false,
          timer: 1200
        });
        setTimeout( () => {
        this.router.navigate(['/user']);
        }, 1300);

        }, 1200);

  }
        // efecto svg



  public submitLogin(): void {
    this.submitted = true;
    this.error = null;
    if (this.loginForm.valid) {
      this.authenticationService.login(new LoginObject(this.loginForm.value)).subscribe(
        data => {

        // tslint:disable-next-line:triple-equals
        if (data.length == 1) {
          this.ss.user = data[0];
          this.correctLogin(this.ss);
        // tslint:disable-next-line:triple-equals
        } else if (data.length == 0) {
          swal({
            position: 'center',
            type: 'error',
            title: 'Usuario Incorrecto',
            text: 'Intente con un usuario valido',
            showConfirmButton: false,
            timer: 1300
          });
        }
        },
        error => this.error = JSON.parse(error._body)
      );
    }
  }

  private correctLogin(data: Session) {
    this.storageService.setCurrentSession(data);
    this.animacionLogin();
  }

}
