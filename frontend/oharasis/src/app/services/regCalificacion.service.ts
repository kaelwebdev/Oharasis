import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { RegCalificacion } from "../../app/interfaces/regCalificacion.interface";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { RegCalificacionSO } from "../../app/interfaces/regCalificacionSO.interface";
import { RegCalificacionSOService } from "../../app/services/regCalificacionSO.service";
import { So } from "../../app/interfaces/so.interface";
import { SoService } from "../../app/services/so.service";
import { RegEvaluacionCriterio } from "../../app/interfaces/regEvaluacionCriterio.interface";
import { RegEvaluacionCriterioService } from "../../app/services/regEvaluacionCriterio.service";

@Injectable({
  providedIn: 'root'
})
export class RegCalificacionService {

  itemClt:AngularFirestoreCollection<RegCalificacion>;
  item: Observable<RegCalificacion[]>;
  itemDoc: AngularFirestoreDocument<RegCalificacion>;
  collectionName:string= 'RegCalificaciones';

  constructor(public afs:AngularFirestore, public _regCalificacionSoS:RegCalificacionSOService,
    public _soS:SoService, public _regECS:RegEvaluacionCriterioService) {
      
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

    return this.getMap();
    
   }
  
   getMap(){
    this.item = this.itemClt.snapshotChanges().pipe(
      map(
        changes=> {
         
          return changes.map( a=> {
            const data = a.payload.doc.data() as RegCalificacion;
            console.log("llamado servicio para: ",this.collectionName);
            data.d_id = a.payload.doc.id;
            return data;
          });
        })
    )
    return this.item;
   }

   addItem(item:RegCalificacion):Promise<boolean>{
    let item2= Object.assign({}, item);
    let regCalificacionSO:RegCalificacionSO ={
      d_id:"",
      d_idCurso:"",
      d_idEstudiante:"",
      idSo:0,
      corte:0,
      valor:0
    }
    let sos:So[];
    regCalificacionSO.d_idCurso = item.d_idCurso;
    regCalificacionSO.d_idEstudiante = item.d_idEstudiante;
    return this.itemClt.add(item).then((registro)=>{
      console.log(`El ID del registro creado para ${this.collectionName} es: `, registro.id);
      item2.d_id= registro.id;
      this.updateItem(item2);
      let subsGetSos = this._soS.getItem().subscribe(data=>{
        sos= data;
        for(let so of sos){
          regCalificacionSO.idSo = so.id;
          this._regCalificacionSoS.addItem(regCalificacionSO);
          regCalificacionSO.idSo = 0;
        }
        subsGetSos.unsubscribe();
      });

      return true;
    }).catch((error)=>{
      console.error(`error al crear registro para ${this.collectionName}`, error);
      return false;
    });
    
   }

   deleteItem(item:RegCalificacion):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    let regsCalificacionSO:RegCalificacionSO[];
    let regsEC:RegEvaluacionCriterio[];
  
    return this.itemDoc.delete().then(()=>{
      console.log(`registro ${item.d_id} eliminado satisfactoriamente de ${this.collectionName}`);
      let subsGetCSos=this._regCalificacionSoS.getRegistroV1(item.d_idCurso,item.d_idEstudiante).subscribe(data=>{
        regsCalificacionSO= data;
        for(let regCalificacionSO of regsCalificacionSO){
          this._regCalificacionSoS.deleteItem(regCalificacionSO);
        }
        subsGetCSos.unsubscribe();
      });

      let subsGetEC=this._regECS.getItem(true,["d_idEstudiante","==",item.d_idEstudiante]).subscribe(data=>{
        regsEC= data;
        for(let regEC of regsEC){
          this._regECS.deleteItem(regEC);
        }
        subsGetEC.unsubscribe();
      });

      return true;
    }).catch((error)=>{
      console.error(`error al eliminar registro ${item.d_id} de ${this.collectionName}`, error);
      return false
    });

   }

   updateItem(item:RegCalificacion):Promise<boolean>{
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
      "d_idCurso", "==", a).where("d_idEstudiante","==",b));
    return this.getMap();
  }

}
