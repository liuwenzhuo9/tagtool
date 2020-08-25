<template>
    <div class="labelAnnotation">
             <div class="content-title">
                <p >任务名：{{editInfo.task_name}}</p>
                <p >进度：{{this.finishParagraphNum}}/{{this.allParagraphNum}}</p>
            </div>
            <div class="content-left">
                <div>第{{this.contentPosition+1}}段:</div>
                <div class="paragraphContent">{{this.contentInfo}}</div>
                <p>标注方法：选中文字内容，选择你认为正确的标签</p>
                <p>可选标签：</p>
                    <el-radio 
                        :key="index" 
                        v-for="(item,index) in labelsInfo" 
                        @change="chooseLabel" 
                        v-model="radio" 
                        :label="item">
                        {{item}}
                    </el-radio>
                    <el-button @click="addLabel">添加标签</el-button>
                <div>
                    <el-button @click="saveLabel" v-if="isEdit">保存标注</el-button>
                    <el-button @click="changeLabel" v-if="!isEdit">修改标注</el-button>
                    <el-button @click="nextParagraph()">下一句</el-button>
                    <el-button @click="lastParagraph()">上一句</el-button>
                </div>
            </div>
            <div class="content-right" v-if="isEdit">
                <p>标注结果：</p>
                <el-tag
                    :key="tag"
                    v-for="tag in labelResShow"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
            </div>
            <div class="content-right" v-else>
                <p>标注结果：</p>
                <el-tag
                    :key="tag"
                    v-for="tag in labelResShow"
                    :disable-transitions="false">
                    {{tag}}
                </el-tag>
            </div>
            <el-button v-if="this.finishParagraphNum == this.allParagraphNum" @click="finishTask">提交任务</el-button>
        
    </div>
</template>

<script>
    import { findParagraphNumByTaskId, findFinishParagraphNumByTaskId,findFirstUnfinishedParagraph, updateLabelById,
            findLastUnfinishedParagraph,findNextUnfinishedParagraph,findLabelResultById,findFirstUnfinishedTestParagraph,
            findInfoByUserAccount,updateFinishTasksByUserAccount} from '../../../unit/fetch';
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
                resultId:'',
                radio: '1',
                // labelRes:[],
                labelResShow:[],
                isEdit:true,
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

                // const infoResult = await findLabelResultById({id:this.resultId});
                // this.labelRes = infoRes.data.label_result;

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
            async addLabel(){
                if (window.getSelection) {
                var selectTxt = window.getSelection();
                } else if (window.document.getSelection) {
                    selectTxt = window.document.getSelection();
                } else if (window.document.selection) {
                    selectTxt = window.document.selection.createRange().text;
                }
                var selection = selectTxt.toString();
                var startIndex = Math.min(selectTxt.anchorOffset,selectTxt.focusOffset);
                var endIndex = Math.max(selectTxt.anchorOffset,selectTxt.focusOffset);
                
                // this.labelRes.push('{'+ startIndex + ',' + endIndex + ',' + this.choosedLabel + '}');
                this.labelResShow.push('{'+ startIndex + ',' + endIndex + ',“'  + selection + '”,' + this.choosedLabel + '}');
                this.radio = '1';
            },
            async saveLabel(){
                await updateLabelById({id:this.resultId,label_result:this.labelResShow.toString()});
                // this.labelRes = [];
                this.getRate();
                this.isEdit = false;
            },
            changeLabel(){
                this.isEdit = true;
            },
            handleClose(tag) {
                var index = this.labelResShow.indexOf(tag);
                this.labelResShow.splice(index, 1);
                // this.labelRes.splice(index, 1);
            },
            async nextParagraph(){
                const info = await findNextUnfinishedParagraph({task_id:this.editInfo.id,user_account:this.userAccount,paragraph_position:this.contentPosition});
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
                this.labelResShow = [];
                this.radio = '1';
                this.isEdit = true;
            },
            async lastParagraph(){
                const info = await findLastUnfinishedParagraph({task_id:this.editInfo.id,user_account:this.userAccount,paragraph_position:this.contentPosition});
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
                this.isEdit = true;
            },
            
        },
        components:{
            testEdit,
        }
    };
</script>

<style lang='scss'>
    .content-title{
        display: inline-block;
    }
</style>