import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NzModalRef,
  NzMessageService,
  NzTreeComponent,
  NzTreeNode,
} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ResponseCode } from '@shared/response.code';
import { Api } from '@shared/api';

@Component({
  selector: 'app-system-role-menu',
  templateUrl: './role-menu.component.html',
})
export class RoleMenuComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}
  @ViewChild('treeElement') treeElement: NzTreeComponent;
  record: any = {};
  nodes: any = [];
  saveNodes: any = [];
  ngOnInit(): void {
    this.query();
  }

  query() {
    this.http
      .get(Api.BaseAntMenuApi + 'findAllMenuWithRole/' + this.record.id)
      .subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) this.createTree(res.data);
        }
      });
  }

  save() {
    const checkedParentNodeList = this.treeElement.getHalfCheckedNodeList();
    const checkedNodeList = this.treeElement.getCheckedNodeList();
    // 可能存在并未全选的父节点
    if (checkedParentNodeList)
      checkedParentNodeList.forEach(item => {
        this.saveNodes.push({
          roleId: this.record.id,
          menuId: item.key,
          abilities: item.origin.permisson.abilities,
        });
      });
    // 所有选中的节点及其子节点
    if (checkedNodeList) this.getAllChidNode(checkedNodeList);
    const data: any = {};
    data.roleId = this.record.id;
    data.menuList = this.saveNodes;
    console.log(data);
    this.http
      .post(Api.BaseAntMenuApi + 'role/menu/edit', data)
      .subscribe((res: any) => {
        if (res) {
          if (res.code === ResponseCode.SUCCESS) {
            this.msgSrv.success('保存成功');
            this.modal.close(true);
          } else {
            this.msgSrv.warning(res.message);
          }
        } else {
          this.msgSrv.error('保存失败，未知错误');
        }
      });
    this.saveNodes = [];
  }
  // 获取所有节点及其子节点
  getAllChidNode(node: NzTreeNode[]) {
    if (node)
      node.forEach(item => {
        this.saveNodes.push({
          roleId: this.record.id,
          menuId: item.key,
          abilities: item.origin.permisson.abilities,
        });
        this.getAllChidNode(item.getChildren());
      });
  }

  close() {
    this.modal.destroy();
  }

  getTreeNode(node: any): any {
    const item: any = {};
    item.title = node.text;
    item.key = node.id;
    item.expanded = true;
    item.checked = node.checked;
    item.roleId = node.roleId;
    item.children = [];
    item.permisson = {
      abilities: node.abilities ? node.abilities : [],
      inputVisible: false,
      inputValue: '',
    };
    item.isLeaf = node.children && node.children.length === 0;
    if (node.children)
      node.children.forEach(child => {
        item.children.push(this.getTreeNode(child));
      });
    return item;
  }

  createTree(tree: []) {
    const tempNode: any = [];
    if (tree) {
      tree.forEach(item => {
        const node = this.getTreeNode(item);
        tempNode.push(node);
      });
      this.nodes = tempNode;
    }
  }

  handleClose(removedTag: {}, node: any): void {
    node.origin.permisson.abilities = node.origin.permisson.abilities.filter(
      tag => tag !== removedTag,
    );
  }

  handleInputConfirm(node: any): void {
    if (!node.origin.permisson.inputValue) return;
    if (
      node.origin.permisson.abilities.indexOf(
        node.origin.permisson.inputValue,
      ) === -1
    ) {
      node.origin.permisson.abilities = [
        ...node.origin.permisson.abilities,
        node.origin.permisson.inputValue,
      ];
    }
    node.origin.permisson.inputValue = '';
    node.origin.permisson.inputVisible = false;
  }

  showInput(node: any): void {
    node.origin.permisson.inputVisible = true;
  }
}
