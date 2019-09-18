import { ActivatedRoute } from '@angular/router';
import { _HttpClient, SettingsService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { ResponseCode } from './response.code';

export abstract class BaseAbilityComponent {
  constructor(
    protected aclService: ACLService,
    protected http: _HttpClient,
    protected settingService: SettingsService,
    protected route: ActivatedRoute,
  ) {}
  initAbilities(): void {
    const url =
      '/' +
      this.route.pathFromRoot
        .map(r => r.snapshot.url)
        .filter(f => !!f[0])
        .map(([f]) => f.path)
        .join('/');
    const path =
        'api/portal-service/ant-menu/user/abilities?router=' +
        url +
        '&userId=' +
        this.settingService.user.id;
    this.http.get(path).subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) {
            this.aclService.setAbility(res.data);
          }
        }
      });
    }

  clearAbilities(): void {
    this.aclService.setAbility([]);
  }
}
