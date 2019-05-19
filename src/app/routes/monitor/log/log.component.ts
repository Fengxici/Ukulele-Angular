import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'app-monitor-log',
  templateUrl: './log.component.html',
})
export class MonitorLogComponent implements OnInit {

  constructor(private http: _HttpClient, private modal: ModalHelper) { }
  params: any = {};
  page: any = {
    records: [],
    current: 1,
    total: 0,
    size: 10
  };
  pagination: STPage = {
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
    total: true,
    showSize: true,
    showQuickJumper: true
  };
  searchSchema: SFSchema = {
    properties: {
      serviceId: {
        type: 'string',
        title: '服务ID'
      },
      remoteAddr: {
        type: 'string',
        title: '终端IP'
      },
      requestUrl: {
        type: 'string',
        title: '请求URL'
      },
      createBy: {
        type: 'string',
        title: '操作人'
      },
      createTime: {
        type: 'string',
        title: '操作时间',
        ui: { widget: 'date', mode: 'range' }
      },
      type: {
        type: 'string',
        title: '类型',
        enum: [
          { label: 'Login', value: 'Login' },
          { label: 'Operation', value: 'Operation' }
        ],
        ui: {
            widget: 'select',
            width: 180
        }
      },
      title: {
        type: 'string',
        title: '标题',
        enum: [
          { label: 'Login', value: 'Login' },
          { label: 'Operation', value: 'Operation' }
        ],
        ui: {
            widget: 'select',
            width: 180
        }
      },
      userAgent: {
        type: 'string',
        title: '用户代理'
      },
      method: {
        type: 'string',
        title: '操作方法',
        enum: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          {label: 'PUT', value: 'PUT' },
          {label: 'DELETE', value: 'DELETE' }
        ],
        ui: {
            widget: 'select',
            width: 180
        }
      },
      params: {
        type: 'string',
        title: '提交的数据'
      },
      time: {
        type: 'string',
        title: '执行时间',
        ui: { widget: 'date', mode: 'range' }
      },
      exceptione: {
        type: 'string',
        title: '异常信息'
      }
    }
  };
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
      { title: '类型',  index: 'type' },
      { title: '标题',  index: 'title' },
      { title: '服务ID',  index: 'serviceId' },
      { title: '终端IP',  index: 'remoteAddr' },
      { title: '用户代理',  index: 'userAgent' },
      { title: '请求URL',  index: 'requestUrl' },
      { title: '操作方法',  index: 'method' },
      { title: '提交的数据',  index: 'params' },
      { title: '执行时间',  index: 'time' },
      { title: '异常信息',  index: 'exception' },
      { title: '操作人',  index: 'createBy' },
      { title: '操作时间',  index: 'createTime' },
      {
        title: '',
        buttons: [
          { text: '删除', icon: 'delete' }
        ]
      }
    ];

  ngOnInit() {
    this.query(null);
  }
  query(event: any) {
    const current: number = this.params.current || 1;
    const size: number = this.params.size || 10;
    this.params = {};
    if (event) {
      if (event.type)
        this.params.type = event.type;
      if (event.title )
        this.params.title = event.title;
      if (event.serviceId)
        this.params.serviceId = event.serviceId;
      if (event.remoteAddr)
        this.params.remoteAddr = event.remoteAddr;
      if (event.userAgent)
        this.params.userAgent = event.userAgent;
      if (event.requestUrl)
        this.params.requestUrl = event.requestUrl;
      if (event.method)
        this.params.method = event.method;
      if (event.params)
        this.params.params = event.params;
      if (event.exception)
        this.params.exception = event.exception ;
      if (event.createBy)
        this.params.createBy = event.createBy;
    }
    this.http.get('api/syslog-service/log/page/' + current + '/' + size, this.params)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data)
          this.page = res.data;
      }
     });
  }
  change(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.params.size = e.ps;
      this.params.current = e.pi;
      this.query(null);
    }
 }
}
