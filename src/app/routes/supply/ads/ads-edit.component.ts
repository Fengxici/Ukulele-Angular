import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFDateWidgetSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-supply-ads-edit',
  templateUrl: './ads-edit.component.html',
})
export class AdsEditComponent {
  record: any = {};
  // i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 15 },
      image: { type: 'string', title: '图片' },
      url: { type: 'string', title: '详情' },
      startDate: { type: 'string', ui: { widget: 'date', showTime: true } as SFDateWidgetSchema, title: '开始时间' },
      endDate: { type: 'string', ui: { widget: 'date', showTime: true } as SFDateWidgetSchema, title: '结束时间' }
    },
    required: ['name', 'image', 'startDate', 'endDate'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  save(value: any) {
    console.log(value);
    if (this.record.id) {
      this.http.put(Api.BaseSupplyAdsApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('修改成功');
            this.modal.close(true);
          } else {
            this.msgSrv.warning(res.msg);
          }
        } else {
          this.msgSrv.error('修改失败，未知错误');
        }
      });
    } else {
      this.http.post(Api.BaseSupplyAdsApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('保存成功');
            this.modal.close(true);
          } else {
            this.msgSrv.warning(res.msg);
          }
        } else {
          this.msgSrv.error('保存失败，未知错误');
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
