import { Component, OnInit } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  constructor(
    private settingsService: SettingsService,
    private http: _HttpClient
  ) { }

  ngOnInit() {
    this.getMenu();
  }

  getMenu(){
    this.http.get('api/system-service/menu/' + this.settingsService.user.id)
    .subscribe((res: any) => {
      console.log(res);
      });
  }
  
}
