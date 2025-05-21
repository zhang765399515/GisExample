<script setup lang="ts">
import { ref } from "vue";
import personal from "@/router/personal";
import { useRouter } from "vue-router";
const router = useRouter()

const activeName = ref<number>(0);
const selectedClick = ref<string>("");

const dataAll = [personal];
//锚点跳转
const liClickFn = (data: any) => {
  selectedClick.value = data.url;
  router.push({
    path:data.url
  })
};

</script>

<template>
  <div class="demo-collapse">
    <el-scrollbar height="100%">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item :title="item.name" :name="index" v-for="(item, index) in dataAll" :key="index">
          <ul>
            <li v-for="(ng, ngIndex) in item.children" :class="{ 'is-selected': selectedClick == ng.url }" :key="ngIndex"
              @click="liClickFn(ng)">
              {{ ng.name }}
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>
