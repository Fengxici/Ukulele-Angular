import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Api } from '@shared/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
 })
export class PublicService {
  constructor(
    private http: _HttpClient,
  ) {}

  /**
   * 获取字典列表
   * @param key 字典键值
   */
  queryDicByIndex(key: string): Observable<any> {
    return this.http.get(Api.BaseDictApi + 'index/key/' + key);
  }
}
