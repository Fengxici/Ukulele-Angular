import { _HttpClient, SettingsService } from '@delon/theme';
import { ResponseCode } from '@shared/response.code';
import { ACLService } from '@delon/acl';

export class AbilityService {
  constructor(
    private aclService: ACLService,
    private http: _HttpClient,
    private settingService: SettingsService,
  ) {}

  initAbilities(url: string): void {
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

  clear(): void {
    this.aclService.setAbility([]);
  }
}
