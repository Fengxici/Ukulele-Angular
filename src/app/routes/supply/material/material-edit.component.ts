import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { SFSchema, SFUISchema, SFNumberWidgetSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-supply-material-edit',
  templateUrl: './material-edit.component.html',
})
export class MaterialEditComponent {
  record: any = {};
  supplyList: any = [];
  i: any;
  schema: SFSchema = {
    properties: {
      materialNo: { type: 'string', title: '物料编号', maxLength: 15 },
      name: { type: 'string', title: '物料名称' },
      format: { type: 'string', title: '规格' },
      unit: { type: 'string', title: '单位' },
      price: {  type: 'number', title: '单价', ui: { prefix: '￥' } as SFNumberWidgetSchema },
      provider: {
        type: 'string',
        title: '供应商',
        default: '-1',
        ui: {
          widget: 'select',
          asyncData: () => this.queryProviderList() ,
        } ,
      },
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
    public settings: SettingsService,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  save(value: any) {
    console.log(value);
    if (this.record.id) {
      this.http.put(Api.BaseSupplyMaterialApi, value).subscribe((res: any) => {
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
      const firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settings.user.id));
      value.firmId = firmInfo.id;
      this.http.post(Api.BaseSupplyMaterialApi, value).subscribe((res: any) => {
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

  queryProviderList() {
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settings.user.id));
    if (!firmInfo) {
      return;
    }
    const params = {firmId: firmInfo.id};
    const providerObservalbe =  this.http
    .get(Api.BaseSupplySupplierApi + '/list', params).pipe(
      catchError(() => {
        return [{ label: '无', value: '0' }];
      }),
      map(res => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) {
            const data = [{ label: '无', value: '0' }];
            res.data.forEach(element => {
              const item = {value: element.supplierId, label: element.name};
              data.push(item);
            });
            return data;
          }
        }
        return [{ label: '无', value: '0' }];
      })
    );
    return providerObservalbe;
  }

  close() {
    this.modal.destroy();
  }
}
