import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
import { MenuEditComponent } from './menu-edit.component';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';

@Component({
  selector: 'app-system-menu',
  templateUrl: './menu.component.html',
})
export class SystemMenuComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
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
        ui: {
          acl: { ability: ['query'] },
        },
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  @ViewChild('stItem', { static: true }) stItem: STComponent;
  @ViewChild('stItemChild', { static: true }) stItemChild: STComponent;
  stColumn: STColumn[] = [
    { title: '名称', index: 'text' },
    { title: '编码', index: 'key' },
    { title: 'i18n', index: 'i18n' },
    {
      title: '',
      buttons: [
        {
          text: '新增菜单组',
          icon: 'profile',
          type: 'modal',
          click: (record: any) => {
            this.add(record.id);
          },
          acl: { ability: ['add'] },
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
          acl: { ability: ['edit'] },
        },
        {
          text: '',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          },
          acl: { ability: ['delete'] },
        },
      ],
    },
  ];
  stItemColumns: STColumn[] = [
    { title: '名称', index: 'text' },
    { title: '编码', index: 'key' },
    { title: 'i18n', index: 'i18n' },
    { title: '地址', index: 'link' },
    { title: '外链', index: 'linkExact', type: 'yn' },
    { title: '外部连接', index: 'externalLink' },
    { title: '打开方式', index: 'target' },
    { title: '图标', index: 'icon.value' },
    { title: '是否注销', index: 'disabled', type: 'yn' },
    { title: '是否隐藏', index: 'hide', type: 'yn' },
    { title: '面包屑中是否隐藏', index: 'hideInBreadcrumb', type: 'yn' },
    { title: 'acl', index: 'acl' },
    { title: '快捷方式', index: 'shortcut', type: 'yn' },
    { title: '根快捷方式', index: 'shortcutRoot', type: 'yn' },
    { title: '重用', index: 'reuse', type: 'yn' },
    { title: '打开', index: 'open', type: 'yn' },
    {
      title: '',
      buttons: [
        {
          text: '新增子菜单',
          icon: 'profile',
          type: 'modal',
          click: (record: any) => {
            this.add(record.id);
          },
          acl: { ability: ['add'] },
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
          acl: { ability: ['edit'] },
        },
        {
          text: '',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          },
          acl: { ability: ['delete'] },
        },
      ],
    },
  ];
  columns: STColumn[] = [
    { title: '名称', index: 'text' },
    { title: '编码', index: 'key' },
    { title: 'i18n', index: 'i18n' },
    { title: '组', index: 'group', type: 'yn' },
    { title: '地址', index: 'link' },
    { title: '外链', index: 'linkExact', type: 'yn' },
    { title: '外部连接', index: 'externalLink' },
    { title: '打开方式', index: 'target' },
    { title: '图标', index: 'icon' },
    { title: '是否注销', index: 'disabled', type: 'yn' },
    { title: '是否隐藏', index: 'hide', type: 'yn' },
    { title: '面包屑中是否隐藏', index: 'hideInBreadcrumb', type: 'yn' },
    { title: 'acl', index: 'acl' },
    { title: '快捷方式', index: 'shortcut', type: 'yn' },
    { title: '根快捷方式', index: 'shortcutRoot', type: 'yn' },
    { title: '重用', index: 'reuse', type: 'yn' },
    { title: '打开', index: 'open', type: 'yn' },
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
          acl: { ability: ['edit'] },
        },
        {
          text: '',
          icon: 'delete',
          click: (record: any) => {
            this.delete(record);
          },
          acl: { ability: ['delete'] },
        },
      ],
    },
  ];

  constructor(
    protected http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {
    super(route, ability);
  }

  ngOnInit() {
    super.initAbilities();
    this.query(null);
  }
  ngOnDestroy(): void {
    super.clearAbilities();
  }

  query(event: any) {
    this.params = {};
    if (event) {
      if (event.text) this.params.text = event.text;
    }
    this.http
      .get(Api.BaseAntMenuApi + 'tree', this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.record = res.data;
        }
      });
  }

  add(parentId: any) {
    this.modal
      .createStatic(MenuEditComponent, parentId)
      .subscribe(() => this.query(null));
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
                this.query(null);
                this.msg.success('删除成功');
              } else {
                this.msg.warning(res.message);
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
