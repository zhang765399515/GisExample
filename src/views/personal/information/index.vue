<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { getUser,getUserList,updatePassword } from '@/api/user';
  let information = ref({});
  const formLabelWidth = "100px";
  const dialogFormVisible = ref(false);
  let form = reactive({
    oldPassword:'',
    newPassword:'',
    confirmPassword:''
  });
  const personalRef = ref<FormInstance>();
    const rules = reactive<FormRules>({
        oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPassword:[
          { required: true, message: '请再次输入密码', trigger: 'blur' },
        ]
    })
    const isPasswordMatch = computed(() => {
      return form.newPassword === form.confirmPassword;
    });

  onMounted(()=>{
    const getList = () => {
      getUser().then(res => {
        getUserList({username:res.data.name}).then(data =>{
          information.value = data.data[0];
        })
      });
    };
    getList();
  })
  const closeDialog=()=>{
  }
  const reset = ()=>{
    dialogFormVisible.value = true;
  }
  const save = async () => {
  if (!personalRef) return
  if (!isPasswordMatch.value) {
    ElMessage.error('新密码和确认密码不一致！');
    return;
  }
  await personalRef.value?.validate((valid, fields) => {
    if (valid) {
      updatePassword(form).then(res =>{
        if(res.code == 200){
            ElMessage.success(res.msg);
            cancel();
        }else{
            ElMessage.error(res.msg);
        }
      })
    }
  })
}
const cancel =() =>{
    dialogFormVisible.value = false;
    form = reactive({
      oldPassword:'',
      newPassword:''
    })
}
</script>
<template>
  <div class="personal">
    <el-descriptions class="margin-top personal-content" title="用户信息" :column="1" size="Large" border>
      <el-descriptions-item label="用户名称">{{ information.username }}</el-descriptions-item>
      <el-descriptions-item label="别名">{{ information.nickName || '/' }}</el-descriptions-item>
      <el-descriptions-item label="电话号码">{{ information.phone || '/' }}</el-descriptions-item>
      <el-descriptions-item label="用户状态">
        <el-button v-if="information.status == 1" type="success" plain>正常</el-button>
        <el-button v-else type="danger" plain>禁止</el-button>
      </el-descriptions-item>
    </el-descriptions>
    <el-dialog v-model="dialogFormVisible" title="重置密码" width="500" @close="cancel">
      <el-form ref="personalRef" :rules="rules" :model="form">
          <el-form-item label="旧密码：" prop="oldPassword" :label-width="formLabelWidth">
              <el-input v-model="form.oldPassword" type="password" autocomplete="off"  show-password/>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword" :label-width="formLabelWidth">
              <el-input v-model="form.newPassword" type="password" autocomplete="off"  show-password/>
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword" :label-width="formLabelWidth">
              <el-input v-model="form.confirmPassword" type="password" autocomplete="off"  show-password/>
          </el-form-item>
      </el-form>
      <template #footer>
          <div class="dialog-footer">
              <el-button @click="save(personalRef)">确认</el-button>
              <el-button type="primary" @click="cancel">取消</el-button>
          </div>
      </template>
  </el-dialog>
  </div>
</template>
<style  lang="scss" scoped>
.reset-btn{
  margin-top: 20px;
}
</style>