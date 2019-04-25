import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ResponseCode } from '@shared/response.code';
@Component({
  selector: 'app-config-icon',
  templateUrl: './icon.component.html',
})
export class ConfigIconComponent implements OnInit {
  data:any={};
  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() {
    this.query(null);
   }

  searchSchema: SFSchema = {
    properties: {
      type: {
        type: 'string',
        title: '类型'
      },
      theme: {
        type: 'string',
        title: '主题'
      },
      value: {
        type: 'string',
        title: '值'
      },
    }
  };
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'id' },
    { title: '类型', index: 'type' },
    { title: '值',  width: '50px', index: 'value' },
    { title: '主题风格',  index: 'theme' },
    { title: '是否有旋转动画', type:'yn', index: 'spin' },
    { title: '双色图标的主要颜色', index: 'twoToneColor' },
    { title: 'IconFont 的图标类型',  index: 'iconfont' },
    {
      title: '',
      // buttons: [
      //   { text: '查看', click: (item: any) => `/form/${item.id}` },
      //   { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      // ]
    }
  ];
 
  query(event:any){
    let params:any={};
    if(event){
      if(event.theme){
        params.theme_=event.theme;
      }
      if(event.type){
        params.type_=event.type;
      }
      if(event.value){
        params.value_=event.value;
      }
    }
    this.http.get('api/portal-service/ant-icon/getByParam',params)
    .subscribe((res: any) => {
      if (res && res.code === ResponseCode.SUCCESS){
        if (res.data)
          console.log(res);
          this.data.total=res.data.length;
          this.data.list=res.data;
          this.st.data=this.data;
      }
     });
  }
  
  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
