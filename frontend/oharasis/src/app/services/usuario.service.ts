import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Usuario } from "../../app/interfaces/usuario.interface";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { RegEstudiante } from "../../app/interfaces/regEstudiante.interface";
import { RegEstudianteService } from "../../app/services/regEstudiante.service";
import { RegLogro } from "../../app/interfaces/regLogro.interface";
import { RegLogroService } from "../../app/services/regLogro.service";
import { RegHabilidad } from "../../app/interfaces/regHabilidad.interface";
import { RegHabilidadService } from "../../app/services/regHabilidad.service";
import { LogroService } from "../../app/services/logro.service";
import { Logro } from '../interfaces/logro.interface';
import { TipoService } from "../../app/services/tipo.service";
import { Tipo } from '../interfaces/tipo.interface';
import { RegCalificacion } from '../interfaces/regCalificacion.interface';
import { RegCalificacionService } from "../../app/services/regCalificacion.service";
import { Curso } from '../interfaces/curso.interface';
import { CursoService } from "../../app/services/curso.service";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  itemClt:AngularFirestoreCollection<Usuario>;
  item: Observable<Usuario[]>;
  itemDoc: AngularFirestoreDocument<Usuario>;
  collectionName:string= 'Usuarios';

  constructor(public afs:AngularFirestore, public _regEstudianteS:RegEstudianteService,
    public _regLogroS:RegLogroService, public _regHabilidadS:RegHabilidadService,
    public _logroS:LogroService, public _tipoS:TipoService,
    public _regCS:RegCalificacionService, public _cursoS:CursoService) {
      console.log("inicializando servicio para: ",this.collectionName);
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref);
   }
  
   getItemSimple(){
    this.item = this.itemClt.valueChanges(); 
     return this.item;
   }
   
   getItem(yesWhere?:boolean,
       where?:[string,any,any],
       yesOrder?:boolean,
       order?:[string,any]){
     if (yesWhere==undefined && yesOrder==undefined || yesWhere==false && yesOrder==false ){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref);
     }else if(yesWhere==true && (yesOrder==undefined || yesOrder==false)){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where(where[0], where[1], where[2]));
     }else if (yesWhere==false && yesOrder==true){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.orderBy(order[0], order[1]));
     }else if (yesWhere==true && yesOrder==true){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where(where[0], where[1], where[2]).orderBy(order[0], order[1]));
     }
    
    return this.getMap();
   }

   getUsuario(a:string,b:string){
    this.itemClt = this.afs.collection(this.collectionName, ref=> 
      ref.where("alias", "==", a).where("password","==",b)  );
      this.item = this.itemClt.snapshotChanges().pipe(
        map(
          changes=> {
           
            return changes.map( a=> {
              const data = a.payload.doc.data() as Usuario;
              console.log("llamado servicio para: ",this.collectionName);
              data.d_id = a.payload.doc.id;
              return data;
            });
          })
      )
      return this.item;
  }
   
   getMap(){
    this.item = this.itemClt.snapshotChanges().pipe(
      map(
        changes=> {
         
          return changes.map( a=> {
            const data = a.payload.doc.data() as Usuario;
            data.d_id = a.payload.doc.id;
            return data;
          });
        })
    )
    return this.item;
   }

   

   getEstudiantes(yesWhere?:boolean,where?:[string,any,any],yesOrder?:boolean,order?:[string,any]){
    if (yesWhere==undefined && yesOrder==undefined || yesWhere==false && yesOrder==false ){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("rol","==","Estudiante"));
     }else if(yesWhere==true && (yesOrder==undefined || yesOrder==false)){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("rol","==","Estudiante").where(where[0], where[1], where[2]));
     }else if (yesWhere==false && yesOrder==true){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("rol","==","Estudiante").orderBy(order[0], order[1]));
     }else if (yesWhere==true && yesOrder==true){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("rol","==","Estudiante").where(where[0], where[1], where[2]).orderBy(order[0], order[1]));
     }

     return this.getMap();
   }

   getProfesores(yesWhere?:boolean,where?:[string,any,any],yesOrder?:boolean,order?:[string,any]){
    if (yesWhere==undefined && yesOrder==undefined || yesWhere==false && yesOrder==false ){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("rol","==","Profesor"));
     }else if(yesWhere==true && (yesOrder==undefined || yesOrder==false)){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("rol","==","Profesor").where(where[0], where[1], where[2]));
     }else if (yesWhere==false && yesOrder==true){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("rol","==","Profesor").orderBy(order[0], order[1]));
     }else if (yesWhere==true && yesOrder==true){
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("rol","==","Profesor").where(where[0], where[1], where[2]).orderBy(order[0], order[1]));
     }

     return this.getMap();
   }

   addItem(item:Usuario):Promise<boolean>{
    let item2= Object.assign({}, item);
    let esEstudiante:boolean=false;
    let regEstudiante:RegEstudiante={
      d_id:"",
      d_idEstudiante:"",
      idSemestre: 1,
      idAvatar: 1,
      disponibles: "[1]"
    }
    let regLogro:RegLogro={
      d_id:"",
      idLogro:0,
      d_idEstudiante:"",
      valor:0
    }
    let regHabilidad:RegHabilidad={
      d_id:"",
      d_idEstudiante:"",
      idTipo:0,
      nivel:0
    }
    let logros:Logro[];
    let tipos:Tipo[];
    if(item.rol=="Estudiante"){
      if(item.sexo =="F"){
        regEstudiante.idAvatar=2;
        regEstudiante.disponibles="[2]";
      }
      esEstudiante=true;
    }
    return this.itemClt.add(item).then((registro)=>{
      console.log(`El ID del registro creado para ${this.collectionName} es: `, registro.id);
      item2.d_id= registro.id;
      regEstudiante.d_idEstudiante= registro.id;
      regLogro.d_idEstudiante= registro.id;
      regHabilidad.d_idEstudiante =registro.id;
      this.updateItem(item2);
      if(esEstudiante){
        this._regEstudianteS.addItem(regEstudiante);
        let subsGetL=this._logroS.getItem().subscribe(data=>{
          logros= data;
          for(let logro of logros){
            regLogro.idLogro=logro.id;
            this._regLogroS.addItem(regLogro);
          }
          subsGetL.unsubscribe();
        });
        let subsGetT=this._tipoS.getItem().subscribe(data=>{
          tipos= data;
          for(let tipo of tipos){
            regHabilidad.idTipo=tipo.id;
            this._regHabilidadS.addItem(regHabilidad);
          }
          subsGetT.unsubscribe();
        });
      }
      
      return true;
    }).catch((error)=>{
      console.error(`error al crear registro para ${this.collectionName}`, error);
      return false;
    });
   
   }

   deleteItem(item:Usuario):Promise<boolean>{
    let regsEstudiante:RegEstudiante[];
    let regsLogro:RegLogro[];
    let regsHabilidad:RegHabilidad[];
    let regsCalificacion:RegCalificacion[];
    let cursos:Curso[];
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    return this.itemDoc.delete().then(()=>{
      console.log(`registro ${item.d_id} eliminado satisfactoriamente de ${this.collectionName}`);
      if(item.rol=="Estudiante"){
        let subsGetRegEst=this._regEstudianteS.getItem(true,["d_idEstudiante","==",item.d_id]).subscribe(data=>{
          regsEstudiante=data;
          this._regEstudianteS.deleteItem(regsEstudiante[0]);
          subsGetRegEst.unsubscribe();
        });

        let subsGetL=this._regLogroS.getItem(true,["d_idEstudiante","==",item.d_id]).subscribe(data=>{
          regsLogro=data;
          for(let regLogro of regsLogro){
            this._regLogroS.deleteItem(regLogro);
          } 
          subsGetL.unsubscribe();
        });

        let subsGetRegH=this._regHabilidadS.getItem(true,["d_idEstudiante","==",item.d_id]).subscribe(data=>{
          regsHabilidad=data;
          for(let regHabilidad of regsHabilidad){
            this._regHabilidadS.deleteItem(regHabilidad);
          } 
          subsGetRegH.unsubscribe();
        });

        let subsGetRegC=this._regCS.getItem(true,["d_idEstudiante","==",item.d_id]).subscribe(data=>{
          regsCalificacion=data;
          for(let regCalificacion of regsCalificacion){
            this._regCS.deleteItem(regCalificacion);
          } 
          subsGetRegC.unsubscribe();
        });

      }else if (item.rol=="Profesor"){
        let subsGetCursos=this._cursoS.getItem(true,["d_idProfesor","==",item.d_id]).subscribe(data=>{
          cursos=data;
          for(let curso of cursos){
            this._cursoS.deleteItem(curso);
          } 
          subsGetCursos.unsubscribe();
        });
      }
      

      
      return true;
    }).catch((error)=>{
      console.error(`error al eliminar registro ${item.d_id} de ${this.collectionName}`, error);
      return false;
    });

   }

   updateItem(item:Usuario):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    return this.itemDoc.update(item).then(()=>{
      console.log(`Actualizado registro ${item.d_id} satisfactoriamente en ${this.collectionName}`);
      return true;
    }).catch((error)=>{    
      console.error(`error al actualizar registro ${item.d_id} en ${this.collectionName}` , error);
      return false;
    });
   }

   getRegistroV1(a:string, b:string){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where(
      "nombre", "==", a).where("apellido","==",b));
    return this.getMap();
  }

  filtrarNombre(a:string){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.orderBy("nombre","asc")
    .startAt(a).endAt(a+"\uf8ff"));
    return this.getMap();
  }

  filtrarApellido(a:string){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.orderBy("apellido","asc")
    .startAt(a).endAt(a+"\uf8ff"));
    return this.getMap();
  }

}
