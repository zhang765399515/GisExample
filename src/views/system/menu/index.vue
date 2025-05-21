<script lang="ts" setup>
import { ref,reactive } from 'vue';
import Search from "@/components/components/Search/index.vue";
import Card from "@/components/components/Card/index.vue";
import addMenu from "./addMenu.vue"
import { getMenu,deleteMenu } from "@/api/user";

const menuData = reactive({
  cataName:''
})
const dialogFormVisible = ref(false);
const tableData: Menu[] = ref([]);
const editData = reactive({
  treeList:[],
  type:1,
  list:{
      cataName: '',
      level:null,
      cataUrl:"",
      coverUrl:"",
      isSub:1,//0:无，1有
      isVisible:1,//0不可见 1可见
      sort:null
  }
})
const sure = () => {
  getList(menuData);
}
const reset = () => {
  getList({});
  menuData.cataName = ''
}
const addMenuScene = () => {
    dialogFormVisible.value = true;
    editData.type = 1;
    editData.list = {
      cataName: '',
      level:null,
      cataUrl:"",
      coverUrl:"",
      isSub:1,//0:无，1有
      isVisible:1,//0不可见 1可见
      sort:null
  }
}
const getList = (list:any) => {
    getMenu(list).then(res=>{
      tableData.value = res.data;
      editData.treeList = res.data;
    })
}
getList({});
interface Menu {
  id: number
  cataName: string
  cataUrl: string
  coverUrl: string
  isSub:number
  isVisible:number
  level:number
  children?: Menu[]
}


const handleEdit = (index:number,data:any) => {
    dialogFormVisible.value = true;
    editData.type = 2;
    editData.list = data;
    editData.list.menuValue = data.cataName;
}
const handleDelete = (index:number,data:any) => {
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteMenu({id:data.id}).then(res =>{
              if(res.code == 200){
                ElMessage.success('删除成功!')
              }else{
                ElMessage.error(res.msg)
              }
              getList(menuData);
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '已取消删除',
            })
          })
    
}
</script>

<template>
    <div class="dhy_case-table">
        <Search @sure="sure" @reset="reset">
            <el-form>
                <el-form-item label="菜单名称">
                    <el-input placeholder="请输入菜单名称" v-model="menuData.cataName"></el-input>
                </el-form-item>
            </el-form>
        </Search>
        <Card>
            <!-- 操作按钮 -->
            <template v-slot:header-control>
                <el-button type="primary" icon="Plus" @click="addMenuScene">新增</el-button>
            </template>
            <!-- 右侧按钮 -->
            <template v-slot:end-control></template>
            <el-table
                :data="tableData"
                style="width: 100%; margin-bottom: 20px"
                row-key="id"
                default-expand-all
                height="650px"
                >
                <el-table-column prop="cataName" label="菜单名称" width="250"/>
                <el-table-column prop="sort" label="排序" />
                <el-table-column prop="coverUrl" label="封面">
                  <template #default="scope">
                    <el-image style="width: 50px; height: 50px" :src="scope.row.coverUrl" fit="contain" ></el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="cataUrl" label="页面路径" />
                <el-table-column prop="path" label="路由出口" />
                <el-table-column prop="isSub" label="类型">
                  <template #default="scope">
                    <el-button v-if="scope.row.isSub == 1" type="primary" plain>目录</el-button>
                    <el-button v-else type="success" plain>菜单</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="isVisible" label="是否可见">
                  <template #default="scope">
                    <el-button v-if="scope.row.isVisible == 1" type="primary" plain>可见</el-button>
                    <el-button v-else type="danger" plain>不可见</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </Card>
    </div>
    <addMenu v-if="dialogFormVisible" v-model:dialogFormVisible="dialogFormVisible" v-model:editData="editData" @childList="getList"></addMenu>
</template>

<style lang="scss" scoped>
.dhy_case-table{
    width:calc(100% - 40px);
    height:calc(100% - 40px);
    padding:20px 20px;
}
</style>
