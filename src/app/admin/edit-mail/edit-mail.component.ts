import { Component, OnInit } from '@angular/core';
import { ReceiverService } from 'src/app/services/receiver.service';

@Component({
  selector: 'app-edit-mail',
  templateUrl: './edit-mail.component.html',
  styleUrls: ['./edit-mail.component.scss']
})
export class EditMailComponent implements OnInit {

  services: any[] = []
  files: any[] = [];

  constructor(
    private receiverService: ReceiverService
  ) {}

  ngOnInit(): void {
    this.getAllService();
  }

  getAllService() {
    this.receiverService.getAllReceiver().subscribe(
      response => {
        this.services = response.results
      }
    );
  }

  onBack() {
    history.back();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files[i]);
      }
      
      // this.formGroup.patchValue({
      //   photo: file
      // });
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }
}
