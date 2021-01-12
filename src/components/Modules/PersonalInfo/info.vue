<template>
    <div>
        <div v-if="!isRePassword">
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form  label-width="80px">
                        <el-form-item label="个人信息:">
                            <el-table
                                :data="selfInfoData"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                prop="name"
                                label="用户名"
                                width="100">
                                </el-table-column>
                                <el-table-column
                                prop="points"
                                label="积分"
                                width="100">
                                </el-table-column>
                                <el-table-column
                                prop="power_s"
                                label="序列标注能力">
                                </el-table-column>
                                <el-table-column
                                prop="power_l1"
                                label="单标签标注能力">
                                </el-table-column>
                                <el-table-column
                                prop="power_l2"
                                label="量级标签标注能力">
                                </el-table-column>
                                <el-table-column
                                prop="power_l3"
                                label="多层次标签标注能力">
                                </el-table-column>
                                <el-table-column
                                prop="complete_rate"
                                label="综合完成率">
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-divider></el-divider>
                        <el-form-item label="积分变动:">
                            <el-table
                                :data="pointsData"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                prop="operation_type"
                                label="操作方式"
                                width="220">
                                </el-table-column>
                                <el-table-column
                                prop="task_name"
                                label="任务名称"
                                width="220">
                                </el-table-column>
                                <el-table-column
                                prop="points"
                                label="积分变动"
                                width="220">
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-divider></el-divider>
                        <el-form-item label="标记能力:">
                            <el-table
                                :data="powerData"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                prop="task_name"
                                label="任务名称"
                                width="180">
                                </el-table-column>
                                <el-table-column
                                prop="task_type"
                                label="任务类型"
                                width="180">
                                </el-table-column>
                                <el-table-column
                                prop="power"
                                label="标注能力">
                                </el-table-column>
                                <el-table-column
                                prop="rate"
                                label="完成率">
                                </el-table-column>
                                <el-table-column
                                prop="points"
                                label="获得积分">
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4">
                     <el-button type="info" round @click="toRePassWord('form')">修改密码</el-button>
                </el-col>
            </el-row>
        </div>
        
        <rePassword v-if="isRePassword" />
    </div>
    
</template>

<script>
    import {findAccountByAccount, findInfoByUserAccount, findPointsByAccount, findTaskById} from '../../../unit/fetch';
    import rePassword from '../../PersonalCenter/password';
    export default {
        props: {
            selectShowPart: Function
        },
        data() {
            return {
                isRePassword: false,
                userAccount: this.$store.state.loginuser,
                userName: '',
                selfInfoData: [],
                pointsData: [],
                powerData: [],
                typeName: ['序列标注', '单标签标注', '量级标签标注', '多层次标签标注'],
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            async init(){
                const accountInfo = await findAccountByAccount({account:this.userAccount});
                this.userName = accountInfo.data.name;
                const selfInfo = await findInfoByUserAccount({account:this.userAccount});
                //初始化个人信息表
                this.selfInfoData = selfInfo.data;
                //初始化积分变动记录表
                const pointsInfo1 = await findPointsByAccount({account:this.userAccount, operation_type: 1});
                const pointsInfo2 = await findPointsByAccount({account:this.userAccount, operation_type: 2});
                const pointsInfo3 = await findPointsByAccount({account:this.userAccount, operation_type: 3});
                for(var i = 0; i<pointsInfo1.data.length; i++){
                    const nameInfo = await findTaskById({id: pointsInfo1.data[i].task_id});
                    this.pointsData.push({operation_type: '参与任务', task_name: nameInfo.data[0].task_name, points: '+' + pointsInfo1.data[i].points});
                }
                for(var i = 0; i<pointsInfo2.data.length; i++){
                    const nameInfo = await findTaskById({id: pointsInfo2.data[i].task_id});
                    this.pointsData.push({operation_type: '发布任务', task_name: nameInfo.data[0].task_name, points: '-' + pointsInfo2.data[i].points});
                }
                for(var i = 0; i<pointsInfo3.data.length; i++){
                    const nameInfo = await findTaskById({id: pointsInfo3.data[i].task_id});
                    this.pointsData.push({operation_type: '下载标注结果', task_name: nameInfo.data[0].task_name, points: '-' + pointsInfo3.data[i].points});
                }
                //初始化标记能力统计表
                const powerInfo = pointsInfo1;
                 for(var i = 0; i<powerInfo.data.length; i++){
                    const nameInfo = await findTaskById({id: powerInfo.data[i].task_id});
                    this.powerData.push({task_name: nameInfo.data[0].task_name, 
                                            task_type: this.typeName[nameInfo.data[0].task_type], 
                                            power: powerInfo.data[i].power, 
                                            points: powerInfo.data[i].points,
                                            rate: powerInfo.data[i].complete_rate});
                }
            },
            toRePassWord(){
                this.isRePassword = true;
            },
        },
        components: {
            rePassword,
        }
    };
</script>

<style lang='scss'>
    .el-row {
        margin-bottom: 20px;
        &:last-child {
        margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    .el-form-item {
        margin-bottom: 55px;
    }
</style>