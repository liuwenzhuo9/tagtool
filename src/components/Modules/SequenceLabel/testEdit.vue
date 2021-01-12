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
            选中文字内容后，选择你认为正确的标签，点击“添加标签”<br><span style="color:#da2535">快捷键：字母数字键1-7</span>
            </el-card>
            <el-card shadow="always" class="tipCard">
            完成一个句子的标注后，点击“保存标注”<br><span style="color:#da2535">快捷键：S</span>
            </el-card>
            <el-card shadow="always" class="tipCard">
            点击“下一句”,继续标注<br><span style="color:#da2535">快捷键：N</span>
            </el-card>
        </div>
         <div class="content-title">
             <p class="tips">任务名：{{editInfo.task_name}}----测试任务</p>
             <p class="tips">进度：{{this.finishParagraphNum}}/{{this.allParagraphNum}}</p>
         </div>
         <div class="content-left">
             <div class="tips">第{{this.contentPosition+1}}段内容:</div>
             <el-divider></el-divider>
             <div>{{this.contentInfo}}</div>
             <!-- <div class="paragraphContent1">{{this.contentInfo}}</div> -->
             <!-- <div class="paragraphContent10" v-html="htmlContent">{{this.htmlContent}}</div> -->
             <el-divider></el-divider>
             <p class="tips">可选标签：</p>
             <el-radio-group v-model="radio" class="chooseLabel">
                <el-radio 
                    :key="index" 
                    v-for="(item,index) in labelsInfo" 
                    @change="chooseLabel"
                    :label="item">
                    {{item}}
                </el-radio>
            </el-radio-group>
            <div>
                <el-button @click="addLabel" :disabled="!isEdit">添加标签</el-button>
                <el-button @click="saveLabel" v-if="isEdit">保存标注</el-button>
                <el-button @click="changeLabel" v-if="!isEdit">修改标注</el-button>
                <el-button @click="nextParagraph(isShowAll)" :disabled="isLast">下一句</el-button>
                <el-button @click="lastParagraph(isShowAll)" :disabled="isFirst">上一句</el-button>
            </div>
         </div>
         <div class="content-right" v-if="isEdit">
             <p class="tips">标注结果：</p>
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
             <p class="tips">标注结果：</p>
             <el-tag
                :key="tag"
                v-for="tag in labelResShow"
                :disable-transitions="false">
                {{tag}}
            </el-tag>
         </div>
         <el-button @click="backToLastStep">返回上一级</el-button>
        <!-- <el-button v-if="this.finishParagraphNum == this.allParagraphNum" @click="exitTest">提交测试集标注结果</el-button> -->
    </div>
</template>

