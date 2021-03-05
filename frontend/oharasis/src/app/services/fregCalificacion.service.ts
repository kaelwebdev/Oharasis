import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { RegCalificacion } from "../../app/interfaces/regCalificacion.interface";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FregCalificacionService {
  //ESTE ES UN SERVICIO FAKE pero necesario para evitar un Circular dependency detected en so.service
  //a futuro hay que eliminar la dependencia de este servicio.
  itemClt:AngularFirestoreCollection<RegCalificacion>;
  item: Observable<RegCalificacion[]>;
  itemDoc: AngularFirestoreDocument<RegCalificacion>;
  collectionName:string= 'RegCalificaciones';

  constructor(public afs:AngularFirestore) {
      console.log("inicializando servicio para: ",this.collectionName);
      this.itemClt = this.afs.collection(this.collectionName, ref=> ref);
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


}
