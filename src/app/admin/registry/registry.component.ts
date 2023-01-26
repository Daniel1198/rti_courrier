import { Component, OnInit } from '@angular/core';
import { faFolder, faFolderTree } from '@fortawesome/free-solid-svg-icons';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit {
  faFolderTree = faFolderTree
  faFolder = faFolder
  loading: boolean = false;

  registers: any[] = [];

  constructor(
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.getAllRegister();
  }

  getAllRegister() {
    this.loading = true;
    this.registerService.getAllRegister().subscribe(
      response => {
        this.loading = false;
        this.registers = response.results;
      }
    );
  }
}