<script>
    import {updateRightLabel, findLabeledTestNumByTaskId,findFirstUnfinishedTestParagraph,findFirstTestParagraph,
         findNextUnfinishedTestParagraph,findNextTestParagraph,findParagraphNumByTaskId, findLastUnfinishedTestParagraph,
         findLastTestParagraph} from '../../../unit/fetch';
    export default {
        props: {
            editInfo: Object,
            selectShowPart: Function
        },
        data() {
            return {
                allParagraphNum:'',
                finishParagraphNum:'',
                userAccount:this.$store.state.loginuser,
                contentInfo:'',
                // htmlContent:'',
                contentPosition:'',
                labelsInfo:this.editInfo.task_label.split(','),
                choosedLabel:'',
                resultId:'',
                radio: 0,
                // labelRes:[],
                labelResShow:[],
                labelResArr:[],
                isEdit:true,
                isShowAll:0,//显示未标记句子isEdit:false,
                isFirst: false,
                isLast: false,
                flag: true,
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
                this.getRate();
                var info = [];
                var resStr = '';
                if(this.isShowAll == 0){
                    // 获取第一条未被标记的段落id
                    info = await findFirstUnfinishedTestParagraph({task_id:this.editInfo.id});
                }else{
                    info = await findFirstTestParagraph({task_id:this.editInfo.id});
                    resStr = info.data[0].test_label;
                }
                this.contentInfo = info.data[0].content;
                // this.htmlContent = this.contentInfo;
                if(resStr != '' && resStr != null){
                    // this.labelStrToArr(resStr);
                    this.labelResShow = resStr.split(',');
                }
                this.contentPosition = Number(info.data[0].paragraph_position);
                this.resultId = info.data.id;
                this.judgeFirstOrLast();

                // const infoResult = await findLabelResultById({id:this.resultId});
                // this.labelRes = infoRes.data.res_label;
                

            },
            async getRate(){
                // 获取所有测试段落数
                const infoA = await findParagraphNumByTaskId({task_id:this.editInfo.id, is_test:1});
                this.allParagraphNum = infoA.data;
                // 获取所有完成的测试段落数
                const infoF = await findLabeledTestNumByTaskId({task_id:this.editInfo.id});
                this.finishParagraphNum = infoF.data;
            },
            chooseLabel(info){
                this.choosedLabel = info;
            },
            backToLastStep(){
                this.selectShowPart(3);
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
                if(selection == null || selection == ''){
                    this.$message({
                        type: 'warning',
                        message: '未选择文本'
                    }); 
                }else if(this.choosedLabel == null || this.choosedLabel == ''){
                    this.$message({
                        type: 'warning',
                        message: '未选择标签'
                    }); 
                }else if(!this.isEdit){
                    this.$message({
                        type: 'warning',
                        message: '请点击“修改标注”后再对句子进行修改'
                    }); 
                }else{
                    var startIndex = Math.min(selectTxt.anchorOffset,selectTxt.focusOffset);
                    var endIndex = Math.max(selectTxt.anchorOffset,selectTxt.focusOffset);
                    this.labelResShow.push(startIndex + '-' + endIndex + '-'  + selection + '-' + this.choosedLabel);
                }
                this.choosedLabel = '';
            },
            async saveLabel(){
                this.sortLabelRes(this.labelResShow);
                await updateRightLabel({task_id:this.editInfo.id,paragraph_position:this.contentPosition,test_label:this.labelResShow.toString()});
                this.getRate();
                this.isEdit = false;
            },
            changeLabel(){
                this.isEdit = true;
            },
            handleClose(tag) {
                var index = this.labelResShow.indexOf(tag);
                this.labelResShow.splice(index, 1);
            },
            async nextParagraph(msg){
                this.isEdit = true;
                var info = [];
                this.labelResShow = [];
                this.labelResArr = [];
                var resStr = '';
                if(msg == 0){
                    info = await findNextUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }else{
                    info = await findNextTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                    resStr = info.data[0].test_label;
                }
                this.contentInfo = info.data[0].content;
                // this.htmlContent = this.contentInfo;
                if(resStr != '' && resStr != null){
                    // this.labelStrToArr(resStr);
                    this.labelResShow = resStr.split(',');
                }
                this.contentPosition = parseInt(info.data[0].paragraph_position);
                this.resultId = info.data.id;
                this.judgeFirstOrLast();
            },
            async lastParagraph(msg){
                this.isEdit = true;
                var info = [];
                this.labelResShow = [];
                this.labelResArr = [];
                var resStr = '';
                if(msg == 0){
                    info = await findLastUnfinishedTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                }else{
                    info = await findLastTestParagraph({task_id:this.editInfo.id,paragraph_position:this.contentPosition});
                    resStr = info.data[0].test_label;
                }
                this.contentInfo = info.data[0].content;
                // this.htmlContent = this.contentInfo;
                if(resStr != '' && resStr != null){
                    // this.labelStrToArr(resStr);
                    this.labelResShow = resStr.split(',');
                }
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
            // 将已存在的标签按照起始index降序排列，便于按照index值添加html标签
            sortLabelRes(info){
                info.sort(function(a, b){
                    return b.split('-')[0]-a.split('-')[0];
                })
            },
            // 将contentInfo渲染成html格式
            // contentToHtml(arr, content) {
            //     if(arr.length == 0){
            //         this.htmlContent = this.contentInfo;
            //     }else{
            //         this.htmlContent = '';
            //         for(var i = 0; i < arr.length; i++){
            //             var temp = arr[i].split('-');
            //             var tagIndex = this.labelsInfo.indexOf(temp[3]);
            //             content = content.substring(0, temp[0]) + '<span class = "color' + tagIndex +
            //             '" title = "' + temp[3] + '">' + content.substring(temp[0], temp[1]) + '</span>' +
            //             content.substring(temp[1], content.length);
            //         }
            //         this.htmlContent = content;
            //     }
            // },
            // 将获取的一段话的标签字符串转为数组
            // labelStrToArr(resStr){
            //     var regex = /\{[^\}]+\}/g;
            //     this.labelResShow = resStr.match(regex);
            //     for(var i = 0; i<this.labelResShow.length; i++){
            //         var tagArr = this.labelResShow[i].substring(1,this.labelResShow[i].length-1).split(',');
            //         this.labelResArr.push(tagArr[0] + '-' + tagArr[1] + '-' + tagArr[2].substring(1,tagArr[2].length-1) + '-' + tagArr[3]);
            //     }
            //     var temp = [].concat(this.labelResArr);
            //     this.sortLabelRes(temp);
            //     this.contentToHtml(temp, this.contentInfo);
            // },
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
                if( key === 49 || key === 50 || key === 51 || key === 52 || key === 53 || key === 54 || key === 55){
                    //字母数字键1-7 保存标签
                    if(this.flag)
                    {
                        this.choosedLabel = this.labelsInfo[key-49];
                        this.radio = key-49;
                        this.addLabel();
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
                if( key === 49 || key === 50 || key === 51 || key === 52 || key === 53 || key === 54 || key === 55){
                    //字母数字键1-7 保存标签
                    this.flag = true
                    e.preventDefault() //取消浏览器原有的ctrl+s操作
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
    .paragraphContent10{
        // font-weight: 600;
        // font-size: 150%;
        // position: absolute;
        z-index:10;
        // opacity:0.5;
        // color: #CCFF00;
    }
    .paragraphContent1{
        // font-weight: 700;
        // font-size: 150%;
        position: absolute;
        z-index:1;
        opacity:0.5;
    }
    .paragraphContent{
        font-weight: 700;
        font-size: 150%;
    }
    .content-left {
        width: 600px;
    }
    .color0 {
        background-color: #5F9EA0	;
    }
    // .color0:hover,.color1:hover,.color2:hover,.color3:hover,.color4:hover,.color5:hover,.color6:hover {
    //     background-color: #FFB3E6;
    // }
    // 由于使用的两个div重叠的方式，上层div负责提供文字选中功能，下层div负责显示渲染效果，因此下层div的hover暂时不能使用，span设置的title失效
    .color1 {
        background-color: red;
    }
    .color2 {
        background-color: orange;
    }
    .color3 {
        background-color: green;
    }
    .color4 {
        background-color: blue;
    }
    .color5 {
        background-color: #B8860B;
    }
    .color6 {
        background-color: #CCFF00;
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