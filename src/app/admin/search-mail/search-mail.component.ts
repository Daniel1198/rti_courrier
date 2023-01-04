import { Component } from '@angular/core';
import { faFileExport, faPencil, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-mail',
  templateUrl: './search-mail.component.html',
  styleUrls: ['./search-mail.component.scss']
})
export class SearchMailComponent {
  faFileExport = faFileExport
  faPrint = faPrint
  faPencil = faPencil
  faTrash = faTrash

  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];

  data: any = [1, 2, 3, 4, 5, 6];

  changeSize(value: string) {
    this.tableSize = +value;
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.data;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.data;
  }
}
