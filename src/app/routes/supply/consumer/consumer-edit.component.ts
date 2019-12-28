import { Component, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';
import { STPage, STComponent, STColumn, STChange } from '@delon/abc';
@Component({
  selector: 'app-supply-consumer-edit',
  templateUrl: './consumer-edit.component.html',
})
export class ConsumerEditComponent {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
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
      name: {
        type: 'string',
        title: '名称',
        ui: {
          acl: { ability: ['query'] },
        },
      }
    },
  };

  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '描述', width: '150px', index: 'description' },
    {
      title: '操作',
      buttons: [
        {
          text: '加入',
          icon: 'plus',
          click: (record: any) => {
            this.join(record);
          },
        }
      ],
    },
  ];

  change(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.params.size = e.ps;
      this.params.current = e.pi;
      this.query(null);
    }
  }

  query(event: any) {
    if (event) {
      if (event.name) this.params.name = event.name;
    }
    if (!(this.params.name)) {
      this.msgSrv.warning('请先输入查询条件！');
      return;
    }
    const current: number = this.params.current || 1;
    const size: number = this.params.size || 10;
    this.params = {};
    this.http
    .get(Api.BaseSupplyFirmApi + 'page/' + current + '/' + size, this.params)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) this.page = res.data;
      }
    });
  }

  join(record: any) {
    console.log(record);
    const params = {
      consumerId: record.id,
      firmId: 1
    };
    this.http.post(Api.BaseSupplyConsumerApi, null, params).subscribe((res: any) => {
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

  close() {
    this.modal.destroy();
  }
}
