import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFSelectWidgetSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-store-user-edit',
  templateUrl: './user-edit.component.html',
})
export class StoreUserEditComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  record: any;
  searchSchema: SFSchema = {
    properties: {
      param: {
        type: 'string',
        title: '用户名或手机号'
      }
    },
  };

  schema: SFSchema = {
    properties: {
      account: {type: 'string', title: '用户名'},
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
      },
      maxSize: {type: 'string', title: '最大上传大小', default: '1MB'},
      maxRate: {type: 'string', title: '最大下载速度', default: '-1'},
    },
    required: ['account', 'authList'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    },
  };

  ngOnInit(): void {
    if (this.record) {
      this.record.authList = [];
      for (const ch of this.record.auth) {
        this.record.authList.push(ch);
      }
    }
  }

  query(event: any) {
    if (!(event && event.param)) {
    this.msgSrv.warning('请先输入查询条件！');
    return;
    }
    this.http
      .get(Api.BaseUserApi + 'param/' +  event.param)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) {
            this.record = res.data;
            this.record.account = res.data.username;
            this.record.userId = res.data.id;
          }
        }
      });
  }

join(record: any) {
    console.log(record);
    const params = {
      userId: record.userId,
      account: record.account,
      maxSize: record.maxSize,
      maxRate: record.maxRate,
      auth: ''
    };
    if (!record.authList) {
      this.msgSrv.warning('必须至少选择一个权限！');
      return;
    }
    for (const item of record.authList) {
      params.auth += item;
    }
    this.http.post(Api.BaseStoreUserApi + 'add', params).subscribe((res: any) => {
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

close() {
    this.modal.destroy();
  }
}
