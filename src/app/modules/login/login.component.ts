import { Component } from '@angular/core';
import { SeoService } from '../../services/seo/seo.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginform:FormGroup;
  showloader: boolean = false;
  constructor(private seoService: SeoService,private authService: AuthService, private fb : FormBuilder, private router: Router,private activatedRoute: ActivatedRoute) {
    
    const content = 'Login content with meta';
    this.seoService.setMetaDescription(content);
    this.loginform = this.fb.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
  }
  paramRole:any;
  loginAs:any;
  ngOnInit() {    
    if(this.authService.getToken()){
      this.router.navigate(["/gail"]);
    }
    let doc = document.getElementsByTagName("body")[0];
    if(doc){    
        doc.classList.add("body-background");
    }
  }
  get lf() {
    return this.loginform.controls;
  }
  onSubmit(data:any) {
    if(this.loginform.invalid) {
      return;
    }
    this.showloader = true;
    this.authService.login({username:data.email, password: data.password ,role: "ADMIN"}).subscribe({
      error: (e)=>{
       this.loginform.controls['email'].setErrors({error:true, message: e.error.message})
      },
      next: (v) => {
        if(v.code == 200) {
          let urlFragment = "/gail/home";        
          let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : urlFragment;
          this.router.navigate([redirect]);
        } else {
          console.log(v);
        }
      },
      complete: () => {
        this.showloader = false;
      }
    });
  }

}
