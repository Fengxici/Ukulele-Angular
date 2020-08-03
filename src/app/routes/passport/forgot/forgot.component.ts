import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';


@Component({
  selector: 'passport-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.less'],
})
export class ForgotComponent implements OnInit {
  kaptcha: any = null;
  constructor(fb: FormBuilder, private router: Router, public http: _HttpClient, public msg: NzMessageService) {
    this.form = fb.group({
      email: [null, [Validators.required, Validators.email]],
      captcha: [null, [Validators.required]],
    });
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  get email() {
    return this.form.controls.email;
  }
  form: FormGroup;
  error = '';

  count = 0;
  interval$: any;

  ngOnInit(): void {
    this.getKaptch();
  }

  getKaptch() {
    this.kaptcha = Api.KaptchaApi + '&time=' + (new Date().getMilliseconds());
  }


  submit(): void {
    this.error = '';
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    this.http.post(Api.ForgotPasswordApi, data).subscribe((res) => {
      if (res) {
        if (res.code === ResponseCode.SUCCESS) {
          this.router.navigate(['/passport/login'],
            {queryParams: {email: data.email }});
        } else {
          this.getKaptch();
          this.error = res.data;
        }
      } else {
        this.getKaptch();
        this.error = '找回失败，未知原因！';
      }
    });
  }
}
