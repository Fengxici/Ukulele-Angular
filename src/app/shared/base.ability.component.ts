import { AbilityService } from './service/AbilityService';
import { ActivatedRoute } from '@angular/router';
import { _HttpClient } from '@delon/theme';

export abstract class BaseAbilityComponent {
  constructor(
    protected abilityService: AbilityService,
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
    this.abilityService.initAbilities(url);
  }
  clearAbilities(): void {
    this.abilityService.clear();
  }
}
