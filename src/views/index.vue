<script lang="ts" setup>

import AsideBar from '@/components/AsideBar/index.vue'
import Header from '@/components/Header/index.vue'
import CasesMain from '@/components/CasesMain/index.vue'
import { useRouter } from "vue-router";
import store from '../store';

const router = useRouter();

const uid = router.currentRoute.value.path;

if (uid === '/' && store.appStore.isShowSource) {
  store.appStore.setSourceCodeButtonVisible()
}
</script>

<template>
  <div class="dhy_common-layout">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-container>
        <el-aside width="300px">
          <AsideBar />
        </el-aside>
        <el-container>
          <el-main>
            <div class="dhy_cases">
              <CasesMain />
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
