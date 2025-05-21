<script setup lang="ts">
import { ref,getCurrentInstance } from "vue";
import asideJson from "../../router/aside.json";
import { getMenu,deleteMenu } from "@/api/user";
const activeName = ref<number>(0);
const selectedId = ref<number | string>(0)
const tableData: Menu[] = ref([]);
const instance = getCurrentInstance();
//锚点跳转
const getList = (list:any) => {
    getMenu(list).then(res=>{
      tableData.value = res.data;
    })
}
getList({});
const liClickFn = (item: number | string) => {
  // instance?.proxy?.$Bus.emit('cataName', item.cataName);
  selectedId.value = item.id;
  (document.querySelector(`#anchor${item.id}`) as Element).scrollIntoView({
    behavior: "smooth"
  });
};
// watch(props.editData, (newV, oldV) => {
//     if(newV.list){
//         form = reactive(newV.list)
//     }
// },{
//     deep: true,
//     immediate:true
// })
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
</script>

<template>
  <div class="demo-collapse">
    <el-scrollbar height="100%">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item :title="item.cataName" :name="index" v-for="(item, index) in tableData" :key="index">
          <ul>
            <li v-for="(ng, ngIndex) in item.children" :class="{ 'is-selected': selectedId == ng.cataUrl }" :key="ngIndex"
              @click="liClickFn(ng)">
              {{ `${ng.cataName}(${ng.children.length})` }}
            </li>
          </ul>
        </el-collapse-item>
        <!-- <el-collapse-item :title="item.name" :name="index" v-for="(item, index) in asideJson" :key="index">
          <ul>
            <li v-for="(ng, ngIndex) in item.children" :class="{ 'is-selected': selectedId == ng.id }" :key="ngIndex"
              @click="liClickFn(ng.id)">
              {{ `${ng.name}(${ng.children.length})` }}
            </li>
          </ul>
        </el-collapse-item> -->
      </el-collapse>
    </el-scrollbar>
  </div>
</template>
