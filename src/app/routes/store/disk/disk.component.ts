import { Component, ViewChild, ChangeDetectorRef, TemplateRef, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';
@Component({
  selector: 'app-store-disk',
  templateUrl: './disk.component.html',
})
export class StoreDiskComponent implements OnInit {
  data: any[] = [];
  fid = 'root';
  folder: any = {};
  @ViewChild('st', { static: true })
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'key', type: 'checkbox' },
    { title: '名称', index: 'no' },
    { title: '创建日期', index: 'description' },
    { title: '大小', index: 'description' },
    { title: '创建者', index: 'description' },
    {
      title: '操作',
      buttons: [
        {
          text: '下载',
          click: (item: any) => this.msg.success(`配置${item.no}`),
        },
        {
          text: '删除',
          click: (item: any) => this.msg.success(`订阅警报${item.no}`),
        },
      ],
    },
  ];
  selectedRows: STData[] = [];
  totalCallNo = 0;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.query(null);
  }

  query(event: any) {
    this.http
      .post(Api.BaseStoreHomeApi + 'getFolderView', null, {fid: this.fid})
      .subscribe((res: any) => {
        console.log(res);
        if (res){
          this.folder = res;
        }
      });
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        // this.getData();
        break;
    }
  }
}
