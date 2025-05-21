<template>
  <div class="dhy-demo">
    <div class="left-menu">
      <el-form :model="treeForm" size="small" label-width="80">
        <el-form-item label="文件路径:">
          <el-input v-model="treeForm.fileUrl" />
        </el-form-item>
        <el-form-item label="目录树:">
          <el-input v-model="treeForm.treeUrl" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="readFileFun">读取文件</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        ref="modelTreeRef"
        v-if="treeData[0].children.length > 1"
        :data="treeData"
        show-checkbox
        :render-after-expand="false"
        node-key="id"
        :default-expanded-keys="[0]"
        :props="defaultProps"
        :default-checked-keys="keys"
        @check-change="menuCheckChange"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span class="tree-label">{{ data.name }}</span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { load3dtiles, loadLayer } from './map';
const treeForm = ref({
  fileUrl: 'http://127.0.0.1:8081/newwhole/tileset.json',
  treeUrl: 'http://127.0.0.1:8081/tree2.json'
  // fileUrl: "",
  // treeUrl: ""
});
const defaultProps = {
  children: 'children',
  label: 'name'
};
const modelTreeRef = ref(null);
const keys = ref([]);
const treeData = ref([
  {
    id: 0,
    name: '全选',
    children: []
  }
]);
const checkAll = ref(false);
const isIndeterminate = ref(false);

onMounted(() => {});
const readFileFun = function () {
  axios.get(treeForm.value.treeUrl).then(res => {
    treeData.value[0].children = res.data;
    load3dtiles(treeForm.value.fileUrl, val => {
      res.data.forEach(e => {
        if (e.check == true) {
          keys.value.push(e.id);
          menuCheckChange(e, e.check);
        }
      });
      modelTreeRef.value.setCheckedKeys(keys.value);
    });
  });
};
const menuCheckChange = function (data, check) {
  data.check = check;
  loadLayer(data.name, check);
};
</script>
<style lang="scss" scoped>
.dhy-demo {
  position: fixed;
  top: 80px;
  left: 10px;
}

.left-menu {
  width: 300px;
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
}

:deep(.el-form-item__label) {
  color: #fff;
}

:deep(.el-tree-node__content:hover),
:deep(.el-upload-list__item:hover) {
  background: none;
}

:deep(.el-tree-node:focus > .el-tree-node__content) {
  background-color: transparent;
}

.el-tree {
  background: none;
  color: #fff;

  .el-tree-node:focus > .el-tree-node__content {
    background: none;
  }

  .el-tree-node__content {
    display: flex;
    width: 100%;
    position: relative;
    padding: 10px 2px;
    margin-right: 2px;
    background: none;

    .el-tree-node__expand-icon::before {
      content: none;
    }

    .tree-label {
      width: 150px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }
  }

  .el-tree-node__children {
    color: #fff;

    .el-tree-node__content {
      padding-left: 14px !important;
      background: none;
    }

    .el-tree-node__children {
      color: #fff;

      .el-tree-node__content {
        padding-left: 43px !important;
      }
    }
  }
}
</style>
