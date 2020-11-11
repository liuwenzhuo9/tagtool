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
                <p class="tips">任务名：{{editInfo.task_name}}</p>
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
                    <el-button @click="nextParagraph(isShowAll)" :disabled="isLast">下一句</el-button>
                    <el-button @click="lastParagraph(isShowAll)" :disabled="isFirst">上一句</el-button>
                </div>
            </div>
            <div class="content-right">
                <p class="tips">标注结果：{{this.resultLabel}}</p>
            </div>
            <el-button v-if="this.finishParagraphNum == this.allParagraphNum" @click="finishTask">提交任务</el-button>
        
    </div>
</template>

<script>
    import { findParagraphNumByTaskId, findFinishParagraphNumByTaskId,findFirstUnfinishedParagraph, findFirstParagraph, updateLabelById,
            findLastUnfinishedParagraph,findNextUnfinishedParagraph,findInfoByUserAccount,
            updateFinishTasksByUserAccount, updateFinishMemberByTaskId, findLastParagraph,findNextParagraph,} from '../../../unit/fetch';
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
                contentPosition:'',
                labelsInfo:this.editInfo.task_label.split(','),
                choosedLabel:'',
                resultLabel:'',
                resultId:'',
                radio: '1',
                isEdit : true,
                isShowAll:0,//显示未标记句子
                isFirst: false,
                isLast: false,
                flag:true,
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
                this.getRate();
                var info = [];
                this.resultLabel = '';
                if(this.isShowAll == 0){
                    // 获取第一条未被标记的段落id
                    info = await findFirstUnfinishedParagraph({task_id:this.editInfo.id,
                                                               user_account:this.userAccount});
                }else{
                    info = await findFirstParagraph({task_id:this.editInfo.id,
                                                     user_account:this.userAccount});
                    this.resultLabel = info.data.label_result;
                }
                this.resultId = info.data.id;
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data.paragraph_position);
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
            async saveLabel(){
                await updateLabelById({id:this.resultId,label_result:this.choosedLabel});
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
                    //只显示未标记的句子
                    info = await findNextUnfinishedParagraph({task_id:this.editInfo.id,
                                                              user_account:this.userAccount,
                                                              paragraph_position:this.contentPosition});
                }else{
                    //显示全部句子
                    info = await findNextParagraph({task_id:this.editInfo.id,
                                                    user_account:this.userAccount,
                                                    paragraph_position:this.contentPosition});
                    this.resultLabel = info.data.label_result;
                }
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data.paragraph_position);
                this.resultId = info.data.id;
                this.choosedLabel = this.resultLabel;
                this.judgeFirstOrLast();
            },
            async lastParagraph(msg){
                this.resultLabel = '';
                this.isEdit = true;
                var info = [];
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
                    this.resultLabel = info.data.label_result;
                }
                this.contentInfo = info.message;
                this.contentPosition = Number(info.data.paragraph_position);
                this.choosedLabel = this.resultLabel;
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
                this.selectShowPart(1);
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
                console.log(infoL);
                if(infoL.data == 0){ //已是第一条
                console.log(111);
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
        components: {
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
</style>