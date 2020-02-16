import { Component } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-store-disk',
  templateUrl: './disk.component.html',
})
export class StoreDiskComponent {
  constructor(
    protected http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private msg: NzMessageService,
  ) {}

}
