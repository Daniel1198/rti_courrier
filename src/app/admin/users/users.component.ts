import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { faEllipsisVertical, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) { 
    this.urlG = this.configService.urlg;
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  async showPopPwdChange(id: number) {
    const { value: password } = await Swal.fire({
      title: 'Nouveau mot de passe',
      input: 'password',
      inputPlaceholder: 'Entrer le nouveau mot de passe',
    })
    
    if (password) {
      const { value: confirmPassword } = await Swal.fire({
        title: 'Confirmer le nouveau mot de passe',
        input: 'password',
        inputPlaceholder: 'Confirmer le mot de passe',
      });

      if (confirmPassword) {
        if (password !== confirmPassword) {
          Swal.fire({
            title: 'Erreur',
            text: "Les mots de passe ne concordent pas.",
            icon: 'error',
            showConfirmButton: true
          }).then(() => {
            this.showPopPwdChange(id);
          })
        }
        else {
          const formData = new FormData();

          formData.append('id', id.toString());
          formData.append('password', password);

          this.userService.changePassword(formData).subscribe(
            response => {
              if (response.success) {
                this.Toast.fire({
                  icon: 'success',
                  title: response.message
                })
              }
              else {
                this.Toast.fire({
                  icon: 'error',
                  title: response.message
                })
              }
            }
          )
        }
      }
    }
  }

  getAllUser() {
    this.userService.getAllUser().subscribe(
      response => {
        this.users = response.results;
      }
    );
  }

  onSearch(search: string) {
    if (search) {
      this.userService.searchUser(search).pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(
        response => {
          if (response.success) {
            this.users = response.results;
          }
        }
      );
    }
    else {
      this.getAllUser();
    }
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
              this.Toast.fire({
                icon: 'success',
                title: response.message
              })
            }
            this.getAllUser();
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
