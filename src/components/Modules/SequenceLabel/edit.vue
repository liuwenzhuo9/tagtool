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
                <p class="tips">任务名：{{editInfo.task_name}}</p>
                <p class="tips">进度：{{this.finishParagraphNum}}/{{this.allParagraphNum}}</p>
            </div>
            <div class="content-left">
                <p class="tips">第{{this.contentPosition+1}}段:</p>
                <el-divider></el-divider>
                <div class="paragraphContent1" >{{this.contentInfo}}</div>
                <div class="paragraphContent10" v-html="htmlContent">{{this.htmlContent}}</div>
                <el-divider></el-divider>
                <p class="tips">标注方法：选中文字内容，选择你认为正确的标签</p>
                <p class="tips">可选标签：</p>
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
            <el-button v-if="this.finishParagraphNum == this.allParagraphNum" @click="finishTask">提交任务</el-button>
        
    </div>
</template>

<script>
    import { findParagraphNumByTaskId, findFinishParagraphNumByTaskId,findFirstUnfinishedParagraph, findFirstParagraph,updateLabelById,
            findNextUnfinishedParagraph, findLastUnfinishedParagraph, findLastParagraph,findNextParagraph, findLabelResultById,findFirstUnfinishedTestParagraph,
            findInfoByUserAccount,updateFinishTasksByUserAccount,updateFinishMemberByTaskId} from '../../../unit/fetch';
    import testEdit from './testEdit';
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
                htmlContent:'',
                contentPosition:'',
                labelsInfo:this.editInfo.task_label.split(','),//存放所有待选标签
                choosedLabel:'',
                resultId:'',
                radio: '1',
                labelResShow:[],
                labelResArr:[],
                isEdit:true,
                isShowAll:0,//显示未标记句子
                isFirst: false,
                isLast: false,
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            async init(){
                this.getRate();
                var info = [];
                var resStr = '';
                if(this.isShowAll == 0){
                    // 获取第一条未被标记的段落id
                    info = await findFirstUnfinishedParagraph({task_id:this.editInfo.id,
                                                                user_account:this.userAccount});
                }else{
                    info = await findFirstParagraph({task_id:this.editInfo.id,
                                                     user_account:this.userAccount});
                    resStr = info.data.label_result;
                }
                this.contentInfo = info.message;
                this.htmlContent = this.contentInfo;
                if(resStr != '' && resStr != null){
                    this.labelStrToArr(resStr);
                }
                this.contentPosition = Number(info.data.paragraph_position);
                this.resultId = info.data.id;
                this.judgeFirstOrLast();
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
                        var finTask = '';
                        if(info.data[0].finished_tasks!=null && info.data[0].finished_tasks!=''){
                            finTask = info.data[0].finished_tasks.split(',').push(this.editInfo.id);
                        }else{
                            finTask = this.editInfo.id;
                        };
                        await updateFinishTasksByUserAccount({account:this.userAccount,
                                                            progress_tasks:proTask.toString(),
                                                            finished_tasks:finTask.toString()
                                                            });
                                                            
                        const memberFin = this.editInfo.member_finish + 1;
                        await updateFinishMemberByTaskId({id:this.editInfo.id, member_finish: memberFin});
                        this.$message.success('恭喜您完成任务！');
                        this.selectShowPart(2);
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
                this.labelResShow.push('{'+ startIndex + ',' + endIndex + ',“'  + selection + '”,' + this.choosedLabel + '}');
                this.labelResArr.push(startIndex + '-' + endIndex + '-' + selection + '-' + this.choosedLabel);
                var temp = [].concat(this.labelResArr);
                this.sortLabelRes(temp);
                this.contentToHtml(temp, this.contentInfo);
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
                this.labelResArr.splice(index, 1);
                var temp = [].concat(this.labelResArr);
                this.sortLabelRes(temp);
                this.contentToHtml(temp, this.contentInfo);
            },
            async nextParagraph(msg){
                var info = [];
                this.labelResShow = [];
                this.labelResArr = [];
                var resStr = '';
                if(msg == 0){
                    //只显示未标记的句子
                    info = await findNextUnfinishedParagraph({task_id:this.editInfo.id,
                                                              user_account:this.userAccount,
                                                              paragraph_position:this.contentPosition});
                }else{
                    //显示全部句子
                    info = await findNextParagraph({task_id:this.editInfo.id,
                                                    user_account:this.userAccount,
                                                    paragraph_position:this.contentPosition});
                    resStr = info.data.label_result;
                }
                this.contentInfo = info.message;
                this.htmlContent = this.contentInfo;
                if(resStr != '' && resStr != null){
                    this.labelStrToArr(resStr);
                }
                this.contentPosition = Number(info.data.paragraph_position);
                this.resultId = info.data.id;
                this.radio = '1';
                this.isEdit = true;
                this.judgeFirstOrLast();
            },
            async lastParagraph(msg){
                var info = [];
                this.labelResShow = [];
                this.labelResArr = [];
                var resStr = '';
                if(msg == 0){
                    //只显示未标记的句子
                    info = await findLastUnfinishedParagraph({task_id:this.editInfo.id,
                                                              user_account:this.userAccount,
                                                              paragraph_position:this.contentPosition});
                }else{
                    //显示全部句子
                    info = await findLastParagraph({task_id:this.editInfo.id,
                                                    user_account:this.userAccount,
                                                    paragraph_position:this.contentPosition});
                    resStr = info.data.label_result;
                }
                this.contentInfo = info.message;
                this.htmlContent = this.contentInfo;
                if(resStr != '' && resStr != null){
                    this.labelStrToArr(resStr);
                }
                this.contentPosition = Number(info.data.paragraph_position);
                this.resultId = info.data.id;
                this.radio = '1';
                this.isEdit = true;
                this.judgeFirstOrLast();
            },
            //选择显示全部还是未标记句子
            handleCommandShow(command) {
              if( command == 1){
                    this.isShowAll = 1;//查看全部句子
                }else{
                    this.isShowAll = 0;//查看未标记句子
                }
                this.judgeFirstOrLast();
            },
            countTime(){
                this.selectShowPart(1);
            },
            // 将已存在的标签按照起始index降序排列，便于按照index值添加html标签
            sortLabelRes(info){
                info.sort(function(a, b){
                    return b.split('-')[0]-a.split('-')[0];
                })
            },
            // 将contentInfo渲染成html格式
            contentToHtml(arr, content) {
                if(arr.length == 0){
                    this.htmlContent = this.contentInfo;
                }else{
                    this.htmlContent = '';
                    for(var i = 0; i < arr.length; i++){
                        var temp = arr[i].split('-');
                        var tagIndex = this.labelsInfo.indexOf(temp[3]);
                        content = content.substring(0, temp[0]) + '<span class = "color' + tagIndex +
                        '" title = "' + temp[3] + '">' + content.substring(temp[0], temp[1]) + '</span>' +
                        content.substring(temp[1], content.length);
                    }
                    this.htmlContent = content;
                }
            },
            //将获取的一段话的标签字符串转为数组
            labelStrToArr(resStr){
                var regex = /\{[^\}]+\}/g;
                this.labelResShow = resStr.match(regex);
                for(var i = 0; i<this.labelResShow.length; i++){
                    var tagArr = this.labelResShow[i].substring(1,this.labelResShow[i].length-1).split(',');
                    this.labelResArr.push(tagArr[0] + '-' + tagArr[1] + '-' + tagArr[2].substring(1,tagArr[2].length-1) + '-' + tagArr[3]);
                }
                var temp = [].concat(this.labelResArr);
                this.sortLabelRes(temp);
                this.contentToHtml(temp, this.contentInfo);
            },
            //判断当前句子是否为第一条or最后一条句子
            async judgeFirstOrLast(){
                var infoL = [];
                var infoN = [];
                if(this.isShowAll == 0){
                    //只显示未标记的句子
                    infoL = await findLastUnfinishedParagraph({task_id:this.editInfo.id,
                                                              user_account:this.userAccount,
                                                              paragraph_position:this.contentPosition});
                    infoN = await findNextUnfinishedParagraph({task_id:this.editInfo.id,
                                                              user_account:this.userAccount,
                                                              paragraph_position:this.contentPosition});
                }else{
                    //显示全部句子
                    infoL = await findLastParagraph({task_id:this.editInfo.id,
                                                    user_account:this.userAccount,
                                                    paragraph_position:this.contentPosition});
                    infoN = await findNextParagraph({task_id:this.editInfo.id,
                                                    user_account:this.userAccount,
                                                    paragraph_position:this.contentPosition});
                }
                if(infoL.data == 0){ //已是第一条
                    this.isFirst = true;
                }else{
                    this.isFirst = false;
                }
                if(infoN.data == 0){//已是最后一条
                    this.isLast = true;
                }else{
                    this.isLast = false;
                }
            }
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
    .content-left {
        width: 600px;
        position: relative;
    }
    // .redColor {
    //     color: red;
    // }
    // .redColor:hover {
    //     background-color: green;
    // }
    // .blueColor {
    //     color: pink;
    // }
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
    
</style>