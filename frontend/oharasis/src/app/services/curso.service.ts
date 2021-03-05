import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Curso } from "../../app/interfaces/curso.interface";

import { Evaluacion } from "../../app/interfaces/evaluacion.interface";
import { EvaluacionService } from "./evaluacion.service";
import { RegCalificacion } from "../../app/interfaces/regCalificacion.interface";
import { RegCalificacionService } from "./regCalificacion.service";

import { Observable} from "rxjs";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CursoService {

  itemClt:AngularFirestoreCollection<Curso>;
  item: Observable<Curso[]>;
  itemDoc: AngularFirestoreDocument<Curso>;
  collectionName:string= 'Cursos';

  constructor(public afs:AngularFirestore, public _evaluacionS:EvaluacionService,
    public _RegCS:RegCalificacionService) {
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

   getMap(){
    this.item = this.itemClt.snapshotChanges().pipe(
      map(
        changes=> {
         
          return changes.map( a=> {
            const data = a.payload.doc.data() as Curso;
            console.log("llamado servicio para: ",this.collectionName);
            data.d_id = a.payload.doc.id;
            return data;
          });
        })
    )
    return this.item;
   }

   addItem(item:Curso):Promise<boolean>{
    
    let item2= Object.assign({}, item); 
    return this.itemClt.add(item).then((registro)=>{
      console.log(`El ID del registro creado para ${this.collectionName} es: `, registro.id);
      item2.d_id= registro.id;
      this.updateItem(item2);
      return true;
    }).catch((error)=>{
      console.error(`error al crear registro para ${this.collectionName}`, error);
      return false;
    });
   
   }

   deleteItem(item:Curso):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    let evaluaciones:Evaluacion[];
    
    let regsC:RegCalificacion[];
    
    return this.itemDoc.delete().then(()=>{
      console.log(`registro ${item.d_id} eliminado satisfactoriamente de ${this.collectionName}`);
      let subsGetEva=this._evaluacionS.getItem(true,["d_idCurso","==",item.d_id]).subscribe(data=>{
        evaluaciones= data;
        for(let evaluacion of evaluaciones){
          this._evaluacionS.deleteItem(evaluacion);
        }
        subsGetEva.unsubscribe();
      });

      let subsGetRegC=this._RegCS.getItem(true,["d_idCurso","==",item.d_id]).subscribe(data=>{
        regsC= data;
        for(let regc of regsC){
          this._RegCS.deleteItem(regc);
        }
        subsGetRegC.unsubscribe();
      });

      return true;
    }).catch((error)=>{
      console.error(`error al eliminar registro ${item.d_id} de ${this.collectionName}`, error);
      return false;
    });

   }

   updateItem(item:Curso):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    return this.itemDoc.update(item).then(()=>{
      console.log(`Actualizado registro ${item.d_id} satisfactoriamente en ${this.collectionName}`);
      return true;
    }).catch((error)=>{    
      console.error(`error al actualizar registro ${item.d_id} en ${this.collectionName}` , error);
      return false;
    });
   }

   getCursosP(d_idProfesor:string, year:number, periodo:number){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("d_idProfesor", "==", d_idProfesor).where("year", "==", year)
    .where("idPeriodo", "==", periodo)
    );

    return this.getMap();
   }

   getCursosPV2(d_idProfesor:string, year:number){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("d_idProfesor", "==", d_idProfesor).where("year", "==", year)
    );

    return this.getMap();
   }

   getCursosPV3(d_idProfesor:string, periodo:number){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("d_idProfesor", "==", d_idProfesor).where("idPeriodo", "==", periodo)
    );

    return this.getMap();
   }

   getCursosD(year:number, periodo:number){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where("year", "==", year)
    .where("idPeriodo", "==", periodo)
    );

    return this.getMap();
   }

}
