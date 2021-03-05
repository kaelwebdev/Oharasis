import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})

export class AvatarService {

  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private prevTime = Date.now();
  private mixer: THREE.AnimationMixer;
  private mesh: THREE.Mesh;
  private animar: boolean = true;
  private anchoCanvasC: any;
  private altoCanvasC: any;
  private url: string = "";
  private urlM: string = "";
  private id: number = 1;
  createScene(elementId: string, urlM: string, id: number): void {
    console.log("creando escena...");
    this.definirRender(elementId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, this.anchoCanvasC / this.altoCanvasC, 0.1, 1000
    );

    if (id % 2 == 0) {
      this.url = './assets/3dModels/girl/Archer.json';
      this.camera.position.z=1.8;
    } else {
      this.url = './assets/3dModels/boy/Character.json';
      this.camera.position.z=1;
    }
    this.camera.position.y = 0.5;
    this.scene.add(this.camera);
    this.light = new THREE.AmbientLight( 0xffffff, 0.5 );
    this.light.position.z = 10;
    this.scene.add(this.light);
    var light2 = new THREE.PointLight(0xffffff, 1, -1, 1);
    this.scene.add(light2);
    var axesHelper = new THREE.AxesHelper( 5 );
   // this.scene.add( axesHelper );

    var urlM2 = '';
    if (this.url == './assets/3dModels/girl/Archer.json'){
      urlM2 = './assets/3dModels/girl/texture/texture.png';
    } else {
      urlM2 = './assets/3dModels/boy/texture/CharSurvivalTexture.png';
    }

    if (urlM!="") {
      this.cargarPJ(this.url, urlM);
    } else {
      // this.cargarPJ(url,urlM2);
    }
  }

  definirRender(elementId) {

    this.canvas = <HTMLCanvasElement>document.getElementById(elementId);
    var canvasContent = document.getElementById("soyUnContenenedor");

    this.anchoCanvasC = canvasContent.offsetWidth;
    this.altoCanvasC = canvasContent.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(this.anchoCanvasC, this.altoCanvasC);
    this.renderer.setClearColor(0xf5f5f5);  //0xF4F6F9, 0xffffff 
    // this.soloRender();
  }

  cargarPJ(url, urlM) {
    console.log("comienzo carga pj");
    var loader = new THREE.JSONLoader();
    loader.load(url, (g, m: any) => {

      var texture = new THREE.TextureLoader().load( urlM );

      var material = new THREE.MeshBasicMaterial( {
        map: texture,
         reflectivity: 0,
         wireframe: false,
         skinning: true,
         specularMap: null,
         lights: false,
         color: 0xffffff
         }  );

      this.mesh = new THREE.Mesh(g, material);
      this.mesh.scale.set(0.2, 0.2, 0.2);
      this.mesh.rotateY(-25);
      this.scene.add(this.mesh);
      this.mixer = new THREE.AnimationMixer(this.mesh);
      var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('talk', g.morphTargets, 30, false);
      this.mixer.clipAction(clip).setDuration(1).play();
    });
  }

  movimineto(animar: boolean) {
    if (this.mesh && animar == true) {
      this.mesh.rotation.y += 0.01;
    }
    if (this.mixer &&  animar == true) {
      var time = Date.now();
      this.mixer.update((time - this.prevTime) * 0.001);
      this.prevTime = time;
    }
  }

  soloRender() {
    window.addEventListener('DOMContentLoaded', () => {
      this.render2();
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  render2() {
    requestAnimationFrame(() => {
       this.render2();
     });

     this.renderer.render(this.scene, this.camera);
  }

  resize() {

    let width = this.anchoCanvasC;
    let height = this.altoCanvasC;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

  animate(): void {
    window.addEventListener('DOMContentLoaded', () => {
      this.render();
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  render() {
   requestAnimationFrame(() => {
      this.render();
    });

    this.movimineto(this.animar);

    this.renderer.render(this.scene, this.camera);
  }

  getAnimar(): boolean {
    return this.animar;
  }

  setAnimar(animar: boolean) {
    this.animar = animar;
  }

}
