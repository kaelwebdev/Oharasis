import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Pi } from "../../app/interfaces/pi.interface";
import { Observable, pipe } from "rxjs";
import { map } from 'rxjs/operators';
import { RegCalificacionPI } from "../../app/interfaces/regCalificacionPI.interface";
import { RegCalificacionPIService } from "../../app/services/regCalificacionPI.service";
import { FregCalificacionService } from "../../app/services/fregCalificacion.service";

@Injectable({
  providedIn: 'root'
})
export class PiService {

  itemClt:AngularFirestoreCollection<Pi>;
  item: Observable<Pi[]>;
  itemDoc: AngularFirestoreDocument<Pi>;
  collectionName:string= 'Pis';

  constructor(public afs:AngularFirestore, public _regCPiS:RegCalificacionPIService,
    public _fregC:FregCalificacionService) {
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
    
    this.item = this.itemClt.snapshotChanges().pipe(
      map(
        changes=> {
         
          return changes.map( a=> {
            const data = a.payload.doc.data() as Pi;
            console.log("llamado servicio para: ",this.collectionName);
            data.d_id = a.payload.doc.id;
            return data;
          });
        })
    )
    return this.item;
   }


   addItem(item:Pi):Promise<boolean>{
    let item2= Object.assign({}, item);
    let item3= Object.assign({}, item);
    let regsCalificacion:RegCalificacionPI[];
    let regCalificacionPI:RegCalificacionPI ={
      d_id:"",
      d_idCurso:"",
      d_idEstudiante:"",
      idPi:0,
      idSo:0,
      valor:0
    }
    return this.itemClt.add(item).then((registro)=>{
      console.log(`El ID del registro creado para ${this.collectionName} es: `, registro.id);
      item2.d_id= registro.id;
      this.updateItem(item2);
      let subsGetRegC=this._fregC.getItem().subscribe(data=>{
        regsCalificacion= data;
        
        for(let regCalificacion of regsCalificacion){
         
          //por cada estudiante matriculado se crea el regCPI
          regCalificacionPI.d_idCurso=regCalificacion.d_idCurso;
          regCalificacionPI.d_idEstudiante=regCalificacion.d_idEstudiante;
          regCalificacionPI.idPi=item3.id;
          regCalificacionPI.idSo=item3.idSo;
          this._regCPiS.addItem(regCalificacionPI);
        }
        subsGetRegC.unsubscribe();
      });
      return true;
    }).catch((error)=>{
      console.error(`error al crear registro para ${this.collectionName}`, error);
      return false;
    });
   
   }

   deleteItem(item:Pi):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    let regsCalificacionPI:RegCalificacionPI[];
    return this.itemDoc.delete().then(()=>{
      console.log(`registro ${item.id} eliminado satisfactoriamente de ${this.collectionName}`);
      let subsGetRegCPIs=this._regCPiS.getRegistroV0(item.id).subscribe(data=>{
        regsCalificacionPI= data;
        for(let regCalificacionPI of regsCalificacionPI){
          this._regCPiS.deleteItem(regCalificacionPI);
        }
        subsGetRegCPIs.unsubscribe();
      });
      return true;
    }).catch((error)=>{
      console.error(`error al eliminar registro ${item.id} de ${this.collectionName}`, error);
      return false;
    });

   }

   updateItem(item:Pi):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    return this.itemDoc.update(item).then(()=>{
      console.log(`Actualizado registro ${item.id} satisfactoriamente en ${this.collectionName}`);
      return true;
    }).catch((error)=>{    
      console.error(`error al actualizar registro ${item.id} en ${this.collectionName}` , error);
      return false;
    });
   }

}
