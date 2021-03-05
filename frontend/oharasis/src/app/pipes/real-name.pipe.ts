import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'realName'
})
export class RealNamePipe implements PipeTransform {

  transform(value: any, arregloJson?: any, campo?: string, campo2?: string): any {
    let r: any;
    r = value;
    if (arregloJson !== undefined) {
      arregloJson.forEach(element => {
        if (value === element[campo]) {
          if (element['apellido'] !== undefined) {
            return r = element[campo2] + ' ' + element['apellido'];
          }
          return r = element[campo2];
        }
      });
    }
    return r;

  }

}
