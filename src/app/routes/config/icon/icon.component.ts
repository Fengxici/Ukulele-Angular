import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { IconEditComponent } from './icon-edit.component';
import { Api } from '@shared/api';

@Component({
  selector: 'app-config-icon',
  templateUrl: './icon.component.html',
})
export class IconComponent implements OnInit {
  constructor(
    private http: _HttpClient,
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
      type: {
        type: 'string',
        title: '类型',
        enum: [
          { label: 'class', value: 'class' },
          { label: 'icon', value: 'icon' },
          { label: 'img', value: 'img' },
        ],
        ui: {
          widget: 'select',
          width: 120,
        },
      },
      theme: {
        type: 'string',
        title: '主题',
        enum: [
          { label: 'outline', value: 'outline' },
          { label: 'twotone', value: 'twotone' },
          { label: 'fill', value: 'fill' },
        ],
        default: null,
        ui: {
          widget: 'select',
          width: 160,
        },
      },
      value: {
        type: 'string',
        title: '值',
      },
    },
  };
  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '类型', index: 'type' },
    { title: '值', width: '150px', index: 'value' },
    { title: '主题风格', index: 'theme' },
    { title: '是否有旋转动画', type: 'yn', index: 'spin' },
    { title: '双色图标的主要颜色', index: 'twoToneColor' },
    { title: 'IconFont的图标类型', index: 'iconfont' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: IconEditComponent,
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
      if (event.theme) this.params.theme = event.theme;
      if (event.type) this.params.type = event.type;
      if (event.value) this.params.value = event.value;
    }
    this.http
      .get(Api.BaseAntIconApi + 'page/' + current + '/' + size, this.params)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.page = res.data;
        }
      });
  }

  add() {
    this.modal
      .createStatic(IconEditComponent)
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
          .delete(Api.BaseAntIconApi + record.id)
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
