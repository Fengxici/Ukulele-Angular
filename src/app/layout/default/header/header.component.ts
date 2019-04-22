import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SettingsService, MenuService } from '@delon/theme';
import { HttpClient } from '@angular/common/http';
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
              private http: HttpClient) { }

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
    this.http.get('api/portal-service/menu/user')
    .subscribe((res: any) => {
      const menus = [];
      if (res && res.code === ResponseCode.SUCCESS){
        if (res.data)
        res.data.forEach(menu => {
          const tmpRoot = {
            text: menu.name,
            group: true,
            children: []
          };
          menu.children.forEach(child => {
            const tmpChild = {
              text: child.name,
              link: child.component,
              icon: {value: child.icon}
            }
            tmpRoot.children.push(tmpChild);
          });
          menus.push(tmpRoot);
        });
      }
      console.log(res);
      console.log(menus);
      this.menuService.add(menus);
      });
  }
}
