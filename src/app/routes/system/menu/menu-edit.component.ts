import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'app-system-menu-edit',
  templateUrl: './menu-edit.component.html',
})
export class MenuEditComponent implements OnInit {
  record: any = {};
  parentId: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      key: { type: 'string', title: '编码' },
      i18n: { type: 'string', title: 'i18n主键' },
      group: { type: 'boolean', title: '是否显示分组名' },
      link: { type: 'string', title: '地址' },
      linkExact: { type: 'boolean', title: '外链' },
      externalLink: { type: 'string', title: '外部连接' },
      target: {
        type: 'string',
        title: '打开方式',
        enum: [
          { label: '_blank', value: '_blank' },
          { label: '_self', value: '_self' },
          { label: '_parent', value: '_parent' },
          { label: '_top', value: '_top' },
        ],
      },
      icon: { type: 'string', title: '图标' },
      disabled: { type: 'boolean', title: '是否注销' },
      hide: { type: 'boolean', title: '是否隐藏' },
      hideInBreadcrumb: { type: 'boolean', title: '面包屑中是否隐藏' },
      acl: { type: 'string', title: 'acl' },
      shortcut: { type: 'boolean', title: '快捷方式' },
      shortcutRoot: { type: 'boolean', title: '根快捷方式' },
      reuse: { type: 'boolean', title: '重用' },
      open: { type: 'boolean', title: '打开' },
    },
    required: ['name', 'key'],
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
    this.parentId = this.modal.getInstance().nzComponentParams;
  }

  ngOnInit() {
    // 表单属性中不能使用text关键字
    this.record.name = this.record.text;
  }

  save(value: any) {
    value.text = value.name;
    if (this.record.id) {
      this.http.put(Api.BaseAntMenuApi, value).subscribe((res: any) => {
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
      value.parentId = this.parentId;
      this.http.post(Api.BaseAntMenuApi, value).subscribe((res: any) => {
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
