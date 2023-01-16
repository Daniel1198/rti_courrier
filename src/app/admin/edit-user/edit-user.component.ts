import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
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

  constructor(
    private userBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initForm();
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  initForm() {
    this.userGroup = this.userBuilder.group({
      id: [''],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isAdmin: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      image: [''],
    })
  }

  onSubmit() {
    this.loading = true;
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
      // transmission des données au service de création de comptes utilisateurs
      this.userService.newUser(userData).subscribe(
        result => {
          console.log(result);
          
          if (result.success) {
            this.loading = false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: result.message,
              showConfirmButton: true,
              timer: 5000
            });
            this.userGroup.reset();
            this.previewImage = 'assets/images/avatar.png';
          }
          else {
            this.loading = false;
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: result.message,
              showConfirmButton: true,
              timer: 5000
            })
          }
        }
      );
    }
    else {
      // transmission des données au service de modification de comptes utilisateurs
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
