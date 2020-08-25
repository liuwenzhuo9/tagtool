<template>
    <div class="labelAnnotation">
             <div class="content-title">
                <p >我的任务：{{editInfo.task_name}}----测试集标注</p>
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
             <!-- <el-button v-if="this.finishParagraphNum == this.allParagraphNum" @click="exitTest">提交测试集标注结果</el-button> -->
    </div>
</template>

<script>
    import { updateRightLabel, findLabeledTestNumByTaskId,findFirstUnfinishedTestParagraph,
            findLastUnfinishedTestParagraph,findNextUnfinishedTestParagraph} from '../../../unit/fetch';
    
    export default {
        props: {
            editInfo: Object,
        },
        data() {
            return {
                isTest:1,
                allParagraphNum:'',
                finishParagraphNum:'',
                userAccount:this.$store.state.loginuser,
                contentInfo:'',
                contentPosition:'',
                labelsInfo:this.editInfo.task_label.split(','),
                choosedLabel:'',
                resultLabel:'',
                radio: '1',
                isEdit: true,
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            async init(){
                this.getRate();
                // 获取第一条未被标记的段落id
                const info = await findFirstUnfinishedTestParagraph({task_id:this.editInfo.id});
                
                this.contentInfo = info.data[0].content;
                this.contentPosition = parseInt(info.data[0].paragraph_position);
            },
            async getRate(){
                // 获取所有段落数
                const infoA = await findParagraphNumByTaskId({task_id:this.editInfo.id, is_test:1});
                this.allParagraphNum = infoA.data;
                // 获取所有完成的段落数
                const infoF = await findLabeledTestNumByTaskId({task_id:this.editInfo.id});
                this.finishParagraphNum = infoF.data;
            },
            chooseLabel(info){
                this.choosedLabel = info;
            },
            async saveLabel(){
                const info = await updateRightLabel({task_id:this.editInfo.id,paragraph_position:this.contentPosition,test_label:this.choosedLabel});
                this.resultLabel = this.choosedLabel;
                this.getRate();
                this.isEdit = false;
                this.radio = '1';
            },
            async nextParagraph(){
                this.resultLabel = '';
                this.isEdit = true;
                const info = await findNextUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                this.contentInfo = info.data[0].content;
                this.contentPosition = parseInt(info.data[0].paragraph_position);
                this.choosedLabel = '';
                this.radio = '1';
            },
            async lastParagraph(){
                this.resultLabel = '';
                this.isEdit = true;
                const info = await findLastUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                this.contentInfo = info.data[0].content;
                this.contentPosition = parseInt(info.data[0].paragraph_position);
            }
        },
    };
</script>

<style lang='scss'>
    .content-title{
        display: inline-block;
    }
</style>