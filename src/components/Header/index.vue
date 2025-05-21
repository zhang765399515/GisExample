<script setup lang='ts'>
import store from '@/store';
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus'
import { getQueryString } from '@/utils/common'
import { Search } from '@element-plus/icons-vue'
const router = useRouter()
const instance = getCurrentInstance();

const name = ref<string>(store.user.name)
const userName = ref<string>(store.user.userName)
const cataName = ref();
// const route = useRoute();
const mainId = getQueryString('id');
const isShowSource = ref<boolean>(store.appStore.isShowSource)
if (mainId) {
  isShowSource.value = true
}
const openCodeEditor = () => {
  store.appStore.setEditorOpened();
}

const funSearch = () => {
  instance?.proxy?.$Bus.emit('cataName', cataName);
}

const logOut = () => {
  ElMessageBox.confirm('确认退出登录？', '系统提示', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }).then(() => {
    store.user.removeUser().then(() => {
      router.push({
        path: '/login'
      });
      location.reload();
    })
  })
}
const goView = (path: any) => {
  router.push({
    path: path
  })
}
// console.log(router.currentRoute.value.path !== '/system')
</script>

<template>
  <div class="dhy_header">
    <div class="dhy_title">
      <img src="/image/application/geokeygis_logo.png" alt="logo">
      <div v-if="!isShowSource && router.currentRoute.value.path !== '/system'" class="dhy_search">
        <el-input v-model="cataName" @input="funSearch" placeholder="请输入搜索内容" :prefix-icon="Search"
          clearable></el-input>
      </div>
    </div>
    <div class="dhy_user">
      <span>hello! {{ name }}{{ userName }}</span>
      <el-dropdown>
        <el-image style="width: 100px; height: 100px"
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goView('/home')">gis实例</el-dropdown-item>
            <el-dropdown-item @click="goView('/apihome')">API管理</el-dropdown-item>
            <el-dropdown-item @click="goView('/system')">系统管理</el-dropdown-item>
            <el-dropdown-item @click="goView('/personal')">个人中心</el-dropdown-item>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div v-if="isShowSource" class="dhy_head-menu">
        <span class="dhy_open-codeEdit" @click="openCodeEditor">查看源代码</span>
      </div>
    </div>
  </div>
</template>