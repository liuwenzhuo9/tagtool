<template>
    <div class="labelAnnotation">
         <div class="content-title">
             <p >任务名：{{editInfo.task_name}}----测试任务</p>
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
                <el-button @click="saveLabel">保存标签</el-button>
                <el-button @click="nextParagraph()">下一句</el-button>
                <el-button @click="lastParagraph()">上一句</el-button>
            </div>
         </div>
         <div class="content-right">
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
    </div>
</template>

<script>
    import { findTestParagraphNumByTaskId, findFinishTestParagraphNumByTaskId,findFirstUnfinishedTestParagraph, updateTestResById,
            findLastUnfinishedTestParagraph,findNextUnfinishedTestParagraph,findLabelResultById} from '../../../unit/fetch';
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
                labelRes:[],
                labelResShow:[],
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

                // const infoResult = await findLabelResultById({id:this.resultId});
                // this.labelRes = infoRes.data.res_label;
                

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
                
                this.labelRes.push('{'+ startIndex + ',' + endIndex + ',' + this.choosedLabel + '}');
                this.labelResShow.push('{'+ startIndex + ',' + endIndex + ',“'  + selection + '”,' + this.choosedLabel + '}');
                console.log(this.labelRes);
            },
            async saveLabel(){
                await updateTestResById({id:this.resultId,res_label:this.labelRes.toString()});
            },
            handleClose(tag) {
                var index = this.labelResShow.indexOf(tag);
                this.labelResShow.splice(index, 1);
                this.labelRes.splice(index, 1);
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
            },
        },
    };
</script>

<style lang='scss'>
    .content-title{
        display: inline-block;
    }
</style>