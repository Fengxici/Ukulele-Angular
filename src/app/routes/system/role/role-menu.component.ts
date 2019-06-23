import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NzModalRef,
  NzMessageService,
  NzTreeComponent,
  NzTreeNode,
} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
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
          abliities: item.origin.permisson.abilities,
        });
      });
    // 所有选中的节点及其子节点
    if (checkedNodeList) this.getAllChidNode(checkedNodeList);
    console.log(this.updateNodes);
    this.updateNodes = [];
  }

  // 获取所有节点及其子节点
  getAllChidNode(node: NzTreeNode[]) {
    if (node)
      node.forEach(item => {
        this.updateNodes.push({
          roleId: this.record.id,
          menuId: item.key,
          abliities: item.origin.permisson.abilities,
        });
        this.getAllChidNode(item.getChildren());
      });
  }
  close() {
    this.modal.destroy();
  }

  createTree(tree: []) {
    if (tree) {
      const tempNode: any = [];
      tree.forEach((rootMenu: any) => {
        const item1: any = {};
        item1.title = rootMenu.text;
        item1.key = rootMenu.id;
        item1.expanded = true;
        item1.checked = rootMenu.roleId ? true : false;
        item1.roleId = rootMenu.roleId;
        item1.children = [];
        item1.permisson = {
          abilities: rootMenu.abilities ? rootMenu.abilities : [],
          inputVisible: false,
          inputValue: '',
        };
        item1.isLeaf = rootMenu.children && rootMenu.children.length === 0;
        tempNode.push(item1);
        if (rootMenu.children) {
          rootMenu.children.forEach((menuItem1: any) => {
            const item2: any = {};
            item2.title = menuItem1.text;
            item2.key = menuItem1.id;
            item2.expanded = true;
            item2.checked = menuItem1.roleId ? true : false;
            item2.roleId = menuItem1.roleId;
            item2.children = [];
            item2.permisson = {
              abilities: menuItem1.abilities ? menuItem1.abilities : [],
              inputVisible: false,
              inputValue: '',
            };
            item2.isLeaf =
              menuItem1.children && menuItem1.children.length === 0;
            item1.children.push(item2);
            if (menuItem1.children) {
              menuItem1.children.forEach((menuItem2: any) => {
                const item3: any = {};
                item3.title = menuItem2.text;
                item3.key = menuItem2.id;
                item3.isLeaf = true;
                item3.checked = menuItem2.roleId ? true : false;
                item3.roleId = menuItem2.roleId;
                item3.permisson = {
                  abilities: menuItem2.abilities ? menuItem2.abilities : [],
                  inputVisible: false,
                  inputValue: '',
                };
                item2.children.push(item3);
              });
            }
          });
        }
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
