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
  updateNodes: any = [];

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
        this.updateNodes.push({
          roleId: this.record.id,
          menuId: item.key,
          abilities: item.origin.permisson.abilities,
        });
      });
    // 所有选中的节点及其子节点
    if (checkedNodeList) this.getAllChidNode(checkedNodeList);
    console.log(this.updateNodes);
    const data: any = {};
    data.roleId = this.record.id;
    data.menuList = this.updateNodes;
    this.http
      .post(Api.BaseAntMenuApi + 'role/menu/edit', data)
      .subscribe((res: any) => {
        if (res && res.code === ResponseCode.SUCCESS) {
          console.log(res);
        }
      });
    this.updateNodes = [];
  }

  // 获取所有节点及其子节点
  getAllChidNode(node: NzTreeNode[]) {
    if (node)
      node.forEach(item => {
        this.updateNodes.push({
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
    item.checked = node.roleId ? true : false;
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

  showInput(node: any): void {
    node.origin.permisson.inputVisible = true;
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

  handleCheckBoxChange(event: any): void {
    console.log(event.node);
    const node = event.node;
    if (!node.origin.roleId) return;
    // 记录删除的节点
    if (node.isChecked) {
      this.updateNodes = this.updateNodes.filter(
        item => item.menuId !== node.key,
      );
    } else {
      this.updateNodes.push({
        roleId: node.origin.roleId,
        menuId: node.key,
        delete: true,
      });
    }
  }
}
