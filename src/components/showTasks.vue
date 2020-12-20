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
                <el-menu-item index="4">
                    <i class="el-icon-document"></i>
                    <span slot="title">受邀任务</span>
                </el-menu-item>
                </el-menu>
            </el-col>
        </div>
        <div class = "taskInfo">
                <el-col :span="8" v-for="(item, index) in tasksinfo" :key="index" >
                    <el-card class="box-card">
                        <div slot="header" class="clearfix" v-if="!isInvite">
                            <span>{{item.task_name}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" v-if="loginUserAccount && isJoin[index]=='notIn'" @click="joinTask(item, index)">加入任务</el-button>
                            <el-button style="float: right; padding: 3px 0" type="text" v-if="loginUserAccount && isJoin[index]!='notIn'" :disabled="true">我的任务</el-button>
                        </div>
                        <div slot="header" class="clearfix" v-if="isInvite">
                            <span>{{item.task_name}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" v-if="inviteState[index]==0" @click="joinTask(item, index)">加入任务</el-button>
                            <el-button style="float: right; padding: 3px 0" type="text" v-if="inviteState[index]==0" @click="refuseInvite(item, index)">拒绝加入</el-button>
                            <el-button style="float: right; padding: 3px 0" type="text" v-if="inviteState[index]==1" :disabled="true">我的任务</el-button>
                            <el-button style="float: right; padding: 3px 0" type="text" v-if="inviteState[index]==2" :disabled="true">已拒绝</el-button>
                        </div>
                        <div class="text item">
                            <span style="color:#b9adad">发起人：</span>{{item.leader_name}}
                        </div>
                        <div class="text item" v-if="isInvite">
                            <span style="color:#b9adad">任务类型：</span>{{typeName[item.task_type]}}
                        </div>
                        <div class="text item">
                            <span style="color:#b9adad">任务简介：</span>{{item.task_intro}}
                        </div>
                        <div class="text item">
                            <span style="color:#b9adad">任务报酬：</span>{{item.task_reward}}（共需{{item.member_num}}人）
                        </div>
                        <div class="text item">
                            <span style="color:#b9adad">截止时间：</span>{{item.deadline}}
                        </div>
                    </el-card>
                </el-col>
        </div>
    </div>
</template>

<script>
import {findUnfinishedTasks, findTasksByTasksType,findTaskById,updateMemberAccountByTaskId,findInfoByUserAccount,updateJoinTasksByUserAccount,
        findContentByTaskId,insertLabelResult, insertLabelTime, insertUserPoints, findInviteInfoByInvitee,updateIsJoinByInviteeAndTaskId}from '../unit/fetch';
export default {
    data(){
        return{
            tasksinfo:[],
            isJoin:[],//判断用户是否加入或发布该任务
            inviteState: [],//记录被邀请用户的is_join状态
            loginUserAccount:'',
            // loginUserName:this.$store.state.loginname,
            istest:true,
            isInvite: false,
            typeName: ["序列标注","单标签标注","量级标签标注","多层次标签标注"],
        }
    },
    mounted(){
        this.findAllTasks();
        this.$store.commit('setActiveIndex',0);
        if(this.$store.state.loginuser){
            this.loginUserAccount = this.$store.state.loginuser;
        }
    },
    methods: {
      selectShowPart(index) {
          this.isInvite = false;
          this.tasksinfo = [];
          if(index == 1){
              this.findAllTasks();
          }else if(index == 2){
              this.findTasksByType(0);
          }else if(index == 3){
              this.findTasksByType(1);
          }else{
              this.findInvitedTasks();
              this.isInvite = true;
          }
      },
      async findAllTasks(){
            const lastTasksinfo = this.tasksinfo;
                try{
                    this.tasksinfo = [];
                    const info = await findUnfinishedTasks();
                    info.data.map((item) => {
                            this.tasksinfo.push(item);
                            if(this.loginUserAccount){
                                if(item.leader_account == this.loginUserAccount){
                                    this.isJoin.push("leader");
                                }else if(item.member_account){
                                    const memb = item.member_account.split(',');
                                    if(memb.indexOf(this.loginUserAccount) != -1){
                                        this.isJoin.push("member");
                                    }else{
                                        this.isJoin.push("notIn");
                                    }
                                }else{
                                    this.isJoin.push("notIn");
                                }
                            }
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
      async findInvitedTasks(){
          const inviteInfo = await findInviteInfoByInvitee({invitee:this.loginUserAccount});
          this.inviteState = [];
          this.tasksinfo = [];
          inviteInfo.data.map(async (item) => {
              const info = await findTaskById({id: item.task_id});
              console.log(info.data[0])
              this.tasksinfo.push(info.data[0]);
              this.inviteState.push(item.is_join);
          })
      },
      async joinTask(info,index){
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
          var taskType = info.task_type;
        // 更新tb_label_result
          const taskContentInfo = await findContentByTaskId({task_id:info.id, is_test:0});
          const testContentInfo = await findContentByTaskId({task_id:info.id, is_test:1});
          var taskArr = Array.from(taskContentInfo.data);
          var sds = [];
          if(info.sds_name != null){
              const testArr = Array.from(testContentInfo.data);
              sds = info.sds_pos.split(',');
              var len = sds.length;
              for(var i = 0; i<len; i++){
                    taskArr.splice(sds[i],0,testArr[i]);
                }
          }
          taskArr.map((item, index) => {
              var istest = 0;
              if(info.sds_name != null && sds.indexOf(index.toString())!=-1){
                istest = 1;
              }
              insertLabelResult({task_id:info.id,
                                paragraph_id:item.id,
                                paragraph_position:index,
                                user_account:this.loginUserAccount,
                                task_type:taskType,
                                is_test: istest})
          });
        // 更新tb_time
        insertLabelTime({account:this.loginUserAccount,
                         task_id:info.id,
                         use_time:0,
                         is_finish:0});
        // 更新tb_user_points，将用户账号、任务类型、积分操作类型
        insertUserPoints({account: this.loginUserAccount,task_id: info.id,task_type: info.task_type,operation_type: 1});
        if(this.isInvite){
            this.$set(this.inviteState, index, 1);
            await updateIsJoinByInviteeAndTaskId({task_id: info.id, invitee: this.loginUserAccount, is_join: 1});
        }else{
            this.$set(this.isJoin, index, 'member');
        }
        this.$message({
          duration:600,
          message:'加入成功！',
          type: 'success'
        });
      },
      async refuseInvite(info, index){
          
          this.$set(this.inviteState, index, 2);
          await updateIsJoinByInviteeAndTaskId({task_id: info.id, invitee: this.loginUserAccount, is_join: 2});
      }
    }
}
</script>

<style scoped>
.taskInfo{
    width: 82%;
    float: right;
}
.el-card{
    height: 223px;
  }
</style>