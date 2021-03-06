import { ActivatedRoute } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { AbilityService } from './service/ability.service';

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
    this.ability.filterAbility(url);
  }

  clearAbilities(): void {
    this.ability.clear();
  }
}
