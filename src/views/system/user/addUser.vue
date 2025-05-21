<script lang="ts" setup>
import { addUser,modifyUser } from "@/api/user";
import { FormRules, FormInstance } from 'element-plus'
const props = defineProps<{
    dialogFormVisible: Boolean,
    editData:Record<string, any>
}>();
const emit= defineEmits(['update:dialogFormVisible','childList']);
const ruleFormRef = ref<FormInstance>();
let form = reactive({
    username: '',
    password: '',
    nickName: '',
    phone: '',
    status: 1,
  });
const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入用户名称！', trigger: 'blur' },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})
const formLabelWidth = "80px";
const save = async () => {
  if (!ruleFormRef) return
  await ruleFormRef.value?.validate((valid, fields) => {
    if (valid) {
        if(props.editData.type == 1){
            addUser(form).then(res =>{
                if(res.code == 200){
                    ElMessage.success('新增成功！');
                    emit('childList',{});
                    cancel();
                    form = reactive(
                        {
                            username: '',
                            password: '',
                            nickName: '',
                            phone: '',
                            status: 1,
                        }
                    );
                }
            })
        }else{
            delete form.createTime;
            delete form.password;
            modifyUser(form).then(res =>{
            if(res.code == 200){
                ElMessage.success('修改成功！');
                emit('childList',{});
                cancel();
            }
        })
        }
    }
  })
}
const cancel = () => {
    emit('update:dialogFormVisible',false);
}
const handleNodeClick = (data)=>{
    form.parentId = data.id;
}
const closeDialog=()=>{
    cancel()
}
watch(props.editData, (newV, oldV) => {
    if(newV.list){
        form = reactive(newV.list)
    }
},{
    deep: true,
    immediate:true
})
</script>

<template>
    <el-dialog v-model="props.dialogFormVisible" title="新增用户" width="500" @close="closeDialog">
        <el-form ref="ruleFormRef" :model="form" :rules="rules" status-icon>
            <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth">
                <el-input v-model="form.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password :disabled="props.editData.type == 2"/>
            </el-form-item>
            <el-form-item label="别名" prop="nickName" :label-width="formLabelWidth">
                <el-input v-model="form.nickName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="电话号码" prop="phone" :label-width="formLabelWidth">
                <el-input v-model="form.phone" :maxlength="11" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户状态" prop="status" :label-width="formLabelWidth">
                <el-select v-model="form.status" placeholder="">
                    <el-option label="正常" :value="1" />
                    <el-option label="禁止" :value="0" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="save(ruleFormRef)">确认</el-button>
                <el-button type="primary" @click="cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>