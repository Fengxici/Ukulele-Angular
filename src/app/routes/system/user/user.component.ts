import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, MenuService } from '@delon/theme';
import {
  STColumn,
  STComponent,
  STPage,
  STChange,
  STColumnTag,
} from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ResponseCode } from '@shared/response.code';
import { UserEditComponent } from './user-edit.component';
import { Api } from '@shared/api';

@Component({
  selector: 'app-system-user',
  templateUrl: './user.component.html',
})
export class SystemUserComponent implements OnInit {
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
      username: {
        type: 'string',
        title: '用户名',
      },
      phone: {
        type: 'string',
        title: '电话号码',
      },
      deptName: {
        type: 'string',
        title: '部门',
      },
      label: {
        type: 'string',
        title: '角色标签',
      },
    },
  };

  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '头像', type: 'img', width: '50px', index: 'avatar' },
    { title: '用户名', index: 'username' },
    { title: '电话号码', index: 'phone' },
    { title: '部门', index: 'deptName' },
    { title: '角色标签', index: 'label' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: UserEditComponent,
          },
          click: () => {
            this.query(null);
          },
        },
        {
          text: '删除',
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
      if (event.username) this.params.username = event.username;
      if (event.phone) this.params.phone = event.phone;
    }
    this.http
      .get(Api.BaseUserApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  add() {
    this.modal
      .createStatic(UserEditComponent)
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
        this.http.delete(Api.BaseUserApi + record.id).subscribe((res: any) => {
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