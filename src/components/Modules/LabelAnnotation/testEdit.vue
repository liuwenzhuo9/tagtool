<template>
    <div class="labelAnnotation">
             <div class="content-title">
                <p >任务名：{{editInfo.task_name}}----测试任务</p>
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
    </div>
</template>

<script>
    import { findTestParagraphNumByTaskId, findFinishTestParagraphNumByTaskId,findFirstUnfinishedTestParagraph, updateTestResById,
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
                const infoA = await findTestParagraphNumByTaskId({task_id:this.editInfo.id});
                this.allParagraphNum = infoA.data;
                // 获取所有完成的段落数
                const infoF = await findFinishTestParagraphNumByTaskId({task_id:this.editInfo.id,user_account:this.userAccount});
                this.finishParagraphNum = infoF.data;
                // 获取第一条未被标记的段落id
                const info = await findFirstUnfinishedTestParagraph({task_id:this.editInfo.id,user_account:this.userAccount});
                
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
            },
            changeTest(){
                this.isTest = 0;
            },
            chooseLabel(info){
                this.choosedLabel = info;
            },
            async saveLabel(){
                console.log(1)
                console.log(this.resultId);
                console.log(2)
                console.log(this.choosedLabel);

                const info = await updateTestResById({id:this.resultId,res_label:this.choosedLabel});
                console.log(3)
                console.log(info);
                this.resultLabel = this.choosedLabel;
            },
            async nextParagraph(){
                const info = await findNextUnfinishedTestParagraph({task_id:this.editInfo.id,user_account:this.userAccount,paragraph_position:this.contentPosition});
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
            },
            async lastParagraph(){
                const info = await findLastUnfinishedTestParagraph({task_id:this.editInfo.id,user_account:this.userAccount,paragraph_position:this.contentPosition});
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data[1]);
                this.resultId = info.data[0];
            }
        },
    };
</script>

<style lang='scss'>
    .content-title{
        display: inline-block;
    }
</style>