<script lang="ts" setup>
import { addMenu,loadFile,modifyMenu } from "@/api/user";
const props = defineProps<{
    dialogFormVisible: Boolean,
    treeList:Array<any>,
    editData:Record<string, any>
}>();
const emit= defineEmits(['update:dialogFormVisible','childList']);
let form = reactive(props.editData.list);
const formLabelWidth = "80px";
const menuValue = ref();
const treeRef = ref();
const menuRef = ref(null);
const defaultProps = reactive({
    children: 'children',
    label: 'cataName',
})
const disabled = ref(false);
const save = () => {
    delete form.menu;
    if(props.editData.type == 1){
        addMenu(form).then(res =>{
            if(res.code == 200){
                ElMessage.success('新增成功！');
                emit('childList',{});
                cancel();
                form = reactive(
                    {
                        cataName: '',
                        level:null,
                        cataUrl:"",
                        coverUrl:"",
                        isSub:1,
                        isVisible:1,
                        sort:null
                    }
                );
            }
        })
    }else{
        modifyMenu(form).then(res =>{
            if(res.code == 200){
                ElMessage.success('修改成功！');
                emit('childList',{});
                cancel();
            }
        })
    }
}
const handleExceedFn = () => {
  ElMessage({ type: 'error', message: '只能上传一个附件！' })
}
const beforeRemoveFn = (file: any) => {
    disabled.value = true;
}
const uploadFileFn = (val: any) => {
  const formData = new FormData()
  formData.append('file', val.file)
  loadFile(formData).then((res: any) => {
    if(res.code == 200){
        form.coverUrl = res.msg;
        disabled.value = true;
    }
  })
}
const cancel = () => {
    emit('update:dialogFormVisible',false);
    // Object.assign(form, {
    //     cataName: '',
    //     level:null,
    //     cataUrl:"",
    //     coverUrl:"",
    //     isSub:1,
    //     isVisible:1,
    //     sort:null
    // });
    // menuValue.value = ''
}
const handleNodeClick = (data)=>{
    form.parentId = data.id;
}
const closeDialog=()=>{
    cancel()
}
watch(props.editData, (newV: number, oldV: number) => {
    if(newV.list){
        form = reactive(newV.list)
        // menuValue.value = form.cataName
    }
},{
    deep: true,
    immediate:true
})
</script>

<template>
    <el-dialog v-model="props.dialogFormVisible" title="新增菜单" width="500" @close="closeDialog">
        <el-form ref="menuRef" :model="form">
            <el-form-item label="菜单类型" :label-width="formLabelWidth">
                <el-select v-model="form.isSub" placeholder="">
                    <el-option label="目录" :value="1" />
                    <el-option label="菜单" :value="0" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="上级菜单" :label-width="formLabelWidth">
                <el-select v-model="form.menu" placeholder="">
                    <el-option v-for="(item,index) in menuData" :key="index" :label="item." :value="1" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="上级菜单">
                <el-tree-select
                    v-model="form.menuValue"
                    :data="props.editData.treeList"
                    node-key="id"
                    placeholder="请选择数据"
                    clearable 
                    ref="treeRef"
                    :check-strictly="true"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                />
              </el-form-item>
            <el-form-item label="菜单名称" :label-width="formLabelWidth">
                <el-input v-model="form.cataName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="层级" :label-width="formLabelWidth">
                <el-input v-model="form.level" autocomplete="off" />
            </el-form-item>
            <el-form-item label="排序" :label-width="formLabelWidth">
                <el-input v-model="form.sort" autocomplete="off" />
            </el-form-item>
            <el-form-item v-if="form.isSub == 0" label="封面" :label-width="formLabelWidth">
                <!-- <el-input v-model="form.coverUrl" autocomplete="off" /> -->
                <el-upload
                    :limit="1"
                    action=""
                    :multiple="false"
                    list-type="picture-card"
                    :http-request="uploadFileFn"
                    :on-success="onSuccess"
                    :on-exceed="handleExceedFn"
                    :before-remove="beforeRemoveFn"
                >
                <img v-if="!disabled" :src="form.coverUrl" class="avatar" style="width:100%" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item v-if="form.isSub == 0" label="页面路径" :label-width="formLabelWidth">
                <el-input v-model="form.cataUrl" autocomplete="off" />
            </el-form-item>
            <el-form-item v-if="form.isSub == 0" label="路由出口" :label-width="formLabelWidth">
                <el-input v-model="form.path" autocomplete="off" />
            </el-form-item>
            <el-form-item label="是否可见" :label-width="formLabelWidth">
                <el-select v-model="form.isVisible" placeholder="">
                    <el-option label="可见" :value="1" />
                    <el-option label="不可见" :value="0" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="save">确认</el-button>
                <el-button type="primary" @click="cancel">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>