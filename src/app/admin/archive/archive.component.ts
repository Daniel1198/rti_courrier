import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { MailService } from 'src/app/services/mail.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  attachmentsByDate: any[] = [];
  donnees: any[] = [];
  urlg: string = '';
  nowDate: any = new Date();
  id!: string;
  search!: string;
  initialDate!: string;
  finalDate!: string;
  constructor(
    private mailService: MailService,
    private configService: ConfigService,
    private route: ActivatedRoute
  ) {
    this.urlg = this.configService.urlg;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id != '0') {
      this.search = this.id;
    }
    
    this.nowDate = formatDate(this.nowDate, "yyyy-MM-dd", "fr");
    this.mailService.getAttachments().subscribe(
      response => {
        this.attachmentsByDate = response.results
        this.donnees = response.results
      }
    );
  }

  onSearch() {
    if (this.initialDate) {
      this.attachmentsByDate = this.donnees.filter((data: any) => {
        const initDate = new Date(this.initialDate);
        const endDate = new Date(this.finalDate);
        const dataDate = new Date(data.date);
        if (this.finalDate) {
          return (dataDate.getTime() >= initDate.getTime()) && (dataDate.getTime() <= endDate.getTime());
        }
        return initDate.getTime() == dataDate.getTime();
      });
    }
    else {
      this.attachmentsByDate = this.donnees
    }
  }
}
