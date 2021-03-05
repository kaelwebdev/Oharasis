import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { RegHabilidad } from "../../app/interfaces/regHabilidad.interface";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RegHabilidadService {

  itemClt:AngularFirestoreCollection<RegHabilidad>;
  item: Observable<RegHabilidad[]>;
  itemDoc: AngularFirestoreDocument<RegHabilidad>;
  collectionName:string= 'RegHabilidad';

  constructor(public afs:AngularFirestore) {
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
            const data = a.payload.doc.data() as RegHabilidad;
            console.log("llamado servicio para: ",this.collectionName);
            data.d_id = a.payload.doc.id; 
            return data;
          });
        })
    )
    return this.item;
   }

   addItem(item:RegHabilidad):Promise<boolean>{
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

   deleteItem(item:RegHabilidad):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    return this.itemDoc.delete().then(()=>{
      console.log(`registro ${item.d_id} eliminado satisfactoriamente de ${this.collectionName}`);
      return true;
    }).catch((error)=>{
      console.error(`error al eliminar registro ${item.d_id} de ${this.collectionName}`, error);
      return false;
    });

   }

   updateItem(item:RegHabilidad):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    return this.itemDoc.update(item).then(()=>{
      console.log(`Actualizado registro ${item.d_id} satisfactoriamente en ${this.collectionName}`);
      return true;
    }).catch((error)=>{
      console.error(`error al actualizar registro ${item.d_id} en ${this.collectionName}` , error);
      return false;
    });
   }


   getRegistroV1(a:string, b:number){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where(
      "d_idEstudiante", "==", a).where("idTipo","==",b));
    return this.getMap();
  }
}
