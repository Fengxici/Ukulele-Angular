import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  MenuService,
  SettingsService,
  TitleService,
  ALAIN_I18N_TOKEN,
} from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private refredhMenu(resolve: any, reject: any) {
    zip(
      this.httpClient.get('api/portal-service/ant-menu/user'),
    )
      .pipe(
        // 接收其他拦截器后产生的异常消息
        catchError(([appData]) => {
          resolve(null);
          return [appData];
        }),
      )
      .subscribe(
        ([appData]) => {
          this.aclService.setRole(this.settingService.user.label);
          // application data
          const res: any = appData;
          // 初始化菜单
          this.menuService.add( res.data || []  );
          const app: any = {
            name: `Ukulele`,
            description: `Ukulele是一个多语言跨平台的中台框架，旨在打造企业级的微服务快速开发框架`,
          };
          // 应用信息：包括站点名、描述、年份
          this.settingService.setApp(app);
          // ACL：设置权限为全量
          this.aclService.setFull(false);
          // 设置页面标题的后缀
          this.titleService.suffix = app.name;
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
    )
      .pipe(
        // 接收其他拦截器后产生的异常消息
        catchError(([langData]) => {
          resolve(null);
          return [langData];
        }),
      )
      .subscribe(
        ([langData]) => {
          this.aclService.setRole(this.settingService.user.label);
          // setting language data
          this.translate.setTranslation(this.i18n.defaultLang, langData);
          this.translate.setDefaultLang(this.i18n.defaultLang);
          // application data
          const app: any = {
            name: `Ukulele`,
            description: `Ukulele是一个多语言跨平台的中台框架，旨在打造企业级的微服务快速开发框架`,
          };
          // 应用信息：包括站点名、描述、年份
          this.settingService.setApp(app);
          // ACL：设置权限为全量
          this.aclService.setFull(false);
          // 设置页面标题的后缀
          this.titleService.suffix = app.name;
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  reload(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.refredhMenu(resolve, reject);
    });
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      // this.viaMockI18n(resolve, reject);
      this.viaHttp(resolve, reject);
    });
  }
}
