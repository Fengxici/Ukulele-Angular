import { Component } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'app-system-dict-edit',
  templateUrl: './dict-edit.component.html',
})
export class DictEditComponent {
  record: any = {};
  indexId: any;
  schema: SFSchema = {
    properties: {
      label: {
        type: 'string',
        title: '字典名称',
      },
      value: { type: 'string', title: '字典值', maxLength: 15 },
      sort: {
        type: 'string',
        title: '排序',
      },
    },
    required: ['label', 'value'],
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
  ) {
    this.indexId = this.modal.getInstance().nzComponentParams;
  }

  save(value: any) {
    console.log(value);
    if (this.record.id) {
      this.http.put(Api.BaseDictApi, value).subscribe((res: any) => {
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
      value.indexId = this.indexId;
      this.http.post(Api.BaseDictApi, value).subscribe((res: any) => {
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
