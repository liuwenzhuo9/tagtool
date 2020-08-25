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
        <template v-if="!isEdit">
          <!-- 与我有关的任务 -->
          <div class = "involvedTask" v-show="menuShow[0]||menuShow[1]||menuShow[2]">
            <el-col :span="8" v-for="(item, index) in tasksinfo" :key="index" >
                      <el-card class="box-card">
                        <!-- 未完成的任务 -->
                          <div slot="header" class="clearfix" v-if="menuShow[0]">
                              <span>{{item.task_name}}</span>
                              <el-button style="float: right; padding: 3px 5px" type="text" @click="labelFun(item)">继续标注</el-button>
                              <el-button style="float: right; padding: 3px 0" type="text" @click="exitTask(item)">退出任务</el-button>
                          </div>
                          <!-- 已完成的任务 -->
                          <div slot="header" class="clearfix" v-if="menuShow[1]">
                              <span>{{item.task_name}}</span>
                              <el-button style="float: right; padding: 3px 0" type="text">任务详情</el-button>
                          </div>
                          <!-- 已发布的任务 -->
                          <div slot="header" class="clearfix" v-if="menuShow[2]">
                              <span>{{item.task_name}}</span>
                              <el-button style="float: right; padding: 3px 5px" type="text" v-if="item.sds_name" @click="editTest(item)">标记测试集</el-button>
                              <el-button style="float: right; padding: 3px 5px" type="text" v-if="item.is_finished == 0" @click="finishTask(item)">结束任务</el-button>
                              <el-button style="float: right; padding: 3px 0" type="text" @click="deleteTask(item)">删除任务</el-button>
                          </div>
                          <div class="text item">
                              发起人：{{item.leader_name}}
                          </div>
                          <div class="text item">
                              任务简介：{{item.task_intro}}
                          </div>
                          <div class="text item">
                              任务类型：{{item.task_type}}
                          </div>
                          <div class="text item">
                              任务报酬：{{item.task_reward}}（共需{{item.member_num}}人）
                          </div>
                          <div class="text item">
                              截止时间：{{item.deadline}}
                          </div>
                      </el-card>
              </el-col>
          </div>
          <!-- 发布任务界面 -->
          <div class = "issueTask" v-show="menuShow[3]">
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
                          <el-date-picker type="date" 
                                          placeholder="选择日期" 
                                          v-model="ruleForm.deadline" 
                                          style="width: 100%;"
                                          format="yyyy 年 MM 月 dd 日"
                                          value-format="yyyy-MM-dd">
                          </el-date-picker>
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
                  <el-form-item label="任务文件" prop="file_name" class="uploadPart">
                      <el-upload
                          class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :on-change="handleUploadChange"
                          :before-remove="beforeRemove"
                          :on-success="handleSuccess"
                          >
                          <el-button size="small" type="primary" >上传txt文本</el-button>
                          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                      </el-upload>
                  </el-form-item>
                  <el-form-item label="测试集文件" prop="sds_name" class="uploadPart">
                        <el-upload
                                  class="upload-demo"
                                  action="https://jsonplaceholder.typicode.com/posts/"
                                  :on-preview="handlePreviewTest"
                                  :on-remove="handleRemoveTest"
                                  :on-change="handleUploadChangeTest"
                                  :before-remove="beforeRemoveTest"
                                  :on-success="handleSuccessTest"
                                  >
                                  <el-button size="small" type="primary" >上传txt文本</el-button>
                                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                              </el-upload>
                  </el-form-item>
                  <!-- <el-form-item label="测试集结果"  class="uploadPart">
                      <el-upload
                          class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          :on-preview="handlePreviewTestRes"
                          :on-remove="handleRemoveTestRes"
                          :on-change="handleUploadChangeTestRes"
                          :before-remove="beforeRemoveTestRes"
                          :on-success="handleSuccessTestRes"
                           >
                            <el-button size="small" type="primary" >上传txt文本</el-button>
                      </el-upload>
                  </el-form-item> -->
                  <el-form-item>
                      <el-button type="primary" :disabled="uploadSuccess" @click="submitForm('ruleForm')">发布任务</el-button>
                      <el-button @click="resetForm('ruleForm')">重置</el-button>
                  </el-form-item>
              </el-form>
          </div>
          <!-- 个人信息界面 -->
          <div class="selfInfo" v-show="menuShow[4]">
            
          </div>
        </template>
        
        <template v-if="isEdit">
          <labelEdit v-if="isLabelEdit" :editInfo="editInfo" />
          <sequenceEdit v-if="isSequenceEdit" :editInfo="editInfo" />
          <labelTestEdit v-if="isLabelTestEdit" :editInfo="editInfo" />
          <sequenceTestEdit v-if="isSequenceTestEdit" :editInfo="editInfo"/>
        </template>
    </div>
    
