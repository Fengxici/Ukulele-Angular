import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
  selector: 'app-sf-taglist',
  template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
    <nz-tag nzColor="{{config.color}}" nzMode="{{config.mode}}" (nzOnClose)="config.onClose" *ngFor="let item of tagData">item.text</nz-tag>
    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`
})
export class TigListWidgetComponent extends ControlWidget implements OnInit {
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'taglist';

  // 组件所需要的参数，建议使用 `ngOnInit` 获取
  config: any;
  tagData: [];

  ngOnInit(): void {
    this.config = this.ui.config || {};
    this.tagData = this.ui.tag_data || [];
  }

  // reset 可以更好的解决表单重置过程中所需要的新数据问题
  reset(value: string) {

  }

  change(value: string) {
    if (this.ui.change) this.ui.change(value);
    this.setValue(value);
  }
}
