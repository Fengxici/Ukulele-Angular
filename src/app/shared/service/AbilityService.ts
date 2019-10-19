import { _HttpClient, SettingsService } from '@delon/theme';
import { ResponseCode } from '@shared/response.code';
import { ACLService } from '@delon/acl';
import { Api } from '@shared/api';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
 })
export class AbilityService {
  constructor(
    private aclService: ACLService,
    private http: _HttpClient,
  ) {}
  allAbilities: any = {} ;

  initAbilities() {
    this.http.get(Api.BaseAntMenuApi + 'role/abilities').subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) {
          this.allAbilities = res.data;
        }
      }
    });
  }

  filterAbility(router: string) {
    if (this.allAbilities[router])
      this.aclService.setAbility(this.allAbilities[router]);
    else
      this.http.get(Api.BaseAntMenuApi + 'role/abilities').subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          if (res.data) {
            this.allAbilities = res.data;
            const rolePermission = res.data[router];
            if (rolePermission)
            this.aclService.setAbility(rolePermission);
          }
        }
      });
  }
  initUserAbility() {
    this.initAbilities();
  }

  clear(): void {
    this.aclService.setAbility([]);
  }
}
