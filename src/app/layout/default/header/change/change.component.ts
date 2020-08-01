import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-password-change',
  templateUrl: './change.component.html',
})
export class ChangePasswordComponent {
  record: any = {};
  schema: SFSchema = {
    properties: {
      oldPwd: { type: 'string', title: '原密码', maxLength: 15, minLength: 6 , ui: {type: 'password'}},
      newPwd: { type: 'string', title: '新密码', maxLength: 15, minLength: 6 , ui: {type: 'password'}},
      confirm: { type: 'string', title: '确认密码', maxLength: 15, minLength: 6, ui: {type: 'password'} },
    },
    required: ['oldPwd', 'newPwd', 'confirm'],
  };

  constructor(
    private modal: NzModalRef,
    public settings: SettingsService,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  save(value: any) {
    console.log(value);
    if (value.newPwd !== value.confirm) {
      this.msgSrv.warning('新密码与确认密码不一致');
      return;
    }
    const id = this.settings.user.id;
    this.http.put(Api.BaseUserApi + 'password/change/' + id, null, value).subscribe((res: any) => {
      if (res) {
        if (res.code === ResponseCode.SUCCESS) {
          this.msgSrv.success('成功');
          this.modal.close(true);
        } else {
          this.msgSrv.warning(res.data);
        }
      } else {
        this.msgSrv.error('失败，未知错误');
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
