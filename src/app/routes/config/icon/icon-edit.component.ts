import { Component } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-config-icon-edit',
  templateUrl: './icon-edit.component.html',
})
export class IconEditComponent {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      type: {
        type: 'string',
        title: '类型',
        enum: [
          { label: 'class', value: 'class' },
          { label: 'icon', value: 'icon' },
          { label: 'img', value: 'img' },
        ],
      },
      value: { type: 'string', title: '值', maxLength: 15 },
      theme: {
        type: 'string',
        title: '主题',
        enum: [
          { label: 'outline', value: 'outline' },
          { label: 'twotone', value: 'twotone' },
          { label: 'fill', value: 'fill' },
        ],
      },
      spin: { type: 'boolean', title: '是否有旋转动画' },
      twoToneColor: { type: 'string', title: '双色图标的主要颜色' },
      iconfont: { type: 'string', title: 'IconFont的图标类' },
    },
    required: ['type', 'value', 'theme'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    },
    $type: {
      widget: 'select',
    },
    $theme: {
      widget: 'select',
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
      this.http.put(Api.BaseAntIconApi, value).subscribe((res: any) => {
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
      this.http.post(Api.BaseAntIconApi, value).subscribe((res: any) => {
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
