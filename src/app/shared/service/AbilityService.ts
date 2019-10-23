import { _HttpClient } from '@delon/theme';
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
    this.allAbilities = JSON.parse(localStorage.getItem('page_abilities'));
    this.http.get(Api.BaseAntMenuApi + 'role/abilities').subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS) {
        if (res.data) {
          this.allAbilities = res.data;
          localStorage.setItem('page_abilities', JSON.stringify(res.data));
        }
      }
    });
  }

  filterAbility(router: string) {
    if (this.allAbilities && this.allAbilities[router])
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
