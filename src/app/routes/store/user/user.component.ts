import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Api } from '@shared/api';
import { StoreUserEditComponent } from './user-edit.component';

@Component({
  selector: 'app-store-user',
  templateUrl: './user.component.html',
})
export class StoreUserComponent implements OnInit {
  constructor(
    protected http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
  ) {}
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
      account: {
        type: 'string',
        title: '账号',
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '编号', type: 'no' },
    { title: '账号', index: 'account' },
    { title: '操作权限', render: 'authList' },
    { title: '最大上传大小', index: 'maxSize' },
    { title: '最大下载速度', index: 'maxRate' },
    {
      title: '操作',
      buttons: [
        {
          text: '修改',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: StoreUserEditComponent,
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
          }
        },
      ],
    },
  ];

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
    this.params = {firmId: 1};
    if (event) {
      if (event.name) this.params.name = event.name;
      if (event.description) this.params.description = event.description;
    }
    this.http
      .get(Api.BaseStoreUserApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data){
            this.page = res.data;
            this.handleAuth();
          }
        }
      });
  }

  handleAuth() {
    if (this.page && this.page.records){
      for (const item of this.page.records){
        item.authList = [];
        for (const ch of item.auth) {
          item.authList.push(ch);
        }
      }
    }
    console.log(this.page);
  }
  getTag(value): string {
    if (value === 'c')
      return '创建文件夹';
    else if ( value === 'u')
      return '上传文件';
    else if ( value === 'd')
      return '删除文件或文件夹';
    else if (value === 'r')
      return '重命名文件或编辑文件夹';
    else if (value === 'l')
      return '下载文件';
    else if (value === 'm')
      return '移动文件或文件夹';
    else
      return '未知';
  }

  add() {
    this.modal
      .createStatic(StoreUserEditComponent)
      .subscribe(() => this.st.reload());
  }

  delete(record: any) {
    console.log(record);
    // const params = {userId: record.userId, firmId: 1};
    this.modalService.confirm({
      nzTitle: '确定删除吗?',
      nzContent:
        '<b style="color: red;">如果您确定要删除请点击确定按钮，否则点取消</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () =>
        this.http
          .delete(Api.BaseStoreUserApi + 'delete/' + record.userId)
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
