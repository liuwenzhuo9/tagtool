<template>
    <div>
        <el-form ref="form" label-width="80px">
            <el-form-item label="参与用户">
                <el-table
                    :data="joinUserData"
                    height="350"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="name"
                    label="用户名"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="power"
                    label="标注能力"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="rate"
                    label="标注进度">
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="推荐用户">
                <el-table
                    :data="inviteUserData"
                    height="350"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="用户名"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="power"
                        label="标注能力"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="rate"
                        label="历史完成度">
                    </el-table-column>
                    <el-table-column
                        prop="nums"
                        label="已完成任务数">
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.state == 0" @click="inviteUser(scope.row)" type="text" size="small">邀请</el-button>
                        <el-button v-if="scope.row.state == 1" type="text" disabled size="small">等待用户接受</el-button>
                        <el-button v-if="scope.row.state == 2" type="text" disabled size="small">用户已拒绝</el-button>
                        <el-button v-if="scope.row.state == 3" type="text" disabled size="small">用户已加入</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>    
    </div>
</template>

<script>
    import { findInfoByUserAccount, findParagraphNumByTaskId, findFinishParagraphNumByTaskId, findTopUserOnLabelType, insertInviteInfo,findInviteInfoByInviteeAndTaskId } from '../../../unit/fetch';
    export default {
        props: {
            editInfo: Object,
            selectShowPart: Function
        },
        data() {
            return {
                joinUserData: [],
                inviteUserData: [],
                inviteInfo: ["power_s", "power_l1", "power_l2", "power_l3"],
                userAccount: this.editInfo.member_account.split(','),
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            async init() {
                this.joinUserData = [];
                for(var i = 0; i < this.userAccount.length; i++){
                    const userInfo = await findInfoByUserAccount({account: this.userAccount[i]});
                    // console.log(userInfo.data[0]);
                    const tagRate = await this.getRate(this.userAccount[i]);
                    const powerType = [userInfo.data[0].power_s, userInfo.data[0].power_l1, userInfo.data[0].power_l2, userInfo.data[0].power_l3];
                    this.joinUserData.push({name: userInfo.data[0].name, 
                                            power: powerType[this.editInfo.task_type],
                                            rate: tagRate, 
                                            account: userInfo.data[0].account});
                }
                this.initInviteUserData();
            },
            async initInviteUserData(){
                this.inviteUserData = [];
                var inviteInfo = await findTopUserOnLabelType({type: this.inviteInfo[this.editInfo.task_type]});
                // inviteUserData增加一个用户状态属性state，若为0，则表示该用户未加入任务且未被邀请，若为1，则表示该用户已被邀请且待定，
                // 若为2，则表示该用户已被邀请且拒绝，若为3，则表示该用户已加入该任务
                for(var i = 0; i<inviteInfo.data.length; i++){
                    var userState = 0;
                    const iAccount = inviteInfo.data[i].account;
                    if(this.userAccount.indexOf(iAccount) != -1){
                        userState = 3;
                    }else{
                        const inviteeInfo = await findInviteInfoByInviteeAndTaskId({invitee: iAccount, task_id: this.editInfo.id});
                        if(inviteeInfo.data.length == 1){
                            if(inviteeInfo.data[0].is_join == 0){
                                userState = 1;
                            }else if(inviteeInfo.data[0].is_join == 2){
                                userState = 2;
                            }
                        }
                    }
                    var finishNums = inviteInfo.data[i].finished_tasks.split(',').length;
                    const powerTypeArr = [inviteInfo.data[i].power_s, inviteInfo.data[i].power_l1, inviteInfo.data[i].power_l2, inviteInfo.data[i].power_l3];
                    this.inviteUserData.push({name: inviteInfo.data[i].name, 
                                              power: powerTypeArr[this.editInfo.task_type], 
                                              rate: inviteInfo.data[i].complete_rate, 
                                              account: iAccount, 
                                              nums: finishNums,
                                              state: userState});
                }
            },
            onSubmit() {
                console.log('submit!');
            },
            async getRate(account){
                // 获取所有段落数
                const infoA = await findParagraphNumByTaskId({task_id:this.editInfo.id, is_test:1});
                const infoB = await findParagraphNumByTaskId({task_id:this.editInfo.id, is_test:0});
                const total = infoA.data + infoB.data;
                // 获取所有完成的段落数
                const infoF = await findFinishParagraphNumByTaskId({task_id:this.editInfo.id,user_account:account});
                const finishNum = infoF.data;
                return finishNum + '/' + total;
            },
            async inviteUser(row) {
                await insertInviteInfo({invitee: row.account, 
                                        inviter: this.editInfo.leader_account, 
                                        task_id: this.editInfo.id,
                                        task_type: this.editInfo.task_type,
                                        is_join: 0,
                                        power: row.power});
                this.$message.success('成功邀请！');
                this.initInviteUserData();
            }
        }
    };
</script>

<style lang='scss'>
    
</style>