import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  faCamera = faCamera
  userGroup!: FormGroup
  previewImage: any = 'assets/images/avatar.png';
  id!: number;
  loading: boolean = false;
  pwd!: string;

  constructor(
    private userBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadUser();
  }

  onVerifyPassword(password: string) {
    this.pwd = password;
  }

  initForm() {
    this.userGroup = this.userBuilder.group({
      id: [''],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isAdmin: [''],
      password: ['', this.id !== 0 ? Validators.nullValidator : Validators.required],
      confirmPassword: [
        '', 
        [
          this.id !== 0 ? Validators.nullValidator : Validators.required
        ]
      ],
      image: [''],
    })
  }

  get password() {
    return this.userGroup.controls['password'].value;
  }

  get confirmPassword() {
    return this.userGroup.controls['confirmPassword'].value;
  }

  verifyPassword() {
    if ((this.password as string) !== (this.confirmPassword as string)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Oops...',
        text: 'Les mots de passe saisis ne concordent pas.',
        showConfirmButton: true
      });
    }
    else {
      this.onSubmit();
    }
  }

  loadUser() {
    if (this.id !== 0) {
      this.userService.loadOneUser(this.id).subscribe(
        response => {
          if (response.success) {
            this.previewImage = this.configService.urlg + response.results[0].image;
            this.userGroup.patchValue({
              id: response.results[0].id,
              lastname: response.results[0].lastname,
              firstname: response.results[0].firstname,
              email: response.results[0].email,
              isAdmin: response.results[0].isadmin,
            })
          }
        }
      );

      this.userGroup.controls['password'].disable();
      this.userGroup.controls['confirmPassword'].disable();
    }
  }

  onSubmit() {
    const userData = new FormData();

    // récupération des informations saisies pour la transmission
    userData.append('id', this.userGroup.get('id')?.value);
    userData.append('lastname', this.userGroup.get('lastname')?.value);
    userData.append('firstname', this.userGroup.get('firstname')?.value);
    userData.append('email', this.userGroup.get('email')?.value);
    userData.append('is_admin', this.userGroup.get('isAdmin')?.value);
    userData.append('password', this.userGroup.get('password')?.value);
    userData.append('user_profile', this.userGroup.get('image')?.value);

    if (this.id === 0) {
      this.loading = true;
      // transmission des données au service de création de comptes utilisateurs
      this.userService.newUser(userData).subscribe(
        result => {
          if (result.success) {
            this.loading = false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Compte créé avec succès !',
              showConfirmButton: true
            });
            this.userGroup.reset();
            this.previewImage = 'assets/images/avatar.png';
          }
          else {
            this.loading = false;
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Oops...',
              text: result.message,
              showConfirmButton: true
            });
          }
        }
      );
    }
    else {
      // transmission des données au service de modification des comptes utilisateurs
      Swal.fire({
        title: 'Les informations de cet utilisateur seront modifiées. Le confirmez-vous ? ?',
        showDenyButton: true,
        confirmButtonText: 'Oui',
        denyButtonText: `Non`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.userService.updateUser(userData).subscribe(
            response => {
              if (response.success) {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  showConfirmButton: true,
                  title: 'Informations modifiées avec succès !',
                }).then(() => {
                  history.back();
                });
              }
              else {
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Erreur lors de la modification ! Veuillez réessayer svp !',
                  showConfirmButton: true
                });
              }
            }
          );
        }
      });
    }
  }

  // récupération puis affichage de la photo sélectionnée
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (e) => this.previewImage = e.target?.result;
      reader.readAsDataURL(file);
      
      this.userGroup.patchValue({
        image: file
      });
    }
  }

  onBack() {
    history.back();
  }
}
