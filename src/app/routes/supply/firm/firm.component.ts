import { Component, OnInit, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';

@Component({
  selector: 'app-supply-firm',
  templateUrl: './firm.component.html',
})
export class FirmComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private msgSrv: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {
    super(route, ability);
  }
  record: any = {};
  editable = false;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 15 },
      description: { type: 'string', title: '描述' },
    },
    required: ['name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    },
  };

  ngOnInit() {
    super.initAbilities();
    this.query();
  }

  ngOnDestroy(): void {
    super.clearAbilities();
  }

  save(value: any) {
    console.log(value);
    if (this.record.id) {
      this.http.put(Api.BaseSupplyFirmApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('修改成功');
          } else {
            this.msgSrv.warning(res.msg);
          }
        } else {
          this.msgSrv.error('修改失败，未知错误');
        }
      });
    } else {
      this.http.post(Api.BaseSupplyFirmApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('保存成功');
          } else {
            this.msgSrv.warning(res.msg);
          }
        } else {
          this.msgSrv.error('保存失败，未知错误');
        }
      });
    }
  }

  query() {
    this.http
      .get(Api.BaseSupplyFirmApi + '1')
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.record = res.data;
        }
      });
  }
}
