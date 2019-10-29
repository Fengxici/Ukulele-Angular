import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ResponseCode } from '@shared/response.code';
import { RoleEditComponent } from './role-edit.component';
import { Api } from '@shared/api';
import { RoleMenuComponent } from './role-menu.component';
import { ActivatedRoute } from '@angular/router';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { AbilityService } from '@shared/service/ability.service';

@Component({
  selector: 'app-system-role',
  templateUrl: './role.component.html',
})
export class SystemRoleComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  params: any = {};
  page: any = {
    records: [],
    current: 1,
    total: 0,
    size: 10,
  };
  pagination: STPage = {
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    total: true,
    showSize: true,
    showQuickJumper: true,
  };
  searchSchema: SFSchema = {
    properties: {
      roleName: {
        type: 'string',
        title: '角色名称',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      roleCode: {
        type: 'string',
        title: '角色代码',
        ui: {
          acl: { ability: ['query'] },
        },
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '角色名称', index: 'roleName' },
    { title: '角色代码', index: 'roleCode' },
    { title: '描述', index: 'roleDesc' },
    {
      title: '操作',
      buttons: [
        {
          text: '菜单',
          icon: 'profile',
          type: 'modal',
          modal: {
            component: RoleMenuComponent,
          },
          click: () => {
            this.query(null);
          },
          acl: { ability: ['add'] },
        },
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: RoleEditComponent,
          },
          click: () => {
            this.query(null);
          },
          acl: { ability: ['edit'] },
        },
        {
          text: '删除',
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

  change(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.params.size = e.ps;
      this.params.current = e.pi;
      this.query(null);
    }
  }

  query(event: any) {
    const current: number = this.params.current || 1;
    const size: number = this.params.size || 10;
    this.params = {};
    if (event) {
      if (event.roleName) this.params.roleName = event.roleName;
      if (event.roleCode) this.params.roleCode = event.roleCode;
    }
    this.http
      .get(Api.BaseRoleApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  add() {
    this.modal
      .createStatic(RoleEditComponent)
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
        this.http.delete(Api.BaseRoleApi + record.id).subscribe((res: any) => {
          if (res) {
            if (res.code === ResponseCode.SUCCESS) {
              this.st.reload();
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
