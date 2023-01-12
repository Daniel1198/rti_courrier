import { Component } from '@angular/core';
import { faEnvelope, faFileExport, faMailBulk, faPause, faPrint, faUpRightFromSquare, faUserTie } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  faFileExport = faFileExport;
  faPrint = faPrint;
  faEnvelope = faEnvelope;
  faMailBulk = faMailBulk;
  faPause = faPause
  faUpRightFromSquare = faUpRightFromSquare
  faUserTie = faUserTie

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
