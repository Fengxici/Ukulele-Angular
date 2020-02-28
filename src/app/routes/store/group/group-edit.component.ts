import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFSelectWidgetSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-store-group-edit',
  templateUrl: './group-edit.component.html',
})
export class GroupEditComponent implements OnInit{
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称'
      },
      authList: {
        type: 'string',
        title: '权限',
        enum: [
          { label: '创建文件夹', value: 'c' },
          { label: '上传文件', value: 'u' },
          { label: '删除文件或文件夹', value: 'd' },
          { label: '重命名文件或编辑文件夹', value: 'r' },
          { label: '下载文件', value: 'l' },
          { label: '移动文件或文件夹', value: 'm' },
        ],
        default: ['l'],
        ui: {
          widget: 'select',
          mode: 'multiple',
        } as SFSelectWidgetSchema,
      }
    },
    required: ['name', 'authList'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    if (this.record && this.record.auth) {
      this.record.authList = [];
      for (const ch of this.record.auth) {
        this.record.authList.push(ch);
      }
    }
  }

  save(value: any) {
    console.log(value);
    value.auth = '';
    for (const item of value.authList) {
      value.auth += item;
    }
    if (this.record.id) {
      this.http.put(Api.BaseStoreGroupApi + 'modify', value).subscribe((res: any) => {
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
      this.http.post(Api.BaseStoreGroupApi + 'add', value).subscribe((res: any) => {
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
