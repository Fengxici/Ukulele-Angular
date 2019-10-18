import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SettingsService, MenuService } from '@delon/theme';
import { _HttpClient } from '@delon/theme';
import { ResponseCode } from '@shared/response.code';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  searchToggleStatus: boolean;

  constructor(
    public settings: SettingsService,
    private aclService: ACLService,
    private menuService: MenuService,
    private http: _HttpClient,
  ) {}

  ngOnInit(): void {
    this.getMenu();
  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  getMenu() {
    // 每次刷新后要重新设置用户角色
    this.aclService.setRole(this.settings.user.label);
    this.http.get('api/portal-service/ant-menu/user').subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) {
          this.aclService.setRole(this.settings.user.label);
          this.menuService.add(res.data);
        }
      }
    });
  }
}
