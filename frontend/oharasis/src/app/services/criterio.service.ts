import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Criterio } from "../../app/interfaces/criterio.interface";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { Evaluacion } from '../interfaces/evaluacion.interface';
import { RegEvaluacionCriterio } from "../../app/interfaces/regEvaluacionCriterio.interface";
import { RegEvaluacionCriterioService } from "./regEvaluacionCriterio.service";
import { RegCalificacion } from "../../app/interfaces/regCalificacion.interface";
import { RegCalificacionService } from "./regCalificacion.service";
@Injectable({
  providedIn: 'root'
})
export class CriterioService {

  itemClt:AngularFirestoreCollection<Criterio>;
  item: Observable<Criterio[]>;
  itemDoc: AngularFirestoreDocument<Criterio>;
  collectionName:string= 'Criterios';

  constructor(public afs:AngularFirestore,
     public _regECS:RegEvaluacionCriterioService,
     public _regCalificacionS:RegCalificacionService) {
      console.log("inicializando servicio para: ",this.collectionName);
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref);
   }
  
   getItemSimple(){
    this.item = this.itemClt.valueChanges(); 
     return this.item;
   }
   
   getItem(yesWhere?:boolean,
       where?:[string,any,string],
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
  
    this.item = this.itemClt.snapshotChanges().pipe(
      map(
        changes=> {
         
          return changes.map( a=> {
            const data = a.payload.doc.data() as Criterio;
            console.log("llamado servicio para: ",this.collectionName);
            data.d_id = a.payload.doc.id; 
            return data;
          });
        })
    )
    return this.item;
   }

   addItem(item:Criterio, evaluacion:Evaluacion):Promise<boolean>{
    let item2= Object.assign({}, item);
    let regEC:RegEvaluacionCriterio={
      d_id: "",
      d_idEvaluacion: "",
      d_idCriterio: "",
      d_idEstudiante: "",
      valor: 0,
      idCategoria: 0,
      corte:0
    }
    let regsCalificacion:RegCalificacion[];
    regEC.d_idEvaluacion = evaluacion.d_id;
    regEC.idCategoria =item.idCategoria;
    regEC.corte =evaluacion.idCorte;
    return this.itemClt.add(item).then((registro)=>{
      console.log(`El ID del registro creado para ${this.collectionName} es: `, registro.id);
      item2.d_id= registro.id;
      regEC.d_idCriterio =item2.d_id;
      this.updateItem(item2);
      let subsGetRegC= this._regCalificacionS.getItem(true, ["d_idCurso","==",evaluacion.d_idCurso]).subscribe(data=>{
        regsCalificacion= data;
        for(let regCalificacion of regsCalificacion){
          regEC.d_idEstudiante = regCalificacion.d_idEstudiante;
          this._regECS.addItem(regEC); /*se agrega un registro (regEC) referente al criterio 
          creado pero por cada alumno matriculado.*/
          regEC.d_idEstudiante = "";
        }
        subsGetRegC.unsubscribe();
      });
      
      
      return true;
    }).catch((error)=>{
      console.error(`error al crear registro para ${this.collectionName}`, error);
      return false;
    });
    
   }

   deleteItem(item:Criterio,evaluacion:Evaluacion):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    let regsEC:RegEvaluacionCriterio[];
    return this.itemDoc.delete().then(()=>{
      console.log(`registro ${item.d_id} eliminado satisfactoriamente de ${this.collectionName}`);
      let subsGetRegEC=this._regECS.getRegistroV1(item.d_id,evaluacion.d_id).subscribe(data=>{
        regsEC= data;
        for(let regEC of regsEC){
          this._regECS.deleteItem(regEC);
        }
        subsGetRegEC.unsubscribe();
      });
      
      return true;
    }).catch((error)=>{
      console.error(`error al eliminar registro ${item.d_id} de ${this.collectionName}`, error);
      return false;
    });

   }

   deleteItem2(item:Criterio):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    let regsEC:RegEvaluacionCriterio[];
    return this.itemDoc.delete().then(()=>{
      console.log(`registro ${item.d_id} eliminado satisfactoriamente de ${this.collectionName}`);
      let subsGetRegEC=this._regECS.getItem(true,["d_idCriterio","==",item.d_id]).subscribe(data=>{
        regsEC= data;
        for(let regEC of regsEC){
          this._regECS.deleteItem(regEC);
        }
        subsGetRegEC.unsubscribe();
      });
      
      return true;
    }).catch((error)=>{
      console.error(`error al eliminar registro ${item.d_id} de ${this.collectionName}`, error);
      return false;
    });

   }

   updateItem(item:Criterio):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    return this.itemDoc.update(item).then(()=>{
      console.log(`Actualizado registro ${item.d_id} satisfactoriamente en ${this.collectionName}`);
      return true;
    }).catch((error)=>{
      console.error(`error al actualizar registro ${item.d_id} en ${this.collectionName}` , error);
      return false;
    });
   }

}
