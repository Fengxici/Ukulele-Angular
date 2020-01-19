import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFSelectWidgetSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
@Component({
  selector: 'app-supply-join-access',
  templateUrl: './apply-access.component.html',
})
export class EmployeeApplyHandleComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}
  record: any = {};
  params: any = {};
  schema: SFSchema = {
    properties: {
      username: { type: 'string', title: '用户名', maxLength: 15, readOnly: true },
      phone: { type: 'string', title: '电话', readOnly: true },
      admin: { type: 'boolean', title: '管理员' },
      userTag: {
        type: 'string',
        title: '角色',
        enum: [
          { label: '采购', value: 'PURCHASE' },
          { label: '销售', value: 'MARKET' },
          { label: '计划', value: 'PLAN' },
          { label: '仓库', value: 'DEPOSITORY' },
          { label: '质检', value: 'QUALITY' },
          { label: '财务', value: 'FINANCE' }
        ],
        ui: {
          widget: 'select',
          mode: 'tags',
        } as SFSelectWidgetSchema,
        default: null,
      },
    },
    required: ['username', 'phone', 'userTag'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabel: 10,
      spanControl: 14,
      grid: { span: 12 },
    },
  };
  searchSchema: SFSchema = {
    properties: {
      param: {
        type: 'string',
        title: '用户名或手机号'
      }
    },
  };
  ngOnInit(): void {
    if (this.record) {
      this.record.userTag = this.record.userTagList;
    }
  }
  reset() {
    this.params = {};
  }

  join(record: any) {
    console.log(record);
    if (!record.userTag || record.userTag.length === 0) {
      this.msgSrv.warning('必须选择至少一个角色');
      return;
    }
    const params = {
      userId: record.id || record.userId,
      firmId: record.firmId,
      admin: record.admin,
      userTag: record.userTag
    };
    this.http.post(Api.BaseSupplyUserAccessApi, null, params).subscribe((res: any) => {
      if (res) {
        if (res.code === ResponseCode.SUCCESS) {
          this.msgSrv.success('加入成功');
          this.modal.close(true);
        } else {
          this.msgSrv.warning(res.message);
        }
      } else {
        this.msgSrv.error('加入失败，未知错误');
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}