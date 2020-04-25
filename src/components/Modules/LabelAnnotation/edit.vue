<template>
    <div class="labelAnnotation">
        <template v-if="!isTest">
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
                <el-button @click="saveLabel">保存标签</el-button>
                <div>
                    <el-button @click="nextParagraph()">下一句</el-button>
                    <el-button @click="lastParagraph()">上一句</el-button>
                </div>
            </div>
            <div class="content-right">
                <p>标注结果：{{this.resultLabel}}</p>
            </div>
        </template>
        <template v-else>
            <testEdit :editInfo="editInfo"></testEdit>
            <el-button @click="finishTest">提交测试结果</el-button>
        </template>
    </div>
</template>

<script>
    import { findParagraphNumByTaskId, findFinishParagraphNumByTaskId,findFirstUnfinishedParagraph,findContentByParagraphId, updateLabelById,
            findLastUnfinishedParagraph,findNextUnfinishedParagraph, findFirstUnfinishedTestParagraph} from '../../../unit/fetch';
    import testEdit from './testEdit';
    export default {
        props: {
            editInfo: Object,
        },
        data() {
            return {
                isTest:'',
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
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            async init(){
                // 获取所有段落数
                const infoA = await findParagraphNumByTaskId({task_id:this.editInfo.id});
                this.allParagraphNum = infoA.data;
                // 获取所有完成的段落数
                const infoF = await findFinishParagraphNumByTaskId({task_id:this.editInfo.id,user_account:this.userAccount});
                this.finishParagraphNum = infoF.data;
                // 获取第一条未被标记的段落id
                const info = await findFirstUnfinishedParagraph({task_id:this.editInfo.id,user_account:this.userAccount});
                
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
                // 判断是否有测试集
                if(this.editInfo.sds_name){
                    // 判断测试集是否标记完全
                    const info = await findFirstUnfinishedTestParagraph({task_id:this.editInfo.id,user_account:this.userAccount});
                    if(info){
                        this.isTest = 1;
                    }else{
                        this.isTest = 0;
                    }
                }else{
                    this.isTest = 0;
                }
            },
            chooseLabel(info){
                this.choosedLabel = info;
            },
            async saveLabel(){
                await updateLabelById({id:this.resultId,label_result:this.choosedLabel});
                this.resultLabel = this.choosedLabel;
            },
            async nextParagraph(){
                const info = await findNextUnfinishedParagraph({task_id:this.editInfo.id,user_account:this.userAccount,paragraph_position:this.contentPosition});
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
            },
            async lastParagraph(){
                const info = await findLastUnfinishedParagraph({task_id:this.editInfo.id,user_account:this.userAccount,paragraph_position:this.contentPosition});
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
            },
            finishTest(){
                this.isTest = 0;
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