import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'passport-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class UserRegisterComponent implements OnInit, OnDestroy {
  kaptcha: any = null;
  constructor(fb: FormBuilder, private router: Router, public http: _HttpClient, public msg: NzMessageService) {
    this.form = fb.group({
      username: [null, [Validators.required, Validators.pattern(/^[a-zA-Z]\w{5,15}$/)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6),
                UserRegisterComponent.checkPassword.bind(this)]],
      confirm: [null, [Validators.required, Validators.minLength(6),
                UserRegisterComponent.passwordEquar]],
      mobilePrefix: ['+86'],
      phone: [null, [Validators.required,
        // tslint:disable-next-line: max-line-length
        Validators.pattern(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/)]],
      captcha: [null, [Validators.required]],
    });
  }

  // #region fields
  get username() {
    return this.form.controls.username;
  }
  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirm() {
    return this.form.controls.confirm;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
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
    long: 'long',
  };
  // #endregion

  // #region get captcha

  count = 0;
  interval$: any;

  static checkPassword(control: FormControl) {
    if (!control || !control.value) return null;
    const self: any = this;
    self.visible = !!control.value;
    // 最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符"
    const strongPaswordRegx = /^\S*(?=\S{10,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/g;
    const passPaswordRegx = /^[a-zA-Z0-9]{6,16}$/;
    if (control.value && strongPaswordRegx.test(control.value)) {
      self.status = 'ok';
    } else if (control.value && (control.value.length > 10 || passPaswordRegx.test(control.value))) {
      self.status = 'pass';
    } else if (control.value && control.value.length > 16) {
      self.status = 'long';
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

  getCaptcha() {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  // #endregion

  submit() {
    this.error = '';
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;
    this.http.post(Api.RegistApi, data).subscribe((res) => {
      if (res) {
        if (res.code === ResponseCode.SUCCESS) {
          // this.router.navigateByUrl('/passport/register-result', {
          //   queryParams: { email: data.email },
          // });
          this.router.navigate(['/passport/register-result'],
            {queryParams: {email: data.email }});
        } else {
          // this.msg.error(res.data);
          this.getKaptch();
          this.error = res.data;
        }
      } else {
        // this.msg.error('注册失败，未知原因！');
        this.getKaptch();
        this.error = '注册失败，未知原因！';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
