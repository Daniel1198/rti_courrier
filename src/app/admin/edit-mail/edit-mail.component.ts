import { Component, OnInit } from '@angular/core';
import { ReceiverService } from 'src/app/services/receiver.service';

@Component({
  selector: 'app-edit-mail',
  templateUrl: './edit-mail.component.html',
  styleUrls: ['./edit-mail.component.scss']
})
export class EditMailComponent implements OnInit {

  services: any[] = []

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
}
