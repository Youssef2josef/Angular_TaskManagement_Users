import { Component, OnInit, forwardRef } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import Swal from 'sweetalert2';
import { AuthManagerService } from 'src/app/demo/service/manager/auth-manager.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/demo/service/token-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { RecoveryPasswordComponent } from '../recovery-password/recovery-password.component';
import { AuthEmployeeService } from 'src/app/demo/service/employee/auth-employee.service';
import { PasswordRecoveryService } from 'src/app/demo/service/manager/password-recovery.service';
import { PasswordRecoveryEmployeeService } from 'src/app/demo/service/password-recovery-employee.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
  styleUrls: ['./login.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LoginComponent),
      multi: true,
    }
  ]
})
export class LoginComponent implements OnInit {

  public configOptions = {
    length: 6,
    inputClass: 'digit-otp',
    containerClass: 'd-flex justify-content-between'
  }

  token_auth: any = localStorage.getItem('auth-token');
  otp!: string;
  number!: number;
  inputDigitLeft: string = "Verify code";
  loginForm !: FormGroup
  keyVerification !: FormGroup
  qrCodeVerification !: FormGroup
  redirection !: FormGroup
  passwordForgotton !: FormGroup
  recoveryFormOptions !: FormGroup
  recoveryEmailForm !: FormGroup
  recoveryPhoneForm !: FormGroup
  phoneKeyVerification !: FormGroup
  keyPhoneVerification !: FormGroup
  hide = true;
  navigation: boolean = false;
  x: boolean = false
  QrCode: boolean = false;
  response: any = {}
  QrCodeUrl: any

  dialogState: any

  password!: string;

  email!: string;

  recoveryDialog: boolean = false;

  goCondition: boolean = false;

  access: boolean = false;

  option!: String;

  key: boolean = false;

  constructor(public layoutService: LayoutService,
    private formBuilder: FormBuilder,
    private authService: AuthManagerService,
    private authServiceEmployee: AuthEmployeeService,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private passwordRecover: PasswordRecoveryService,
    private employeePasswordRecover: PasswordRecoveryEmployeeService
  ) { }

