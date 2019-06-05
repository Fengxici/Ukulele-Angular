import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
import { MenuEditComponent } from './menu-edit.component';
import { IconComponent } from 'app/routes/config/icon/icon.component';

@Component({
  selector: 'app-system-menu',
  templateUrl: './menu.component.html',
})
export class SystemMenuComponent implements OnInit {
  params: any = {};
  record: any = [];
  pagination: STPage = {
    show: false,
  };
  searchSchema: SFSchema = {
    properties: {
      text: {
        type: 'string',
        title: '名称',
      },
    },
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('stItem') stItem: STComponent;
  @ViewChild('stItemChild') stItemChild: STComponent;
  stColumn: STColumn[] = [
    { title: '名称', index: 'text' },
    { title: '编码', index: 'key' },
    { title: 'i18n', index: 'i18n' },
    {
      title: '',
      buttons: [
        {
          text: '新增子菜单',
          icon: 'profile',
          type: 'modal',
          click: (record: any) => {
            this.add();
          },
        },
        {
          text: '',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: MenuEditComponent,
          },
          click: () => {
            this.query(null);
          },
        },
        {
          text: '',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          },
        },
      ],
    },
  ];
  stItemColumns: STColumn[] = [
    { title: '名称', index: 'text' },
    { title: '编码', index: 'key' },
    { title: 'i18n', index: 'i18n' },
    { title: '地址', index: 'link' },
    { title: '外链', index: 'linkExact' },
    { title: '外部连接', index: 'externalLink' },
    { title: '打开方式', index: 'target' },
    { title: '图标', index: 'icon.value' },
    { title: '是否注销', index: 'disabled' },
    { title: '是否隐藏', index: 'hide' },
    { title: '面包屑中是否隐藏', index: 'hideInBreadcrumb' },
    { title: 'acl', index: 'acl' },
    { title: '快捷方式', index: 'shortcut' },
    { title: '根快捷方式', index: 'shortcutRoot' },
    { title: '重用', index: 'reuse' },
    { title: '打开', index: 'open' },
    {
      title: '',
      buttons: [
        {
          text: '新增子菜单',
          icon: 'profile',
          type: 'modal',
          click: (record: any) => {
            this.add();
          },
        },
        {
          text: '',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: MenuEditComponent,
          },
          click: () => {
            this.query(null);
          },
        },
        {
          text: '',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          },
        },
      ],
    },
  ];
  columns: STColumn[] = [
    { title: '名称', index: 'text' },
    { title: '编码', index: 'key' },
    { title: 'i18n', index: 'i18n' },
    { title: '组', index: 'group' },
    { title: '地址', index: 'link' },
    { title: '外链', index: 'linkExact' },
    { title: '外部连接', index: 'externalLink' },
    { title: '打开方式', index: 'target' },
    { title: '图标', index: 'icon' },
    { title: '是否注销', index: 'disabled' },
    { title: '是否隐藏', index: 'hide' },
    { title: '面包屑中是否隐藏', index: 'hideInBreadcrumb' },
    { title: 'acl', index: 'acl' },
    { title: '快捷方式', index: 'shortcut' },
    { title: '根快捷方式', index: 'shortcutRoot' },
    { title: '重用', index: 'reuse' },
    { title: '打开', index: 'open' },
    {
      title: '',
      buttons: [
        {
          text: '',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: MenuEditComponent,
          },
          click: () => {
            this.query(null);
          },
        },
        {
          text: '',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          },
        },
      ],
    },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
  ) {}

  ngOnInit() {
    this.query(null);
  }

  query(event: any) {
    this.params = {};
    if (event) {
      if (event.roleName) this.params.roleName = event.roleName;
      if (event.roleCode) this.params.roleCode = event.roleCode;
    }
    this.http
      .get(Api.BaseAntMenuApi + 'tree', this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.record = res.data;
        }
      });
  }

  add() {
    this.modal
      .createStatic(MenuEditComponent)
      .subscribe(() => this.st.reload());
  }

  delete(record: any) {
    console.log(record);
    this.modalService.confirm({
      nzTitle: '确定删除吗?',
      nzContent:
        '<b style="color: red;">如果您确定要删除请点击确定按钮，否则点取消</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () =>
        this.http
          .delete(Api.BaseAntMenuApi + record.id)
          .subscribe((res: any) => {
            if (res) {
              if (res.code === ResponseCode.SUCCESS) {
                this.st.reload();
                this.msg.success('删除成功');
              } else {
                this.msg.warning(res.msg);
              }
            } else {
              this.msg.error('删除失败，未知错误');
            }
          }),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
