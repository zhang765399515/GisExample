<script setup lang="ts">
import { useRouter } from 'vue-router';
import store from '@/store';
import asideJson from '../../router/aside.json';
// import { getAssetsFile } from '../../utils/pubuse';
import { getMenu } from '@/api/user';
import { ref, getCurrentInstance } from 'vue';

interface Menu {
  id: number;
  cataName: string;
  cataUrl: string;
  coverUrl: string;
  isSub: number;
  isVisible: number;
  level: number;
  children: Menu[];
}

const instance = getCurrentInstance();
const tableData = ref<Menu[]>([]);
const router = useRouter();
const getList = (list: any) => {
  console.log(2);

  getMenu(list).then(res => {
    tableData.value = res.data;
  });
};
getList({});
const Bus = (str: any) => {
  getList({ cataName: str.value });
};
instance?.proxy?.$Bus.on('cataName', Bus);
const jumpClick = (data: any) => {
  let url = process.env.BASE_URL;
  if (process.env.EDITOR_MODE) {
    url += 'editor.html';
  } else {
    url += 'read.html';
  }

  // 处理参数
  url += `?id=` + encodeURI(data.cataUrl);
  window.open(url, '_blank');
};

const getTotalNum = (asideArray: any) => {
  let total: number = 0;
  if (asideArray.children && asideArray.children.length) {
    asideArray.children.forEach((aside: any) => {
      total += aside.children.length;
    });
  }
  return total;
};
</script>

<template>
  <el-scrollbar max-height="88vh">
    <div class="dhy_case-main" v-for="(item, index) in tableData" :key="index">
      <div class="dhy_case-title">
        <img src="/image/application/item.png" />
        <span :ref="'el' + index">
          {{ `${item.cataName}(${getTotalNum(item)})` }}
        </span>
      </div>
      <div class="dhy_case-container" v-for="(item1, exl) in item.children" :key="exl">
        <span :id="'anchor' + item1.id">
          {{ `${item1.cataName} (${item1.children.length})` }}
        </span>
        <div class="dhy_case-component">
          <div class="dhy_case-card" v-for="(item2, el) in item1.children" :key="el" @click="jumpClick(item2)">
            <!-- <img :src="getAssetsFile(item2.coverUrl)" class="image" /> -->
            <el-image loading="lazy" :src="item2.coverUrl" class="image" />
            <p class="dhy_card-label">{{ item2.cataName }}</p>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
