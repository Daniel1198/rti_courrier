import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { MailService } from 'src/app/services/mail.service';

@Component({
  selector: 'app-show-attachments',
  templateUrl: './show-attachments.component.html',
  styleUrls: ['./show-attachments.component.scss']
})
export class ShowAttachmentsComponent implements OnInit {

  id!: number;
  attachments: any[] = [];
  urlg: string = '';

  constructor(
    private route: ActivatedRoute,
    private mailService: MailService,
    private configService: ConfigService
  ) {
    this.urlg = this.configService.urlg
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.getAttachments();
  }

  getAttachments() {
    this.mailService.getMailAttachments(this.id).subscribe(
      response => this.attachments = response.results
    );
  }

  onBack() {
    history.back();
  }
}
