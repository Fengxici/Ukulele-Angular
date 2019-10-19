import { ActivatedRoute } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { AbilityService } from './service/AbilityService';

export abstract class BaseAbilityComponent {
  constructor(
    protected route: ActivatedRoute,
    protected ability: AbilityService
  ) {}
  initAbilities(): void {
    const url =
      '/' +
      this.route.pathFromRoot
        .map(r => r.snapshot.url)
        .filter(f => !!f[0])
        .map(([f]) => f.path)
        .join('/');
    // const path =
    //     'api/portal-service/ant-menu/user/abilities?router=' +
    //     url +
    //     '&userId=' +
    //     this.settingService.user.id;
    // this.http.get(path).subscribe((res: any) => {
    //     if (res && res.code === ResponseCode.SUCCESS) {
    //       if (res.data) {
    //         this.aclService.setAbility(res.data);
    //       }
    //     }
    //   });
    this.ability.filterAbility(url);
  }

  clearAbilities(): void {
    // this.aclService.setAbility([]);
    this.ability.clear();
  }
}
