import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SettingsService, MenuService } from '@delon/theme';
import { _HttpClient } from '@delon/theme';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  searchToggleStatus: boolean;

  constructor(
    public settings: SettingsService,
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
    this.http.get('api/portal-service/ant-menu/user').subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) {
          res.data.forEach(element1 => {
            if (element1.acl) element1.acl = JSON.parse(element1.acl);
            if (element1.children)
              element1.children.forEach(element2 => {
                if (element2.acl) element2.acl = JSON.parse(element2.acl);
                if (element2.children)
                  element2.children.forEach(element3 => {
                    if (element3.acl) element3.acl = JSON.parse(element3.acl);
                  });
              });
          });
          this.menuService.add(res.data);
        }
      }
    });
  }
}
