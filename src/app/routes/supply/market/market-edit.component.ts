import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-supply-market-edit',
  templateUrl: './market-edit.component.html',
})
export class MarketEditComponent {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      orderNo: { type: 'string', title: '订单编号', maxLength: 15 },
      status: { type: 'string', title: '状态' },
      financeStatus: { type: 'string', title: '财务状态' },
      settleType: { type: 'string', title: '结算方式' },
      provider: { type: 'string', title: '供应方' },
      consumer: { type: 'string', title: '需求方' }
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

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  save(value: any) {
    console.log(value);
    if (this.record.id) {
      this.http.put(Api.BaseSupplyMarketApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('修改成功');
            this.modal.close(true);
          } else {
            this.msgSrv.warning(res.message);
          }
        } else {
          this.msgSrv.error('修改失败，未知错误');
        }
      });
    } else {
      this.http.post(Api.BaseSupplyMarketApi, value).subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('保存成功');
            this.modal.close(true);
          } else {
            this.msgSrv.warning(res.message);
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
