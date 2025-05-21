<script setup lang='ts'>

import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import store from '@/store';

import { useRouter } from "vue-router";
const router = useRouter()

const title: string = "GeoKeyGIS";

interface LoginForm {
  username: string
  password: string
  grant_type: string
  client_id: string
  client_secret: string
}
const loginForm = reactive<LoginForm>({
  username: 'admin',
  password: '',
  grant_type: "password",
  client_id: "powergisId",
  client_secret: "powergisSecret",
})
const loginRules = reactive<FormRules<LoginForm>>({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
})
const ruleFormRef = ref<FormInstance>()

let loading: Boolean = false;

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await store.user.login(loginForm);
      router.push({
        path: '/home'
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>

<template>
  <div class="dhy_login">
    <div class="dhy_login-main">
      <div class="dhy_login-cover">
        <div class="dhy_login-title">{{ title }}</div>
      </div>
      <el-form ref="ruleFormRef" :model="loginForm" :rules="loginRules" class="dhy_login-form">
        <h3 class="dhy_form-title">登录</h3>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" :prefix-icon="Lock" auto-complete="off"
            placeholder="请输入账号">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" :prefix-icon="User" type="password" auto-complete="off"
            placeholder="请输入密码" show-password @keyup.enter.native="handleLogin(ruleFormRef)">
          </el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" type="primary" style="width:100%;" @click="handleLogin(ruleFormRef)">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang='scss' scoped>
:deep(.el-button) {
  height: 50px;
  border-radius: 25px;
}

:deep(.el-input) {
  height: 50px;
}

:deep(.el-input__inner) {
  border-radius: 25px;
  height: 50px;
}

:deep(.el-input__wrapper) {
  border-radius: 25px;
}

.dhy_login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("@/assets/images/login-bg.png");
  background-size: cover;

  .dhy_login-main {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 70vh;
    width: 60vw;
    background-image: url("@/assets/images/login-main-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .dhy_login-cover {
      position: relative;
      width: 47.5%;
      height: 100%;
      color: #fff;
      background-color: transparent;
      border-radius: 12px 0 0 12px;

      .dhy_login-title {
        position: absolute;
        top: 20%;
        left: 22%;
        font-size: 32px;
      }
    }

    .dhy_login-form {
      flex: 1;
      padding: 8% 14% 8% 8%;
      border-radius: 0 12px 12px 0;
      background: transparent;

      .dhy_form-title {
        text-align: center;
        color: #3c78fd;
        font-family: "微软雅黑";
        font-weight: 700;
        text-decoration: underline 5px rgb(209, 228, 255);
        padding-bottom: 15%;
        margin: 0;
      }

      .el-input {
        height: 50px;

        input {
          height: 50px;
        }
      }

      .input-icon {
        height: 50px;
        width: 16px;
        margin-left: 10px;
      }
    }

  }
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>