  ngOnInit(): void {

    this.validateToken();
    if (sessionStorage.getItem("IsLoggedIn") == "true" ||(localStorage.getItem("email") && localStorage.getItem("auth-token"))) {
      this.router.navigate(["dashboard"])
    }

    if (sessionStorage.getItem("email") && sessionStorage.getItem("option") == "false") {
      this.navigation = true;
    }

    if (sessionStorage.getItem("auth-QrCode") && sessionStorage.getItem("option") == "true") {
      this.navigation = true
      this.QrCode = true
      this.QrCodeUrl = sessionStorage.getItem("url-image")
    }

    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]],
      option: [false],
      userType: [""]
    })

    this.keyVerification = this.formBuilder.group({
      email: [sessionStorage.getItem("email")],
      key: ['', [Validators.required]],
    })

    this.keyPhoneVerification = this.formBuilder.group({
      phoneNumber: [sessionStorage.getItem("phone")],
      key: [''],
    })

    this.qrCodeVerification = this.formBuilder.group({
      email: [sessionStorage.getItem("email")],
      code: ['', [Validators.required]],
    })

    this.redirection = this.formBuilder.group({
      userType: [""]
    })

    this.passwordForgotton = this.formBuilder.group({
      userType: [""]
    })

    this.recoveryFormOptions = this.formBuilder.group({
      userType: [""]
    })

    this.recoveryEmailForm = this.formBuilder.group({
      email: [""],
      emailRec: [""]
    })

    this.recoveryPhoneForm = this.formBuilder.group({
      phoneNumber: [""],
    })

    this.phoneKeyVerification = this.formBuilder.group({
      keyCode: [""]
    })
  }

  getErrorMessage() {
    if (this.loginForm.controls["email"].hasError('required')) {
      return 'You must enter a value';
    }
    return this.loginForm.controls["email"].hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessagePassword() {
    if (this.loginForm.controls["password"].hasError('required')) {
      return 'You must enter a value';
    }

    return this.loginForm.controls["password"].hasError('pattern') ? 'Minimum 8 letters :At least one character majus , minus , symbol and number' : '';
  }

  getErrorMessageKey() {
    return this.keyVerification.controls["key"].hasError('required') ? 'You must enter the Key' : '';
  }

  getErrorMessageQrCode() {
    return this.qrCodeVerification.controls["code"].hasError('required') ? 'You must enter the Key' : '';
  }

  login() {
    //console.log(this.loginForm.value);
    if (this.loginForm.value.userType == "manager") {
      console.log("manager");
      sessionStorage.setItem("role", "Manager");
      const managerLoginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        option: this.loginForm.value.option
      }
      console.log(managerLoginData);
      this.authService.login(managerLoginData).subscribe((data: any) => {
        console.log(data);
        if (data.status == 200) {
          sessionStorage.setItem("option", this.loginForm.value.option);
          this.response = data
          if (data.user) {
            sessionStorage.setItem("email", data.user);
          }
          if (this.loginForm.value.option == true) {
            sessionStorage.setItem("email", this.loginForm.value['email']);
            sessionStorage.setItem("auth-QrCode", "true");
            this.QrCode = true
            sessionStorage.setItem("url-image", this.response.secretImageUri)
            this.QrCodeUrl = sessionStorage.getItem("url-image")
          }
          this.navigation = true;
        }
      }, (error: HttpErrorResponse) => {
        if (error.error.isTrusted) {
          Swal.fire({
            title: 'Internal Server Error',
            text: "Sever is down. Try later",
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3500
          });
        } else {
          Swal.fire({
            title: 'Failed Login',
            text: error.error,
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3500
          });
        }
      });
    } else if (this.loginForm.value.userType == "employee") {
      console.log("employee");
      sessionStorage.setItem("role", "Employee");
      const employeeLoginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        option: this.loginForm.value.option
      }
      console.log(employeeLoginData);
      this.authServiceEmployee.login(employeeLoginData).subscribe((data: any) => {
        //console.log(data);
        if (data.status == 200) {
          sessionStorage.setItem("option", this.loginForm.value.option);
          this.response = data
          if (data.user) {
            sessionStorage.setItem("email", data.user);
          }
          if (this.loginForm.value.option == true) {
            sessionStorage.setItem("email", this.loginForm.value['email']);
            sessionStorage.setItem("auth-QrCode", "true");
            this.QrCode = true
            sessionStorage.setItem("url-image", this.response.secretImageUri)
            this.QrCodeUrl = sessionStorage.getItem("url-image")
          }
          this.navigation = true;
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        if (error.error.isTrusted) {
          Swal.fire({
            title: 'Internal Server Error',
            text: "Sever is down. Try later",
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3500
          });
        } else {
          Swal.fire({
            title: 'Failed Login',
            text: error.error,
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3500
          });
        }
      });
    }
  }

  onOtpChange(event: any) {
    this.otp = event;
    //console.log("Numéro tapé:", event);

    if (this.otp.length < this.configOptions.length) {
      this.inputDigitLeft = this.configOptions.length - this.otp.length + " digits Left";
    }

    if (this.otp.length == this.configOptions.length) {
      this.inputDigitLeft = "Let's go!";
      this.number = parseInt(this.otp);
      //console.log("Numéro complet:",this.number,"\n option:",sessionStorage.getItem("option"));
      // Configuration of keyVerifiation form
      if (sessionStorage.getItem("email") &&
        sessionStorage.getItem("option") == "false") {
        this.keyVerification = this.formBuilder.group({
          email: [sessionStorage.getItem("email")],
          key: [this.number, [Validators.required]],
        })
        //console.log(this.keyVerification.value);
        this.x = true
        if (sessionStorage.getItem("role") == "Manager") {
          this.authService.verifyKey(this.keyVerification.value).subscribe((data: any) => {
            //console.log(data);
            if (data.status == 200) {
              this.tokenStorage.signOut();
              this.tokenStorage.saveToken(data.accessToken);
              this.tokenStorage.saveUser(sessionStorage.getItem("email"));
              this.tokenStorage.saveManager(true);
              Swal.fire({
                title: 'Successful Login',
                text: 'Your Multi-Authentication By email has been successfully done',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3500
              });
              sessionStorage.clear();
              sessionStorage.setItem("role", "Manager");
              this.router.navigate(["dashboard"]);
            }
          }, (error: HttpErrorResponse) => {
            Swal.fire({
              title: 'Failed Login',
              text: "Wrong Key. Try login again",
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 3500
            });
            sessionStorage.clear();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.navigate(['']);
          })
        } else if (sessionStorage.getItem("role") == "Employee") {
          this.authServiceEmployee.verifyKey(this.keyVerification.value).subscribe((data: any) => {
            //console.log(data);
            if (data.status == 200) {
              this.tokenStorage.signOut();
              this.tokenStorage.saveToken(data.accessToken);
              this.tokenStorage.saveUser(sessionStorage.getItem("email"));
              this.tokenStorage.saveEmployee(true);
              Swal.fire({
                title: 'Successful Login',
                text: 'Your Multi-Authentication By email has been successfully done',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3500
              });
              sessionStorage.clear();
              sessionStorage.setItem("role", "Employee");
              this.router.navigate(["dashboard"]);
            }
          }, (error: HttpErrorResponse) => {
            Swal.fire({
              title: 'Failed Login',
              text: "Wrong Key. Try login again",
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 3500
            });
            sessionStorage.clear();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.navigate(['']);
          })
        }
      }
      // Configuration of qrCodeVerifiation form
      if (sessionStorage.getItem("auth-QrCode")) {
        this.qrCodeVerification = this.formBuilder.group({
          email: [sessionStorage.getItem("email")],
          code: [this.number, [Validators.required]],
        })
        //console.log(this.qrCodeVerification.value);
        this.x = true
        if (sessionStorage.getItem("role") == "Manager") {
          this.authService.verifyQrCode(this.qrCodeVerification.value).subscribe((data: any) => {
            this.tokenStorage.signOut();
            this.tokenStorage.saveToken(data.accessToken);
            this.tokenStorage.saveUser(sessionStorage.getItem("email"));
            this.tokenStorage.saveManager(true);
            //console.log(data);
            if (data.status == 200) {
              Swal.fire({
                title: 'Successful Login',
                text: 'Your Multi-Authentication By email has been successfully done',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3500
              });
              sessionStorage.clear();
              sessionStorage.setItem("role", "Manager");
              this.router.navigate(["dashboard"]);
            }
          }, (error: HttpErrorResponse) => {
            Swal.fire({
              title: 'Failed Login',
              text: "Wrong Key. Try login again",
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 3500
            });
            window.location.reload();
          })
        }
        else {
          this.authServiceEmployee.verifyQrCode(this.qrCodeVerification.value).subscribe((data: any) => {
            this.tokenStorage.signOut();
            this.tokenStorage.saveToken(data.accessToken);
            this.tokenStorage.saveUser(sessionStorage.getItem("email"));
            this.tokenStorage.saveEmployee(true);
            //console.log(data);
            if (data.status == 200) {
              Swal.fire({
                title: 'Successful Login',
                text: 'Your Multi-Authentication By email has been successfully done',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3500
              });
              sessionStorage.clear();
              sessionStorage.setItem("role", "Employee");
              this.router.navigate(["dashboard"]);
            }
          }, (error: HttpErrorResponse) => {
            Swal.fire({
              title: 'Failed Login',
              text: "Wrong Key. Try login again",
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 3500
            });
            window.location.reload();
          })
        }
      }
    }
  }

  onOtpChangeKey(event: any) {
    this.otp = event;
    //console.log("Numéro tapé:", event);

    if (this.otp.length < this.configOptions.length) {
      this.inputDigitLeft = this.configOptions.length - this.otp.length + " digits Left";
    }

    if (this.otp.length == this.configOptions.length) {
      this.inputDigitLeft = "Let's go!";
      this.number = parseInt(this.otp);

      this.keyPhoneVerification = this.formBuilder.group({
        key: [this.number],
        phoneNumber: [sessionStorage.getItem("phone")],
      })
      //console.log(this.keyVerification.value);
      this.x = true
      if (sessionStorage.getItem("employee") == "true") {
        this.employeePasswordRecover.keyPhoneRecovery(this.keyPhoneVerification.value).subscribe((data: any) => {
          //console.log(data);
          if (data.status == 200) {
            this.router.navigate(["/recovery-password"])
          } else if (data.status == 401) {
            Swal.fire({
              title: 'Failed Verification',
              text: "Wrong Key. Try verify again",
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 3500
            });
            sessionStorage.clear();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.navigate(['']);
          }
        })
      } else if (sessionStorage.getItem("manager") == "true") {
        this.passwordRecover.keyPhoneRecovery(this.keyPhoneVerification.value).subscribe((data: any) => {
          //console.log(data);
          if (data.status == 200) {
            this.router.navigate(["/recovery-password"])
          } else if (data.status == 401) {
            Swal.fire({
              title: 'Failed Verification',
              text: "Wrong Key. Try verify again",
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 3500
            });
            sessionStorage.clear();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.navigate(['']);
          }
        })
      }

    }
  }

  showForgotPasswordDialog() {
    this.recoveryDialog = true;
  }

  hideForgotPasswordDialog() {
    this.recoveryDialog = false;
  }

  saveStep() {
    this.goCondition = true;
    if (this.passwordForgotton.value.userType == "employee") {
      sessionStorage.clear();
      sessionStorage.setItem("employee", "true")
    } else {
      sessionStorage.clear();
      sessionStorage.setItem("manager", "true")
    }
  }

  choose() {
    this.access = true;
    if (this.recoveryFormOptions.value.userType == "email") {
      console.log(this.recoveryFormOptions.value.userType);
      this.option = "email";
    } else {
      console.log(this.recoveryFormOptions.value.userType);
      this.option = "phone";
    }
  }

  stepEmail() {
    console.log(this.recoveryEmailForm.value);
    if (sessionStorage.getItem("employee") == "true") {
      this.employeePasswordRecover.emailRecovery(this.recoveryEmailForm.value).subscribe((data) => {
        console.log(data);
        if (data[0] == "Email has been sent") {
          this.router.navigate(["/recovery-password"])
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        Swal.fire({
          title: 'Failed Verification',
          text: "Wrong Email. Try verify again",
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 3500
        });
        sessionStorage.clear();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate(['']);
      })
    } else {
      this.passwordRecover.emailRecovery(this.recoveryEmailForm.value).subscribe((data) => {
        console.log(data);
        if (data[0] == "Email has been sent") {
          this.router.navigate(["/recovery-password"])
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        Swal.fire({
          title: 'Failed Verification',
          text: "Wrong Email. Try verify again",
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 3500
        });
        sessionStorage.clear();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate(['']);
      })
    }
  }

  stepPhone() {
    console.log(this.recoveryPhoneForm.value);
    if (sessionStorage.getItem("employee") == "true") {
      this.employeePasswordRecover.phoneRecovery(this.recoveryPhoneForm.value).subscribe((data) => {
        console.log(data);
        if (data[0] == "Sms has been sent") {
          this.access = true
          this.option = "phone";
          this.key = true;
          sessionStorage.setItem("phone", this.recoveryPhoneForm.value.phoneNumber)
          console.log(sessionStorage.getItem("phone"));

          //this.router.navigate(["/recovery-password"])
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        Swal.fire({
          title: 'Failed Verification',
          text: "Wrong phone number. Try verify again",
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 4500
        });
        sessionStorage.clear();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate(['']);
      })
    } else {
      this.passwordRecover.phoneRecovery(this.recoveryPhoneForm.value).subscribe((data) => {
        console.log(data);
        if (data[0] == "Sms has been sent") {
          this.access = true
          this.option = "phone";
          this.key = true;
          sessionStorage.setItem("phone", this.recoveryPhoneForm.value.phoneNumber)
          console.log(sessionStorage.getItem("phone"));
          //this.router.navigate(["/recovery-password"])
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        Swal.fire({
          title: 'Failed Verification',
          text: "Wrong phone number. Try verify again",
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 4500
        });
        sessionStorage.clear();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate(['']);
      })
    }
  }

  validateToken() {
    if (this.token_auth) {
      if (localStorage.getItem("manager") && !localStorage.getItem("employee")) {
        this.tokenStorage.validateTokenManager(this.token_auth).subscribe((isValid) => {
          if (!isValid) {
            //token is invalid
            //console.log('Token validité:', isExpired);
            sessionStorage.setItem("IsLoggedIn", "false");
          }
          else {
            //token is valid
            //console.log('false');
            sessionStorage.setItem("IsLoggedIn", "true");
            //window.location.reload();
          }
        },
          error => {
            // Gérer les erreurs
            //console.log('Erreur lors de la validation du token:', error);
            sessionStorage.setItem("IsLoggedIn", "false");
          }
        );
      }
    }
  }

  newDialog() {
    this.dialogState = true;
  }

  hideDialog() {
    this.dialogState = false;
  }

  save() {
    //console.log(this.redirection.value);
    this.dialogState = false;
    if (this.redirection.value.userType == "manager") {
      this.router.navigate(['register/manager/manager-personal'])
    } else if (this.redirection.value.userType == "employee") {
      this.router.navigate(['register/personal'])
    }
  }
}
