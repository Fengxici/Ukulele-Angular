import { _HttpClient, SettingsService } from '@delon/theme';
import { Api } from '@shared/api';
import { ResponseCode } from '@shared/response.code';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { StartupService } from '@core/startup/startup.service';

@Component({
  selector: 'app-firm-drawer',
  template: `
  <button nz-button nzType="primary" (click)="open()">{{firmInfo.name}}</button>
  <nz-drawer
    [nzClosable]="false"
    [nzVisible]="visible"
    nzPlacement="right"
    nzTitle="切换企业"
    (nzOnClose)="close()" >
    <div *ngFor="let item of firmList">
      <nz-card nzTitle="{{item.shortName}}" [nzExtra]="extraTemplate">
        <p>{{item.name}}</p>
        <p>{{item.description}}</p>
      </nz-card>
      <ng-template #extraTemplate>
      <button *ngIf="firmInfo.id!=item.id" nz-button nzType="primary" (click)="change(item)" [nzLoading]="isLoadingOne">切换</button>
      </ng-template>
    </div>
  </nz-drawer>`
})
export class FirmDrawerComponent implements OnInit {
  constructor(
    protected http: _HttpClient,
    private router: Router,
    protected settingsService: SettingsService,
    public startupSvr: StartupService
  ) {}

  visible = false;
  isLoadingOne = false;
  firmInfo: any;
  firmList: any = [];
  @Output() callback: EventEmitter<Event> = new EventEmitter();
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  ngOnInit(): void {
    this.firmInfo = JSON.parse(localStorage.getItem('firmInfo' + this.settingsService.user.id));
    if (!this.firmInfo) {
      this.firmInfo = {};
      this.router.navigate(['/supply/firm']);
      return;
    }
    this.getJoinedFirmList();
  }

  change(item) {
    this.firmInfo = item;
    localStorage.setItem('firmInfo' + this.settingsService.user.id, JSON.stringify(item));
    this.startupSvr.reload();
    if (this.callback)this.callback.emit();
    this.visible = false;
  }

  getJoinedFirmList() {
    const userId = this.settingsService.user.id;
    const param = { userId };
    this.http.get(Api.FirmUserJoinedUrl, param).subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) {
          this.firmList = res.data;
          if (this.firmList.length > 0) {
            if (this.firmInfo) {
              let contained = false;
              for (const item of this.firmList) {
                if (item.id === this.firmInfo.id) {
                  contained = true;
                  break;
                }
              }
              if (!contained) {
                this.firmInfo = this.firmList[0];
                localStorage.setItem('firmInfo' + this.settingsService.user.id, JSON.stringify(this.firmInfo));
              }
            } else {
              this.firmInfo = this.firmList[0];
              localStorage.setItem('firmInfo' + this.settingsService.user.id, JSON.stringify(this.firmInfo));
            }
          } else {
            this.firmInfo = null;
          }
        } else {
          this.firmInfo = null;
        }
      }
      this.callback.emit();
    });
  }
}
