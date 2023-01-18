import { Component, OnInit } from '@angular/core';
import { faAlignRight, faEllipsisVertical, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  faUserPlus = faUserPlus
  faEllipsisVertical = faEllipsisVertical
  users: any[] = [];
  urlG: string;

  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) { 
    this.urlG = this.configService.urlg;
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  getAllUser() {
    this.userService.getAllUser().subscribe(
      response => {
        this.users = response.results;
      }
    );
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'Voulez-vous vraiment supprimer cet utilisateur ?',
      showDenyButton: true,
      confirmButtonText: 'Oui',
      denyButtonText: `Non`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(
          response => {
            if (response.success) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                showConfirmButton: false,
                title: 'Utilisateur supprimé !',
                timer: 3000
              });
            }
            this.users = response.results;
          }
        );
      }
    })
  }

  showProfile(id: number) {
    this.userService.loadOneUser(id).subscribe(
      response => {
        if (response.success) {
          Swal.fire({
            imageUrl: this.urlG + response.results[0].image,
            imageHeight: '100px',
            imageWidth: '100px',
            html: `
            <div class="row">
                <h6 class="p-2 border border-info mb-3">Infos utilisateur</h6>
                <div class="col-6 form-group mb-3">
                    <label for="" class="form-label fw-bold">Nom</label>
                    <input type="text" class="form-control" readonly value="${response.results[0].lastname}">
                </div>
                <div class="col-6 form-group mb-3">
                    <label for="" class="form-label fw-bold">Prénom(s)</label>
                    <input type="text" class="form-control" readonly value="${response.results[0].firstname}">
                </div>
                <div class="col-6 form-group mb-4">
                    <label for="" class="form-label fw-bold">Email</label>
                    <input type="text" class="form-control" readonly value="${response.results[0].email}">
                </div>
                <div class="col-6 form-group mb-4">
                    <label for="" class="form-label fw-bold">Rôle</label>
                    <input type="text" class="form-control" readonly value="${response.results[0].isadmin == 0 ? 'Simple utilisateur' : 'Administrateur'}">
                </div>
            </div>
            `,
            showClass: {
              popup: 'w3-animate-top'
            },
          })
        }
      }
    );
  }
}
