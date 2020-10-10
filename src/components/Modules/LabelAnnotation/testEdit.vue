<template>
    <div class="labelAnnotation">
        <div class="chooseShow">
            <el-dropdown @command="handleCommandShow">
                <span class="el-dropdown-link">
                    选择显示内容<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">显示全部句子</el-dropdown-item>
                    <el-dropdown-item command="0">显示未标记句子</el-dropdown-item>
                    <el-dropdown-item  disabled>默认显示未标记句子</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <p v-if="isShowAll">当前：显示全部句子</p>
            <p v-if="!isShowAll">当前：显示未标记句子</p>
            <el-divider></el-divider>
            <button @click="countTime">暂停标注</button>
        </div>
             <div class="content-title">
                <p class="tips">我的任务：{{editInfo.task_name}}----测试集标注</p>
                <p class="tips">进度：{{this.finishParagraphNum}}/{{this.allParagraphNum}}</p>
            </div>
            <div class="content-left">
                <p class="tips">第{{this.contentPosition+1}}段:</p>
                <el-divider></el-divider>
                <p class="paragraphContent">
                    {{this.contentInfo}}
                </p>
                <el-divider></el-divider>
                <p class="tips">可选标签：</p>
                    <el-radio :key="index" v-for="(item,index) in labelsInfo" @change="chooseLabel" v-model="radio" :label="item">{{item}}</el-radio>
                <el-button @click="saveLabel" v-if="isEdit">保存标签</el-button>
                <el-button @click="saveLabel" v-if="!isEdit">修改标签</el-button>
                <div>
                    <el-button @click="nextParagraph(isShowAll)">下一句</el-button>
                    <el-button @click="lastParagraph(isShowAll)">上一句</el-button>
                </div>
            </div>
            <div class="content-right">
                <p class="tips">标注结果：{{this.resultLabel}}</p>
            </div>
             <!-- <el-button v-if="this.finishParagraphNum == this.allParagraphNum" @click="exitTest">提交测试集标注结果</el-button> -->
    </div>
</template>

<script>
    import { updateRightLabel, findLabeledTestNumByTaskId,findFirstUnfinishedTestParagraph,findFirstTestParagraph,
            findLastUnfinishedTestParagraph, findLastTestParagraph, findNextUnfinishedTestParagraph,findNextTestParagraph, findParagraphNumByTaskId} from '../../../unit/fetch';
    
    export default {
        props: {
            editInfo: Object,
            selectShowPart: Function
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
                isShowAll:0,//显示未标记句子
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            async init(){
                this.getRate();
                var info = [];
                if(this.isShowAll == 0){
                    // 获取第一条未被标记的段落id
                    info = await findFirstUnfinishedTestParagraph({task_id:this.editInfo.id});
                }else{
                    info = await findFirstTestParagraph({task_id:this.editInfo.id});
                }
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
                if(this.allParagraphNum == this.finishParagraphNum){
                    this.$message.success('该任务所有测试句子已标注！');
                }
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
            async nextParagraph(msg){
                this.resultLabel = '';
                this.isEdit = true;
                var info = [];
                if(msg == 0){
                    info = await findNextUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }else{
                    info = await findNextTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }
                this.contentInfo = info.data[0].content;
                this.contentPosition = parseInt(info.data[0].paragraph_position);
                this.choosedLabel = '';
                this.radio = '1';
            },
            async lastParagraph(msg){
                this.resultLabel = '';
                this.isEdit = true;
                var info = [];
                if(msg == 0){
                    info = await findLastUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }else{
                    info = await findLastTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }
                this.contentInfo = info.data[0].content;
                this.contentPosition = parseInt(info.data[0].paragraph_position);
            },
            //选择显示全部还是未标记句子
            handleCommandShow(command) {
              if( command == 1){
                    this.isShowAll = 1;//查看全部句子
                }else{
                    this.isShowAll = 0;//查看未标记句子
                }
                this.init();
            },
            countTime(){
                this.selectShowPart(3);
            }
        },
    };
</script>

<style lang='scss'>
    .content-title{
        display: inline-block;
    }
    .chooseShow{
        float: right;
        width: 280px;
    }
    .tips{
        font-style: italic;
    }
    .paragraphContent{
        font-weight: 700;
        font-size: 150%;
    }
    .content-left {
        width: 600px;
    }
</style>