</template>

<script>
import {insertTaskInfo, findTaskIdByTaskName, findInfoByUserAccount,findTaskById,updateTasksByUserAccount,
        insertTaskContent,updateMemberAccountByTaskId, updateJoinTasksByUserAccount,deleteTestLabelByTaskIdAndAccount,deleteLabelByTaskIdAndAccount,
        deleteTaskInfoByTaskId,deleteContentByTaskId,deleteLabelByTaskId,deleteTestLabelByTaskId,
        findAccountByAccount, updateFinishTasksByUserAccount,updateFinishStateByTaskId} from '../../unit/fetch';
import labelEdit from '../Modules/LabelAnnotation/edit';
import sequenceEdit from '../Modules/SequenceLabel/edit';
import labelTestEdit from '../Modules/LabelAnnotation/testEdit';
import sequenceTestEdit from '../Modules/SequenceLabel/testEdit';
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
            testFileName:'',
            // fileContent:'',
            splitContent:[],
            spiltTestContent:[],
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
              task_label: [
                { required: true, message: '请输入任务标签', trigger: 'change' }
              ],
              member_num: [
                { required: true, message: '请输入人数要求', trigger: 'change' }
              ],
              file_name: [
                { required: true, message: '请输入人数要求', trigger: 'change' }
              ],
            },
            tasksinfo:[],
            involvedTasksId:[],
            unfinishedTaskId:[],
            finishedTaskId:[],
            issuedTaksId:[],
            unfinishedTaskInfo:[],
            finishedInfo:[],
            issuedInfo:[],
            isEdit:false,
            isLabelEdit:false,
            isSequenceEdit:false,
            isLabelTestEdit:false,
            isSequenceTestEdit:false,
            editInfo:'',
            userAccount:this.$store.state.loginuser,
            userName:'',
            uploadSuccess:true,//判断文件是否上传成功
        }
    },
    mounted(){
        this.init();
        this.getName();
    },
    methods:{
        async init(){
            const info = await findInfoByUserAccount({account:this.userAccount});
          // 如果任务信息不为空，就将任务信息读出存入数组中
            (info.data[0].involved_tasks!=null&&info.data[0].involved_tasks!="")?this.involvedTasksId = info.data[0].involved_tasks.split(","):this.involvedTasksId =[];
            (info.data[0].progress_tasks!=null&&info.data[0].progress_tasks!="")?this.unfinishedTaskId = info.data[0].progress_tasks.split(","):this.unfinishedTaskId =[];
            (info.data[0].finished_tasks!=null&&info.data[0].finished_tasks!="")?this.finishedTaskId = info.data[0].finished_tasks.split(","):this.finishedTaskId =[];
            (info.data[0].issue_tasks!=null&&info.data[0].issue_tasks!="")?this.issuedTaksId = info.data[0].issue_tasks.split(","):this.issuedTaksId =[];
          // 获取未完成的任务信息
            if(this.unfinishedTaskId.length!=0){
              await Promise.all(this.unfinishedTaskId.map(async (item,index) => {
                if(item != null && item != '' && item != undefined ){//输入不能为空
                    const info = await findTaskById({id:item});
                    info.data.map((item) => {
                        // if(item.is_finished == 1){
                        //   this.finishedInfo.push(item)
                        // }else{
                          this.unfinishedTaskInfo.push(item);
                        // }
                        })
                    }
                }))
            };
          // 获取已完成的任务信息
            if(this.finishedTaskId.length!=0){
              await Promise.all(this.finishedTaskId.map(async (item,index) => {
                if(item != null && item != '' && item != undefined ){//输入不能为空
                    const info = await findTaskById({id:item});
                    info.data.map((item) => {
                            this.finishedInfo.push(item);
                        })
                    }
                }))
            };
          // 获取已发布的任务信息
            if(this.issuedTaksId.length!=0){
              await Promise.all(this.issuedTaksId.map(async (item,index) => {
                if(item != null && item != '' && item != undefined ){//输入不能为空
                    const info = await findTaskById({id:item});
                    info.data.map((item) => {
                            this.issuedInfo.push(item);
                        })
                    }
                }))
            };
            this.selectShowPart(1);
        },
        // 导航栏展示选择
          selectShowPart(index){
              var temp = [false, false, false, false, false];
              temp[index-1] = true;
              this.menuShow = temp;
              if(index == 1 || index == 0){
                this.tasksinfo = this.unfinishedTaskInfo
              }
              if(index == 2){
                this.tasksinfo = this.finishedInfo
              }
              if(index == 3){
                this.tasksinfo = this.issuedInfo
              }
              if(this.tasksinfo == null || this.tasksinfo == undefined || this.tasksinfo ==''){
                this.$message.warning('暂无该类型任务');  
              }
          },
          // 获取登录用户的姓名
          async getName(){
              const accInfo = this.$store.state.loginuser;
            const nameInfo = await findAccountByAccount({account:accInfo});
            this.userName = nameInfo.data.name;
          },
        // 提交表单，发布任务
          async submitForm(formName) {
            if(this.testFileName){
              // 生成测试集的随机位置
              var contentLen = this.splitContent.length;
              var testLen = this.spiltTestContent.length;
              var arr=[];
              for(var i=0; i<testLen; i++) {
                  var arrNum = parseInt(Math.random()*(contentLen+testLen));
                  var flag = true;
                  if(arr.indexOf(arrNum) != -1){
                    i--;
                    continue;
                  }else {
                    arr.push(arrNum);
                  }
              }
              arr.sort((a, b)=>{
                return a-b;
              });
              // 将任务信息插入tb_task_info中
              var info = await insertTaskInfo(
                {leader_account: this.userAccount,
                leader_name: this.$store.state.loginname,
                tfile_name: this.fileName,
                task_name: this.ruleForm.task_name,
                task_type: this.ruleForm.task_type,
                task_reward: this.ruleForm.task_reward,
                task_intro: this.ruleForm.task_intro,
                task_label: this.dynamicTags,
                member_num: this.ruleForm.member_num,
                deadline: this.ruleForm.deadline,
                sds_name: this.testFileName,//如果有上传测试集文件，则插入任务信息时，加上测试集文件名
                sds_pos: arr,
                });
            }else{
              var info = await insertTaskInfo(
                {leader_account: this.userAccount,
                leader_name: this.$store.state.loginname,
                tfile_name: this.fileName,
                task_name: this.ruleForm.task_name,
                task_type: this.ruleForm.task_type,
                task_reward: this.ruleForm.task_reward,
                task_intro: this.ruleForm.task_intro,
                task_label: this.dynamicTags,
                member_num: this.ruleForm.member_num,
                deadline: this.ruleForm.deadline,
                });
            }
            
            await this.insertContent();

            // 发布任务后，根据返回的新任务id，更新用户信息表中的任务信息
            this.issuedTaksId.push(info.data);
            this.involvedTasksId.push(info.data);
            await updateTasksByUserAccount({account:this.userAccount,
                                            issue_tasks:this.issuedTaksId.toString(),
                                            finished_tasks:this.finishedTaskId.toString(),
                                            progress_tasks:this.unfinishedTaskId.toString(),
                                            involved_tasks:this.involvedTasksId.toString()
                                          });
            this.$message.success('任务发布成功！');         
          },
        // 发布任务后将任务的段落内容存入tb_task_content中
          async insertContent(){
            var type ;
            this.ruleForm.task_type == "标签标注"? type = 1:type = 0;
            const info = await findTaskIdByTaskName({task_name:this.ruleForm.task_name})
            await Promise.all(this.splitContent.map(async (item,index) => {
                  if(item != null && item != '' && item != undefined ){//输入不能为空
                      await insertTaskContent({task_id:info.data,
                                               content:item,
                                               paragraph_position:index,
                                               task_name:this.ruleForm.task_name,
                                               is_test:0,
                                               task_type:type});
                      }
                  }));
           // 如果上传了测试集，则将测试集内容存入tb_test_content中
            if(this.spiltTestContent){
              // 将测试段落存入tb_test_content中
              await Promise.all(this.spiltTestContent.map(async (item,index) => {
                  if(item != null && item != '' && item != undefined ){//输入不能为空
                      await insertTaskContent({task_id:info.data,
                                               content:item,
                                               paragraph_position:index,
                                               task_name:this.ruleForm.task_name,
                                               is_test:1,
                                               task_type:type});
                      }
                  }))
            }
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
      handleChange(value) {
      },
      handleRemove(file, fileList) {
      },
      handlePreview(file) {
      },
      handleUploadChange(file, fileList){
          this.fileName = file.name;
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      // 上传标注文件
      handleSuccess(response, file){
            this.uploadSuccess = true;
            const reader = new FileReader();
            reader.readAsText(file.raw, "UTF-8");
            reader.onload = async e => {
                const fileString = e.target.result;
                this.splitContent =await fileString.split('\n');
                this.uploadSuccess = false;
                this.$message.success('标注文件上传成功！');
            };
      },
      handleRemoveTest(file, fileList) {
      },
      handlePreviewTest(file) {
      },
      handleUploadChangeTest(file, fileList){
          this.testFileName = file.name;
      },
      beforeRemoveTest(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      // 上传测试集文件
       handleSuccessTest(response, file){
             this.uploadSuccess = true;
            const reader = new FileReader();
            reader.readAsText(file.raw, "UTF-8");
            reader.onload = async e => {
               const fileString = e.target.result;
               this.spiltTestContent = await fileString.split('\n');
                this.uploadSuccess = false;
                this.$message.success('测试集文件上传成功！');
            };
      },
      handleRemoveTestRes(file, fileList) {
      },
      handlePreviewTestRes(file) {
      },
      handleUploadChangeTestRes(file, fileList){
      },
      beforeRemoveTestRes(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      // 切换到标记的组件
      labelFun(info){
        this.isEdit=true;
        if(info.task_type == "序列标注"){
          this.isSequenceEdit = true;
        }else{
          this.isLabelEdit = true;
        }
        this.editInfo = info;
      },
      // 退出任务
      async exitTask(info){
        this.$confirm('此操作将清空您在此任务中的所有标记记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(async () => {
                    try {
                        const taskId = info.id;
                        var memb = info.member_account.split(',');
                        memb.splice(memb.indexOf(this.userAccount),1);
                        //   更新任务信息表中的member_account字段
                        updateMemberAccountByTaskId({id:taskId, member_account:memb.toString()});
                        //   更新用户信息表中的task信息
                          const userInfo = await findInfoByUserAccount({account:this.userAccount});
                          var newInvolved = userInfo.data[0].involved_tasks.split(',');
                          newInvolved.splice(newInvolved.indexOf(taskId.toString()),1);
                          var newProgress = userInfo.data[0].progress_tasks.split(',');
                          newProgress.splice(newProgress.indexOf(taskId.toString()),1);
                          updateJoinTasksByUserAccount({account:this.userAccount,
                                                        involved_tasks:newInvolved.toString(),
                                                        progress_tasks:newProgress.toString()
                                                      });
                        // 根据任务id和用户account删除tb_label_result中的信息
                          await deleteLabelByTaskIdAndAccount({account:this.userAccount,
                                                              task_id:taskId
                                                              })
                        //   根据任务id和用户account删除tb_test_result中的信息
                          // if(info.sds_name){
                          //     await deleteTestLabelByTaskIdAndAccount({user_account:this.userAccount,
                          //                                             task_id:taskId
                          //                                             })
                          // }
                        this.$message.success('删除成功！');
                    } catch(e) {
                        this.$message.error((e && e.message) ? e.message : '删除失败，请稍后重试')
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
        
      },
      async deleteTask(info){
        this.$confirm('确认删除该任务？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(async () => {
                    try {
                        await deleteTaskInfoByTaskId({id:info.id});
                        await deleteContentByTaskId({id:info.id});
                        await deleteLabelByTaskId({task_id:info.id});
                        // if(info.sds_name!=null && info.sds_name!=''){
                        //   await deleteTestLabelByTaskId({task_id:info.id});
                        // }
                        this.$message.success('删除成功！');
                    } catch(e) {
                        this.$message.error((e && e.message) ? e.message : '请稍后重试')
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });

      },
      async finishTask(info){
        this.$confirm('确认结束该任务？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(async () => {
                    //更新每个参与用户的用户表，如果该用户还未完成该任务，也直接在任务表中将任务从progress中放到finish中
                    try{ 
                      const maccount = info.member_account.split(',')
                            await Promise.all(maccount.map(async(item,index)=>{
                              const minfo = await findInfoByUserAccount({account:item});
                              if(minfo.data[0].finished_tasks.indexOf(info.id)==-1){
                                var proTask = minfo.data[0].progress_tasks.split(',');
                                proTask.splice(proTask.indexOf(info.id.toString()),1);
                                if(minfo.data[0].finished_tasks!=null && minfo.data[0].finished_tasks!=''){
                                    var finTask = minfo.data[0].finished_tasks.split(',');
                                    finTask.push(info.id);
                                }else{
                                    var finTask = info.id;
                                };
                                await updateFinishTasksByUserAccount({account:item,
                                                                    progress_tasks:proTask.toString(),
                                                                    finished_tasks:finTask.toString()
                                                                    });
                              };
                              await updateFinishStateByTaskId({id:info.id});
                          }));
                        this.$message.success('该任务已结束！');
                    }
                    catch(e){
                        this.$message.error((e && e.message) ? e.message : '请稍后重试')
                    }
                    
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
      },
      // 任务发布者标注测试任务
      async editTest(info) {
        this.isEdit=true;
        if(info.task_type == "序列标注"){
          this.isSequenceTestEdit = true;
        }else{
          this.isLabelTestEdit = true;
        }
        this.editInfo = info;
      }
    },
    components: {
        labelEdit,
        sequenceEdit,
        labelTestEdit,
        sequenceTestEdit,
      }
}
</script>

<style scoped>
.issueTask,.involvedTask{
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
  .uploadPart{
    height: 57px;
  }
</style>