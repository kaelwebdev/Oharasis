import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { RegCalificacionSO } from "../../app/interfaces/regCalificacionSO.interface";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { Pi } from "../../app/interfaces/pi.interface";
import { PiService } from "../../app/services/pi.service";
import { RegCalificacionPIService } from "../../app/services/regCalificacionPI.service";
import { RegCalificacionPI } from "../../app/interfaces/regCalificacionPi.interface";
@Injectable({
  providedIn: 'root'
})
export class RegCalificacionSOService {

  itemClt:AngularFirestoreCollection<RegCalificacionSO>;
  item: Observable<RegCalificacionSO[]>;
  itemDoc: AngularFirestoreDocument<RegCalificacionSO>;
  collectionName:string= 'RegCalificacionSOs';

  constructor(public afs:AngularFirestore, private _regCPIS:RegCalificacionPIService,
    private _piS:PiService) {
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
            const data = a.payload.doc.data() as RegCalificacionSO;
            console.log("llamado servicio para: ",this.collectionName);
            data.d_id = a.payload.doc.id;
            return data;
          });
        })
    )
    return this.item;
   }
   addItem(item:RegCalificacionSO):Promise<boolean>{
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref); 
    let item2= Object.assign({}, item);
    let regCalificacionPI:RegCalificacionPI ={
      d_id:"",
      d_idCurso:"",
      d_idEstudiante:"",
      idPi:0,
      idSo:0,
      valor:0
    }
    regCalificacionPI.d_idCurso=item.d_idCurso;
    regCalificacionPI.d_idEstudiante=item.d_idEstudiante;
    regCalificacionPI.idSo=item.idSo;
    let pis:Pi[]; 
    return this.itemClt.add(item).then((registro)=>{
      console.log(`El ID del registro creado para ${this.collectionName} es: `, registro.id);
      item2.d_id= registro.id;
      this.updateItem(item2);
      let subsGetPi = this._piS.getItem(true, ["idSo","==",item2.idSo]).subscribe(data=>{
        subsGetPi.unsubscribe();
        pis= data;
        for(let pi of pis){

          regCalificacionPI.idPi = pi.id;
          this._regCPIS.addItem(regCalificacionPI);
          regCalificacionPI.idPi = 0;
        }
       
      });
      return true;
    }).catch((error)=>{
      console.error(`error al crear registro para ${this.collectionName}`, error);
      return false;
    });
    
   }

   deleteItem(item:RegCalificacionSO):Promise<boolean>{
    this.itemDoc = this.afs.doc(`${this.collectionName}/${item.d_id}`);
    let regsCalificacionPI:RegCalificacionPI[];
    return this.itemDoc.delete().then(()=>{
      console.log(`registro ${item.d_id} eliminado satisfactoriamente de ${this.collectionName}`);
      console.log(item.d_idCurso+","+item.d_idEstudiante+"+"+item.idSo);
      let subsGetregCPI=this._regCPIS.getRegistroV1(item.d_idCurso,item.d_idEstudiante, item.idSo).subscribe(data=>{
        regsCalificacionPI= data;
        console.log(data);
        for(let regCalificacionPI of regsCalificacionPI){
          this._regCPIS.deleteItem(regCalificacionPI);
        }
        subsGetregCPI.unsubscribe();
      });
      return true;
    }).catch((error)=>{
      console.error(`error al eliminar registro ${item.d_id} de ${this.collectionName}`, error);
      return false;
    });

   }

   updateItem(item:RegCalificacionSO):Promise<boolean>{
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
      "d_idCurso", "==", a).where("d_idEstudiante","==",b).orderBy("idSo","asc"));
    return this.getMap();
  }

  getRegistroV0(a:number){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where(
      "idSo", "==", a));
    return this.getMap();
  }

  getRegistroV3(a:number, b:string, c:string){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where(
      "valor", "==", a).where("d_idCurso","==",b).where("d_idEstudiante","==",c).orderBy("idSo","asc"));
    return this.getMap();
  }

  getRegistroV4(a:number,b:number){
    this.itemClt = this.afs.collection(this.collectionName, ref=> ref.where(
      "idSo", "==", a).where("valor", "==", b));
    return this.getMap();
  }

}
