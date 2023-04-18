import { Pipe, PipeTransform } from '@angular/core';
import { replaceAccent } from '../services/function';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(table: any[], search: string): any[] {
    return table.filter((data: any) => {
      return replaceAccent(data.attach_label).includes(replaceAccent(search)) ||
              replaceAccent(data.ref_mail).includes(replaceAccent(search));
    });
  }

}
