<template>
    <div>
         <div class = "sideNav">
            <el-col :span="4">
                <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                @select="selectShowPart">
                <el-submenu index="1">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>我的任务</span>
                    </template>
                    <el-menu-item-group>
                    <!-- <template slot="title">分组一</template> -->
                    <el-menu-item index="1">未完成的任务</el-menu-item>
                    <el-menu-item index="2">已完成的任务</el-menu-item>
                    <el-menu-item index="3">已发布的任务</el-menu-item>
                    </el-menu-item-group>
                 </el-submenu>
                <el-menu-item index="4">
                    <i class="el-icon-menu"></i>
                    <span slot="title">发布任务</span>
                </el-menu-item>
                <el-menu-item index="5">
                    <i class="el-icon-document"></i>
                    <span slot="title">个人信息</span>
                </el-menu-item>
                </el-menu>
            </el-col>
        </div>
        <!-- 发布任务界面 -->
        <div class = "issueTask" v-show="menuShow[4]">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="任务名称" prop="task_name" required>
                    <el-input v-model="ruleForm.task_name"></el-input>
                </el-form-item>
                <el-form-item label="任务类型" prop="task_type" required>
                    <el-radio-group v-model="ruleForm.task_type">
                    <el-radio label="序列标注"></el-radio>
                    <el-radio label="标签标注"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="任务报酬" prop="task_reward" required>
                    <el-input v-model="ruleForm.task_reward"></el-input>
                </el-form-item>
                <el-form-item label="任务简介" prop="task_intro" required>
                    <el-input v-model="ruleForm.task_intro"></el-input>
                </el-form-item>
                <el-form-item label="截止时间" required>
                    <el-col :span="11">
                    <el-form-item prop="deadline">
                        <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.deadline" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="设置标签" required>
                    <el-tag
                        :key="tag"
                        v-for="tag in dynamicTags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Label</el-button>
                </el-form-item>
                <el-form-item label="所需人数" prop="member_num" required>
                    <el-input-number v-model="ruleForm.member_num" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
                </el-form-item>
                <el-form-item label="任务文件" prop="file_name" >
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-change="handleUploadChange"
                        :before-remove="beforeRemove"
                        >
                        <el-button size="small" type="primary" >点击上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">发布任务</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {insertTaskInfo} from '../../unit/fetch';
export default {
    data(){
        return{
            menuShow: [true, false, false, false, false],
            ruleForm: {
                        task_name: '',
                        task_type: '',
                        task_reward: '',
                        task_intro: '',
                        deadline:'',
                        member_num: '',
                        file_name:''
                    },
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            num: 1,
            fileName:'',
            rules: {
              task_name: [
                { required: true, message: '请输入任务名称', trigger: 'blur' },
              ],
              task_type: [
                { required: true, message: '请选择任务类型', trigger: 'change' }
              ],
              task_intro: [
                { required: true, message: '请输入任务报酬', trigger: 'change' }
              ],
              deadline: [
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ],
              task_reward: [
                { required: true, message: '请输入任务报酬', trigger: 'change' }
              ],
              task_lable: [
                { required: true, message: '请输入任务标签', trigger: 'change' }
              ],
              member_num: [
                { required: true, message: '请输入人数要求', trigger: 'change' }
              ]
            },
        }
    },
    methods:{
        selectShowPart(index){
            var temp = [false, false, false, false, false]
            temp[index] = true
            this.menuShow = temp
        },
        async submitForm(formName) {
          await insertTaskInfo(
            {leader_account:this.$store.state.loginuser,
            leader_name:this.$store.state.loginname,
            tfile_name:this.fileName,
            task_name:this.ruleForm.task_name,
            task_type:this.ruleForm.task_type,
            task_reward:this.ruleForm.task_reward,
            task_intro:this.ruleForm.task_intro,
            task_lable:this.dynamicTags,
            member_num:this.ruleForm.member_num,
            deadline:this.ruleForm.deadline,
            });


            // this.$refs[formName].validate((valid) => {
            // if (valid) {
            //     alert('submit!');
            // } else {
            //     console.log('error submit!!');
            //     return false;
            // }
            // });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
    //   人数
      handleChange(value) {
        // console.log(value);
      },
      showFile(file){
        // console.log(file)
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      handlePreview(file) {
        // console.log(111)
        // console.log(file);
        // console.log(222)
      },
      handleUploadChange(file, fileList){
console.log(file)
          this.fileName = file.name;
          console.log(this.fileName)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    } 
}
</script>

<style scoped>
.issueTask{
    margin: 0px 0px 0px 220px;
} 
.el-form-item {
    margin-bottom: 22px;
    height: 25px;
}
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>