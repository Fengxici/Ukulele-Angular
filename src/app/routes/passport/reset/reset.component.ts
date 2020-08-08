import { OnInit, OnDestroy, Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'passport-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.less'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  kaptcha: any = null;
  constructor(fb: FormBuilder, private router: Router, public http: _HttpClient, public msg: NzMessageService) {
    this.form = fb.group({
      password: [null, [Validators.required, Validators.minLength(6), ResetPasswordComponent.checkPassword.bind(this)]],
      confirm: [null, [Validators.required, Validators.minLength(6), ResetPasswordComponent.passwordEquar]],
      captcha: [null, [Validators.required]],
    });
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirm() {
    return this.form.controls.confirm;
  }
  form: FormGroup;
  error = '';
  type = 0;
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception',
  };
  count = 0;
  interval$: any;

  static checkPassword(control: FormControl) {
    if (!control) return null;
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = 'ok';
    } else if (control.value && control.value.length > 5) {
      self.status = 'pass';
    } else {
      self.status = 'pool';
    }

    if (self.visible) {
      self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  static passwordEquar(control: FormControl) {
    if (!control || !control.parent) {
      return null;
    }
    // tslint:disable-next-line: no-non-null-assertion
    if (control.value !== control.parent.get('password')!.value) {
      return { equar: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.getKaptch();
  }

  getKaptch() {
    this.kaptcha = Api.KaptchaApi + '&time=' + (new Date().getMilliseconds());
  }

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
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
    this.http.post(Api.ResetPassordApi, data).subscribe((res) => {
      if (res) {
        if (res.code === ResponseCode.SUCCESS) {
          this.router.navigate(['/passport/login'],
            {queryParams: {email: data.email }});
        } else {
          this.error = res.data;
        }
      } else {
        this.error = 'c重置失败，未知原因！';
      }
    });
  }
}
