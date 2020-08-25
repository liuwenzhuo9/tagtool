<template>
    <div class="labelAnnotation">
             <div class="content-title">
                <p >任务名：{{editInfo.task_name}}</p>
                <p >进度：{{this.finishParagraphNum}}/{{this.allParagraphNum}}</p>
            </div>
            <div class="content-left">
                <p>第{{this.contentPosition+1}}段:</p>
                <div class="paragraphContent">
                    {{this.contentInfo}}
                </div>
                <p>可选标签：</p>
                <el-radio :key="index" v-for="(item,index) in labelsInfo" @change="chooseLabel" v-model="radio" :label="item">{{item}}</el-radio>
                <el-button @click="saveLabel" v-if="isEdit">保存标签</el-button>
                <el-button @click="saveLabel" v-if="!isEdit">修改标签</el-button>
                <div>
                    <el-button @click="nextParagraph()">下一句</el-button>
                    <el-button @click="lastParagraph()">上一句</el-button>
                </div>
            </div>
            <div class="content-right">
                <p>标注结果：{{this.resultLabel}}</p>
            </div>
            <el-button v-if="this.finishParagraphNum == this.allParagraphNum" @click="finishTask">提交任务</el-button>
        
    </div>
</template>

<script>
    import { findParagraphNumByTaskId, findFinishParagraphNumByTaskId,findFirstUnfinishedParagraph, updateLabelById,
            findLastUnfinishedParagraph,findNextUnfinishedParagraph, findFirstUnfinishedTestParagraph,findInfoByUserAccount,updateFinishTasksByUserAccount} from '../../../unit/fetch';
    import testEdit from './testEdit';
    export default {
        props: {
            editInfo: Object,
        },
        data() {
            return {
                allParagraphNum:'',
                finishParagraphNum:'',
                userAccount:this.$store.state.loginuser,
                contentInfo:'',
                contentPosition:'',
                labelsInfo:this.editInfo.task_label.split(','),
                choosedLabel:'',
                resultLabel:'',
                resultId:'',
                radio: '1',
                isEdit : true,
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            async init(){
                this.getRate();
                // 获取第一条未被标记的段落id
                const info = await findFirstUnfinishedParagraph({task_id:this.editInfo.id,user_account:this.userAccount});
                
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
            },
            async finishTask(){
                this.$confirm('确认提交该任务的标注结果？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(async () => {
                    try {
                        const info = await findInfoByUserAccount({account:this.userAccount});
                        var proTask = info.data[0].progress_tasks.split(',');
                        proTask.splice(proTask.indexOf(this.editInfo.id.toString()),1);
                        if(info.data[0].finished_tasks!=null && info.data[0].finished_tasks!=''){
                            var finTask = info.data[0].finished_tasks.split(',');
                            finTask.push(this.editInfo.id);
                        }else{
                            var finTask = this.editInfo.id;
                        };
                        await updateFinishTasksByUserAccount({account:this.userAccount,
                                                            progress_tasks:proTask.toString(),
                                                            finished_tasks:finTask.toString()
                                                            });
                        this.$message.success('恭喜您完成任务！');
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
            async getRate(){
                // 获取所有段落数
                const infoA = await findParagraphNumByTaskId({task_id:this.editInfo.id, is_test:1});
                const infoB = await findParagraphNumByTaskId({task_id:this.editInfo.id, is_test:0});
                this.allParagraphNum = infoA.data + infoB.data;
                // 获取所有完成的段落数
                const infoF = await findFinishParagraphNumByTaskId({task_id:this.editInfo.id,user_account:this.userAccount});
                this.finishParagraphNum = infoF.data;
            },
            chooseLabel(info){
                this.choosedLabel = info;
            },
            async saveLabel(){
                await updateLabelById({id:this.resultId,label_result:this.choosedLabel});
                this.resultLabel = this.choosedLabel;
                this.getRate();
                this.isEdit = false;
                this.radio = '1';
            },
            async nextParagraph(){
                this.resultLabel = '';
                this.isEdit = true;
                const info = await findNextUnfinishedParagraph({task_id:this.editInfo.id,user_account:this.userAccount,paragraph_position:this.contentPosition});
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
                this.choosedLabel = '';
                this.radio = '1';
            },
            async lastParagraph(){
                this.resultLabel = '';
                this.isEdit = true;
                const info = await findLastUnfinishedParagraph({task_id:this.editInfo.id,user_account:this.userAccount,paragraph_position:this.contentPosition});
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
            }
        },
        components: {
            testEdit,
        }
    };
</script>

<style lang='scss'>
    .content-title{
        display: inline-block;
    }
</style>