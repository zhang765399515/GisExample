<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { getUserList, delUser } from '@/api/user';
import Search from '@/components/components/Search/index.vue';
import Card from '@/components/components/Card/index.vue';
import addUserPop from "./addUser.vue"
const userData = reactive({
  username: ''
});
const editData = reactive({
  list: {}
});
const dialogFormVisible = ref(false);
const sure = () => {
  getList(userData);
};
const reset = () => {
  getList({});
  userData.username = '';
};
const tableData = ref([]);
const getList = (list: any) => {
  getUserList(list).then(res => {
    tableData.value = res.data;
  });
};
getList({});
const handleDelete = (index: number, data: any) => {
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delUser({ id: data.id }).then(res => {
        if (res.code == 200) {
          ElMessage.success('删除成功!');
        } else {
          ElMessage.error(res.msg);
        }
        getList({});
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      });
    });
};
const handleEdit = (index:number,data:any) => {
    dialogFormVisible.value = true;
    editData.type = 2;
    editData.list = data;
}
const add = () => {
  dialogFormVisible.value = true;
  editData.type = 1;
  editData.list = {
    username: '',
    password: '',
    nickName: '',
    phone: '',
    status: 1,
  };
};
</script>

<template>
  <div class="dhy_case-table">
    <Search @sure="sure" @reset="reset">
      <el-form>
        <el-form-item label="用户名称">
          <el-input placeholder="请输入用户名称" v-model="userData.username"></el-input>
        </el-form-item>
      </el-form>
    </Search>
    <Card>
      <!-- 操作按钮 -->
      <template v-slot:header-control>
        <el-button type="primary" icon="Plus" @click="add">新增</el-button>
      </template>
      <!-- 右侧按钮 -->
      <template v-slot:end-control></template>
      <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" default-expand-all>
        <el-table-column prop="username" label="用户名称" />
        <el-table-column prop="nickName" label="别名" />
        <el-table-column prop="phone" label="电话号码" />
        <el-table-column prop="status" label="用户状态">
          <template #default="scope">
            <el-button v-if="scope.row.status == 1" type="success" plain>正常</el-button>
            <el-button v-else type="danger" plain>禁止</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="修改时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </Card>
    <addUserPop v-model:dialogFormVisible="dialogFormVisible" v-model:editData="editData" @childList="getList"></addUserPop>
  </div>
</template>
<style lang="scss" scoped>
.dhy_case-table {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  padding: 20px 20px;
}
</style>