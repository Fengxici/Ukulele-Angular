import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'passport-register-result',
  templateUrl: './register-result.component.html',
})
export class UserRegisterResultComponent {
  params = { email: '' };
  email = '';
  constructor(route: ActivatedRoute, public msg: NzMessageService) {
    route.queryParams.subscribe((res) => {
      this.params.email = this.email = res.email || '参数传递错误';
    });
  }
}
