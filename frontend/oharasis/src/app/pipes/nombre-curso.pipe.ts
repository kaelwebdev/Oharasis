import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreCurso'
})
export class NombreCursoPipe implements PipeTransform {

  transform(value: any, arregloJson?: any): any {
    let r:any;
    r=value;
    if (arregloJson!=undefined){
      arregloJson.forEach(element => {
        if (value==element["d_id"]){
          return r=element["nombre"]+"-A"+element["year"]+"-P"+element["idPeriodo"]+"-G"+element["idGrupo"];
        }
      });
    }
    return r;
  }

}
