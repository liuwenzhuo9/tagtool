<template>
    <div class="showTasks">
        <div class = "sideNav">
            <el-col :span="4">
                <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                @select="selectShowPart">
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">全部任务</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-tickets"></i>
                    <span slot="title">序列标注任务</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-document"></i>
                    <span slot="title">标签标注任务</span>
                </el-menu-item>
                </el-menu>
            </el-col>
        </div>
        <div class = "taskInfo">
                <el-col :span="8" v-for="(item, index) in tasksinfo" :key="index" >
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>{{item.task_name}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="joinTask(item)">加入任务</el-button>
                        </div>
                        <div class="text item">
                            发起人：{{item.leader_name}}
                        </div>
                        <div class="text item">
                            任务简介：{{item.task_intro}}
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
    </div>
</template>

<script>
import {findUnfinishedTasks, findTasksByTasksType,findTaskById,updateMemberAccountByTaskId,findInfoByUserAccount,updateJoinTasksByUserAccount,
        findContentByTaskId,insertLabelResult, findTestContentByTaskId, insertTestRes}from '../unit/fetch';
export default {
    data(){
        return{
            tasksinfo:[],
            loginUserAccount:this.$store.state.loginuser,
        }
    },
    mounted(){
        this.findAllTasks();
        this.$store.commit('setActiveIndex',0);
    },
    methods: {
      selectShowPart(index) {
          this.tasksinfo = [];
          if(index == 1){
              this.findAllTasks();
          }else if(index == 2){
              this.findTasksByType("序列标注");
          }else{
              this.findTasksByType("标签标注");
          }   
      },
      async findAllTasks(){
            const lastTasksinfo = this.tasksinfo;
                try{
                    this.tasksinfo = [];
                    const info = await findUnfinishedTasks();
                    info.data.map((item) => {
                            this.tasksinfo.push(item)
                        })
                }catch(e){
                    this.tasksinfo = [...lastTasksinfo];
                    this.$message.error((e && e.message) ? e.message : '获取任务错误，请稍后重试');
                }
      },
      async findTasksByType(type){
            const lastTasksinfo = this.tasksinfo;
                try{
                    this.tasksinfo = [];
                    const info = await findTasksByTasksType({task_type:type});
                    info.data.map((item) => {
                            this.tasksinfo.push(item)
                        })
                }catch(e){
                    this.tasksinfo = [...lastTasksinfo];
                    this.$message.error((e && e.message) ? e.message : '获取任务错误，请稍后重试');
                }
      },
      async joinTask(info){
          var newMember = info.member_account;
          newMember != null && newMember != "" ? newMember = newMember + ','+ this.loginUserAccount : newMember = this.loginUserAccount;
        //   更新任务信息表中的member_account字段
          updateMemberAccountByTaskId({id:info.id, member_account:newMember});
        //   更新用户信息表中的task信息
          const userInfo = await findInfoByUserAccount({account:this.loginUserAccount});
          var newInvolved = userInfo.data[0].involved_tasks;
          var newProgress = userInfo.data[0].progress_tasks;
          newInvolved != null && newInvolved != "" ? newInvolved = newInvolved + ','+ info.id : newInvolved = info.id;
          newProgress != null && newProgress != "" ? newProgress = newProgress + ','+ info.id : newProgress = info.id;
          updateJoinTasksByUserAccount({account:this.loginUserAccount,
                                    involved_tasks:newInvolved,
                                    progress_tasks:newProgress});
          var taskType = '';
          info.task_type == "序列标注"? taskType = 0 : taskType = 1;
        // 更新tb_label_result
          const taskContentInfo = await findContentByTaskId({task_id:info.id});
          await Promise.all(taskContentInfo.data.map((item) => {
              insertLabelResult({task_id:info.id,
                                paragraph_id:item.id,
                                paragraph_position:item.paragraph_position,
                                user_account:this.loginUserAccount,
                                task_type:taskType})
          }));
        //   更新tb_test_result
          const testContentInfo = await findTestContentByTaskId({task_id:info.id});
          if(testContentInfo){
              await Promise.all(testContentInfo.data.map((item) => {
              insertTestRes({task_id:info.id,
                                paragraph_id:item.id,
                                paragraph_position:item.paragraph_position,
                                user_account:this.loginUserAccount,
                                task_type:taskType})
          }));
          }
      },
    },
}
</script>

<style scoped>
.taskInfo{
    width: 82%;
    float: right;
}
</style>