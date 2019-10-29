import { BaseAbilityComponent } from '@shared/base.ability.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';
import { ResponseCode } from '@shared/response.code';
import { STComponent, STColumn, STPage } from '@delon/abc';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AbilityService } from '@shared/service/ability.service';

@Component({
  selector: 'app-monitor-node',
  templateUrl: './node.component.html',
})
export class MonitorNodeComponent extends BaseAbilityComponent
implements OnInit, OnDestroy {
  constructor(
    protected http: _HttpClient,
    protected route: ActivatedRoute,
    private modalService: NzModalService,
    private msg: NzMessageService,
    protected ability: AbilityService
  ) {
    super( route, ability);
  }
  pagination: STPage = {
    show: false,
  };
  @ViewChild('st', { static: true }) st: STComponent;
  @ViewChild('stItem', { static: true }) stItem: STComponent;
  columns: STColumn[] = [
    { title: '服务名', index: 'name' },
  ];
  itemColumns: STColumn[] = [
    { title: '实例ID', index: 'instanceId' },
    { title: 'ipAddr', index: 'ipAddr' },
    { title: '状态', index: 'status' },
    {
      title: '操作',
      buttons: [
        {
          text: '上下线',
          icon: 'delete',
          click: (record: any) => {
            this.upOrDown(record);
          },
        },
      ],
    },
  ];
  records: [];
  ngOnInit() {
    super.initAbilities();
    this.query(null);
  }
  ngOnDestroy(): void {
    super.clearAbilities();
  }
  query(event: any) {
    this.http
      .get('api/portal-service/eureka/apps')
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) this.records = res.data;
        }
      });
  }

  upOrDown(instance: any) {
    console.log(instance);
    const params: any = {};
    params.instanceId = instance.instanceId;
    params.status = instance.status === 'UP' ? 'DOWN' : 'UP';
    this.modalService.confirm({
      nzTitle: '确定吗?',
      nzContent:
        '<b style="color: red;">如果您确定要开启或关闭该节点，请点击确定按钮，否则点取消</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () =>
        this.http
          .post('api/portal-service/eureka/status/' + instance.app, null, params)
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
