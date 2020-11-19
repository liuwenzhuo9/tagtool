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
            <el-card shadow="always" class="tipCard">
            选择标签后，点击“保存标注”<br><span style="color:#da2535">快捷键：S</span>
            </el-card>
            <el-card shadow="always" class="tipCard">
            点击“下一句”,继续标注<br><span style="color:#da2535">快捷键：N</span>
            </el-card>
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
            <el-radio-group v-model="radio" v-if="taskType == 1 || taskType == 2" class="chooseLabel">
                <el-radio :key="index" v-for="(item,index) in labelsInfo" @change="chooseLabel" :label="item">{{item}}</el-radio>
            </el-radio-group>
            <!-- 多层标签选择 -->
            <div v-if="taskType == 3" class="chooseLabel" > 
                <el-cascader
                    :options="options"
                    v-model="multiLabel"
                    :props="{ multiple: true, checkStrictly: true }"
                    clearable></el-cascader>
            </div>
            <el-slider
                v-if="taskType == 2 || taskType == 4"
                v-model="sliderValue"
                show-input
                show-stops
                :step="this.editInfo.granularity"
                :max="10">
            </el-slider>

            <div>
                <el-button @click="saveLabel" v-if="isEdit">保存标签</el-button>
                <el-button @click="saveLabel" v-if="!isEdit">修改标签</el-button>
                <el-button @click="nextParagraph(isShowAll)" :disabled="isLast">下一句</el-button>
                <el-button @click="lastParagraph(isShowAll)" :disabled="isFirst">上一句</el-button>
            </div>
        </div>
        <div class="content-right">
            <p class="tips">标注结果：{{this.resultLabel}}</p>
        </div>
        <el-button @click="backToLastStep">返回上一级</el-button>
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
                taskType:this.editInfo.task_type,
                userAccount:this.$store.state.loginuser,
                contentInfo:'',
                contentPosition:'',
                labelsInfo:this.editInfo.task_label.split(','),
                choosedLabel:'',
                resultLabel:'',
                radio: 0,
                isEdit: true,
                isShowAll:0,//显示未标记句子
                isFirst: false,
                isLast: false,
                flag:true,
                sliderValue:0,
                firstLevelTag:[],//多层次标签的第一层标签
                secondLevelTag:[],//多层次标签的第二层标签
                options: [],
                multiLabel:'',
            }
        },
        mounted(){
            this.init();
        },
        created() {
            document.addEventListener('keydown', this.handleKeyDown)
            document.addEventListener('keyup', this.handleKeyUp)
        },
        destroyed() {
            document.removeEventListener('keydown', this.handleKeyDown)
            document.removeEventListener('keyup', this.handleKeyUp)
        },
        methods:{
            async init(){
                this.choosedLabel = this.labelsInfo[0];
                // 多层次标签存入对应的一级标签和二级标签数组中
                if(this.taskType == 3 || this.taskType == 4){
                    this.options = [];
                    var regex = /\{[^\}]+\}/g;
                    var multiTag = this.editInfo.task_label.match(regex);
                    for(var i = 0; i<multiTag.length; i++){
                        var tempArr = multiTag[i].substring(1,multiTag[i].length-1).split(':');
                        this.firstLevelTag.push(tempArr[0]);
                        const secondArr = tempArr[1].split(',');
                        this.secondLevelTag.push(secondArr);
                        var childList = [];
                        for(var j = 0; j<secondArr.length; j++){
                            let list = {value: secondArr[j], label: secondArr[j]};
                            childList.push(list);
                        }
                        var fatherList = {value: tempArr[0], label: tempArr[0], children: childList};
                        this.options.push(fatherList);
                    }
                }
                this.getRate();
                this.choosedLabel = this.labelsInfo[0];
                var info = [];
                this.resultLabel = '';
                if(this.isShowAll == 0){
                    // 获取第一条未被标记的段落id
                    info = await findFirstUnfinishedTestParagraph({task_id:this.editInfo.id});
                }else{
                    info = await findFirstTestParagraph({task_id:this.editInfo.id});
                    this.resultLabel = info.data[0].test_label;
                }
                this.contentInfo = info.data[0].content;
                this.contentPosition = parseInt(info.data[0].paragraph_position);
                this.judgeFirstOrLast();
            },
            async getRate(){
                // 获取所有测试段落数
                const infoA = await findParagraphNumByTaskId({task_id:this.editInfo.id, is_test:1});
                this.allParagraphNum = infoA.data;
                // 获取所有完成的测试段落数
                const infoF = await findLabeledTestNumByTaskId({task_id:this.editInfo.id});
                this.finishParagraphNum = infoF.data;
                // if(this.allParagraphNum == this.finishParagraphNum){
                //     this.$message.success('该任务所有测试句子已标注！');
                //     this.selectShowPart(3);
                // }
            },
            backToLastStep(){
                this.selectShowPart(3);
            },
            chooseLabel(info){
                this.choosedLabel = info;
            },
            async saveLabel(){
                if(this.choosedLabel == null || this.choosedLabel == ''){
                    this.$message({
                        type: 'warning',
                        message: '未选择标签'
                    }); 
                }else{
                    if(this.taskType == 1){
                        await updateRightLabel({task_id:this.editInfo.id,paragraph_position:this.contentPosition,test_label:this.choosedLabel});
                        this.resultLabel = this.choosedLabel;
                    }else if(this.taskType == 2){
                        var labelRes = this.choosedLabel + ',' + this.sliderValue;
                        await updateRightLabel({task_id:this.editInfo.id,paragraph_position:this.contentPosition,test_label:labelRes});
                        this.resultLabel = '标签-' + this.choosedLabel + ',量级-' + this.sliderValue;
                    }else if(this.taskType == 3){
                        var labelRes = '';
                        this.resultLabel = '';
                        for(var i = 0; i<this.multiLabel.length; i++){
                            labelRes += i==0 ? '{' + this.multiLabel[i][0] + ',' + this.multiLabel[i][1] + '}' : ',{' + this.multiLabel[i][0] + ',' + this.multiLabel[i][1] + '}';
                            this.resultLabel += i==0 ? '{' + this.multiLabel[i][0] + ',' + this.multiLabel[i][1] + '}' : ',{' + this.multiLabel[i][0] + ',' + this.multiLabel[i][1] + '}'
                        }  
                        await updateRightLabel({task_id:this.editInfo.id,paragraph_position:this.contentPosition,test_label:labelRes});
                    }
                    this.getRate();
                    this.isEdit = false;
                    this.radio = '1';
                    this.sliderValue = 0;
                }
            },
            async nextParagraph(msg){
                this.resultLabel = '';
                this.isEdit = true;
                var info = [];
                if(msg == 0){
                    info = await findNextUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }else{
                    info = await findNextTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                    if(this.taskType == 1){
                        this.resultLabel = info.data[0].test_label;
                        this.choosedLabel = this.resultLabel;
                    }else if(this.taskType == 2 && info.data[0].test_label != '' && info.data[0].test_label != null){
                        let temp = info.data[0].test_label.split(',');
                        this.choosedLabel = temp[0];
                        this.sliderValue = parseInt(temp[1]);
                        this.resultLabel = '标签-' + this.choosedLabel + ',量级-' + this.sliderValue;
                    }else if(this.taskType == 3){
                        this.resultLabel = info.data[0].test_label;
                        if(this.resultLabel != null && this.resultLabel != null){
                            var regex = /\{[^\}]+\}/g;
                            var multiTag = this.resultLabel.match(regex);
                            this.multiLabel = [];
                            for(var i = 0; i<multiTag.length; i++){
                                var tempArr = multiTag[i].substring(1,multiTag[i].length-1).split(',');
                                this.multiLabel.push(tempArr);
                            }
                        }
                    }
                }
                this.contentInfo = info.data[0].content;
                this.contentPosition = parseInt(info.data[0].paragraph_position);
                this.resultId = info.data.id;
                this.judgeFirstOrLast();
            },
            async lastParagraph(msg){
                this.resultLabel = '';
                this.isEdit = true;
                var info = [];
                if(msg == 0){
                    info = await findLastUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }else{
                    info = await findLastTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                    if(this.taskType == 1){
                        this.resultLabel = info.data[0].test_label;
                        this.choosedLabel = this.resultLabel;
                    }else if(this.taskType == 2 && info.data[0].test_label != '' && info.data[0].test_label != null){
                        let temp = info.data[0].test_label.split(',');
                        this.choosedLabel = temp[0];
                        this.sliderValue = parseInt(temp[1]);
                        this.resultLabel = '标签-' + this.choosedLabel + ',量级-' + this.sliderValue;
                    }else if(this.taskType == 3){
                        this.resultLabel = info.data[0].test_label;
                        if(this.resultLabel != null && this.resultLabel != null){
                            var regex = /\{[^\}]+\}/g;
                            var multiTag = this.resultLabel.match(regex);
                            this.multiLabel = [];
                            for(var i = 0; i<multiTag.length; i++){
                                var tempArr = multiTag[i].substring(1,multiTag[i].length-1).split(',');
                                this.multiLabel.push(tempArr);
                            }
                        }
                    }
                }
                this.contentInfo = info.data[0].content;
                this.contentPosition = parseInt(info.data[0].paragraph_position);
                this.resultId = info.data.id;
                this.judgeFirstOrLast();
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
            },
            //判断当前句子是否为第一条or最后一条句子
            async judgeFirstOrLast(){
                var infoL = [];
                var infoN = [];
                if(this.isShowAll == 0){
                    //只显示未标记的句子
                    infoL = await findLastUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                    infoN = await findNextUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }else{
                    //显示全部句子
                    infoL = await findLastTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                    infoN = await findNextTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }
                if(infoL.data.length == 0){ //已是第一条
                    this.isFirst = true;
                }else{
                    this.isFirst = false;
                }
                if(infoN.data.length == 0){//已是最后一条
                    this.isLast = true;
                }else{
                    this.isLast = false;
                }
            },
            handleKeyDown(e) {
                var key = window.event.keyCode ? window.event.keyCode : window.event.which
                if( key === 83 ){
                    //S键保存标签
                    if(this.flag)
                    {
                        this.saveLabel();
                        this.flag = false;
                    }
                    e.preventDefault() //取消浏览器原有的ctrl+s操作
                }
                if( key === 78 ){
                    //N键下一句
                    if(this.flag)
                    {
                        this.nextParagraph(this.isShowAll);
                        this.flag = false;
                    }
                    e.preventDefault() //取消浏览器原有的ctrl+s操作
                }
            },
            handleKeyUp(e) {
                // enter
                var key = window.event.keyCode ? window.event.keyCode : window.event.which
                if( key === 83 ){
                    this.flag = true
                    e.preventDefault()
                }
                if( key === 78 ){
                    this.flag = true
                    e.preventDefault()
                }
            },
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
    .tipCard {
        font-size: 14px;
        margin: 10px;
    }
    // .el-radio__label {
    //     font-size: 22px;
    //     padding: 6px;
    // }
</style>