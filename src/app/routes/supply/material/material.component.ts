import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MaterialEditComponent } from './material-edit.component';
import { Api } from '@shared/api';
import { BaseAbilityComponent } from '@shared/base.ability.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AbilityService } from '@shared/service/ability.service';
import { FirmDrawerComponent } from '../common/firm-drawer.component';

@Component({
  selector: 'app-supply-material',
  templateUrl: './material.component.html',
})
export class MaterialComponent extends BaseAbilityComponent
  implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    private router: Router,
    private modal: ModalHelper,
    public settings: SettingsService,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {
    super(route, ability);
  }
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
      materialNo: {
        type: 'string',
        title: '物料编号',
        ui: {
          acl: { ability: ['query'] },
        },
      },
      name: {
        type: 'string',
        title: '名称',
        ui: {
          acl: { ability: ['query'] },
        },
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  @ViewChild('drawer', {static: true }) firmDraw: FirmDrawerComponent;
  columns: STColumn[] = [
    { title: '物料编号', index: 'materialNo' },
    { title: '物料名称',  index: 'name' },
    { title: '规格', index: 'format' },
    { title: '单位', index: 'unit' },
    { title: '含税单价', index: 'price', type: 'currency' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: MaterialEditComponent,
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

  ngOnInit() {
    super.initAbilities();
    // this.query(null);
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
    const firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settings.user.id));
    if (!firmInfo) {
      this.router.navigate(['/supply/firm']);
      return;
    }
    this.params.firmId = firmInfo.id;
    if (event) {
      if (event.name) this.params.name = event.name;
      if (event.materialNo) this.params.materialNo = event.materialNo;
    }
    this.http
      .get(Api.BaseSupplyMaterialApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  add() {
    this.modal
      .createStatic(MaterialEditComponent)
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
          .delete(Api.BaseSupplyMaterialApi + record.id)
          .subscribe((res: any) => {
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
