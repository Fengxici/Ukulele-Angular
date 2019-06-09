import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { Api } from '@shared/api';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ResponseCode } from '@shared/response.code';
import { DeptEditComponent } from './dept-edit.component';

@Component({
  selector: 'app-system-dept',
  templateUrl: './dept.component.html',
})
export class SystemDeptComponent implements OnInit {
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
  columns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '排序', index: 'orderNum' },
    {
      title: '',
      buttons: [
        {
          text: '新增下级部门',
          icon: 'profile',
          type: 'modal',
          click: (record: any) => {
            this.add(record.id);
          },
        },
        {
          text: '',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: DeptEditComponent,
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
    { title: '名称', index: 'name' },
    { title: '排序', index: 'orderNum' },
    {
      title: '',
      buttons: [
        {
          text: '',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: DeptEditComponent,
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
      .get(Api.BaseDeptApi + 'tree', this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.record = res.data;
        }
      });
  }

  add(parentId: any) {
    this.modal
      .createStatic(DeptEditComponent, parentId)
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
          .delete(Api.BaseDeptApi + record.id)
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
