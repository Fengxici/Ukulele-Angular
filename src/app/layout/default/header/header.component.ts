import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SettingsService, MenuService } from '@delon/theme';
import { _HttpClient } from '@delon/theme';
import { ResponseCode } from '@shared/response.code';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  searchToggleStatus: boolean;

  constructor(public settings: SettingsService,
              private menuService: MenuService,
              private http: _HttpClient) { }

  ngOnInit(): void {
    this.getMenu();
  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  getMenu(){
    this.http.get('api/portal-service/ant-menu/user')
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS){
        if (res.data)
          this.menuService.add(res.data);
      }
     });
  }
}
