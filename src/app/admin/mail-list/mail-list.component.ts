import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCheck, faEnvelope, faEye, faFileExport, faPencil } from '@fortawesome/free-solid-svg-icons';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit {
  faEnvelope = faEnvelope
  faFileExport = faFileExport
  faPencil = faPencil
  faCheck = faCheck
  faEye = faEye

  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];

  data: any = [1, 2, 3, 4, 5, 6];
  register: any;
  id!: number;

  constructor(
    private registerService: RegisterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.getAllRegister();
  }

  getAllRegister() {
    this.registerService.getAllRegister().subscribe(
      response => {
        this.register = response.results.find((register: any) => register.id == this.id);
      }
    )
  }

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
