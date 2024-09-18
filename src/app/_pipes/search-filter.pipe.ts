import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], searchTerm: string, propertyName: string): any[] {
    if (!items || !searchTerm || !propertyName) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      return item[propertyName].toLowerCase().includes(searchTerm);
    });
  }

}
