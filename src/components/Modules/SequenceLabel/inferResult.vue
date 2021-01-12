<template>
    <div class = "inferResult">
        <el-button type="success" round @click="downLoadRes(1)">导出标注结果（大实体靠前）</el-button>
        <el-button type="success" round @click="downLoadRes(0)">导出标注结果（小实体靠前）</el-button>
        <el-table
            :data="tableData"
            style="width: 100%"
            >
            <el-table-column type="expand" >
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" >
                <el-form-item label="序列标签结果" width="500">
                    <el-tag
                        :key="tag"
                        v-for="tag in props.row.label_res"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag, props.row)">
                        {{tag}}
                    </el-tag>
                </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="序号"
            prop="index"
            width="50">
            </el-table-column>
            <el-table-column
            label="内容"
            prop="content">
            </el-table-column>
            <el-table-column
            label="一致性"
            prop="ci"
            width="80">
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <el-button
                    size="mini"
                    type="success"
                    plain
                    v-if="scope.row.is_final"
                    @click="handleSave(scope.$index, scope.row)">修改</el-button>
                    <el-button
                    size="mini"
                    type="success"
                    v-if="!scope.row.is_final"
                    @click="handleSave(scope.$index, scope.row)">保存</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleCloseDialog">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {findInferInfoByTaskId, updateFinalResultByPosition, updatePointsAndInfoByTaskId} from '../../../unit/fetch';
export default {
    mounted(){
        this.init();
    },
    props: {
            editInfo: Object,
            selectShowPart: Function
        },
    data(){
        return{
            tableData: [],
            dialogVisible: false,
            options: this.editInfo.task_label.split(','),//存放可选标签
        }
    },
    methods: {
        async init(){
            const info  = await findInferInfoByTaskId({task_id: this.editInfo.id});
            info.data.map((item, index) =>{
                // 如果final_result存在，则在列表中显示final_result；否则显示infer_result
                if(item.final_result != null && item.final_result != ''){
                    this.tableData.push({index: index+1, 
                                content: item.content, 
                                ci: parseFloat(item.ci).toFixed(2),
                                label_res: item.final_result.split(','),
                                is_final: true});
                }else{
                    this.tableData.push({index: index+1, 
                                content: item.content, 
                                ci: parseFloat(item.ci).toFixed(2),
                                label_res: item.infer_result.split(','),
                                is_final: false});
                }
            })
        },
        handleEdit(index, row) {
            this.dialogVisible = true;
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        //发布者将标签保存到infer_result中
        async handleSave(index, row) {
            var finStr = row.label_res.toString();
            await updateFinalResultByPosition({task_id: this.editInfo.id, paragraph_position: index, final_result: finStr});
        },
        handleClose(tag, row) {
            //tag是待删除的标签内容，row是该标签所在句子的标记结果信息
            var tagIndex = row.label_res.indexOf(tag);
            row.label_res.splice(tagIndex, 1);
        },
        handleCloseDialog(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        async downLoadRes(type){
            const infer_res = await findInferInfoByTaskId({task_id:this.editInfo.id});
            updatePointsAndInfoByTaskId({task_id: this.editInfo.id});
            var finalLabel = [];
            for(var i = 0; i<infer_res.data.length; i++){
                finalLabel.push(infer_res.data[i].final_result);
            }
            var urlObject = window.URL || window.webkitURL || window;
            var export_blob = new Blob([txtResult]);
            var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = this.editInfo.task_name + '.txt';
            var ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(ev);
        },
        // async function1(type){
        //     const infer_res = await findInferInfoByTaskId({task_id: this.editInfo.id});
        //     updatePointsAndInfoByTaskId({task_id: this.editInfo.id});//需要确认这个接口在序列标注中是否正确
        //     await Promise.all(infer_res.data.map((item, index) => {
        //         var splitSentence = item.content.split('');
        //         splitSentence.push(' ');
        //         var startIndex = [];
        //         var endIndex = [];
        //         if(item.final_result == '' || item.final_result == null || item.final_result == undefined){
        //             return index;//表明当前下载的任务中有未被发布者确认的句子，此时不支持导出
        //         }else{
        //             var resArr = item.final_result.split(',');
        //             for(var i = 0; i<resArr; i++){
        //                 var temp = resArr[i].split('-');
        //                 startIndex.push(temp[0])
        //             }
        //         }
        //     }))
        //     // var finalLabel = [];
        //     // for(var i = 0; i<infer_res.data.length; i++){
        //     //     finalLabel.push(infer_res.data[i].final_result);
        //     // } 
        // },
        //导出序列标注结果 包含嵌套表达
        async outTxt(begin,end,type){
            const sentencesInfo = await findSentenceFromOffset({offset:begin-1,count:end-begin+1});
            this.allSentences = [];
            await Promise.all(sentencesInfo.data.map(async (item)=>{
                var splitSentence = item.content.split('');
                // splitSentence.pop();
                splitSentence.push(" ");
                this.startIndex = [];
                this.endIndex = [];
                if(item.is_marked == 0){
                    this.obtainUnmarked = true;
                }else{
                    const indexInfo = await getEntityIndexBySentenceId({id_sentence:item.id});
                    indexInfo.data.map((item)=>{
                        this.startIndex.push(item.start_index);
                        this.endIndex.push(item.end_index);
                    })
                    this.addBIO(splitSentence,this.startIndex,this.endIndex,type);
                    this.allSentences = this.allSentences.concat(splitSentence);
                }
            }))
            this.textarea = '';
            for(var index = 0;index < this.allSentences.length;index++ ){
                while(this.allSentences[index].split(/\t/).length < (1 + this.lineNum)){//为保证所有句子输出时列数相同
                    this.allSentences[index] = this.allSentences[index] +"\tO";
                    }
                this.textarea = this.textarea + this.allSentences[index] + '\n';
            }
            if(this.obtainUnmarked){
                this.$message({
                    type: 'warning',
                    message: '所选句子中包含未标记的句子！'
                    });
            }
        },

        addBIO(all,start,end,type){
            let lengthOfSentence = all.length;
            var minStart = 0, minEnd = 0;
            for(let i = 1; start.length != 0;i++){//判断该句子实体展示需要多少列
                var lineStartIndex =[];//存储当列展现的实体位置
                var lineEndIndex =[];
                minStart = Math.min.apply(null,start);
                if(type == 0){
                    minEnd = this.findShortestEndIndex(minStart,start,end)//该起始位置的最短实体
                }else if(type == 1){
                    minEnd = this.findLongestEndIndex(minStart,start,end)
                }
                lineStartIndex.push(minStart);
                lineEndIndex.push(minEnd);//记录到当列存储数组中,元素为实体在句子中的位置
                //lastEndIndex为当列目前存在的、最后一个实体的位置
                // nextStart为得到的下一个实体位置
                for (var lastEndIndex = minEnd; lastEndIndex < lengthOfSentence; ){
                    var nextStart = this.findMinStartAfterEndIndex(lastEndIndex,start);
                    if(nextStart != -1){
                        if(type == 0){
                            var nextEnd = this.findShortestEndIndex(nextStart,start,end)
                        }else if(type == 1){
                            nextEnd = this.findLongestEndIndex(nextStart,start,end)
                        }
                        lineStartIndex.push(nextStart);
                        lineEndIndex.push(nextEnd);
                        lastEndIndex = nextEnd;
                    }else{
                        break;
                    }
                }
                //到此，可最大限度存放在同一列的实体位置信息（同一列实体相互独立，没有嵌套、重叠关系）已经全部保存在了lineStartIndex和lineEndIndex中，接下来对这一列实体进行标注。
                var lineLength = lineStartIndex.length;
                    for(var n = 0; n < lineLength; n++){
                        var indexB = lineStartIndex[n];
                        all[indexB] = all[indexB] +"\tB-MCF";
                        for(var indexI = lineStartIndex[n] +1 ; indexI > lineStartIndex[n] && indexI < lineEndIndex[n] ; indexI++){
                            all[indexI] = all[indexI] +"\tI-MCF";
                        }
                    }
                    for(var indexO = 0;indexO < lengthOfSentence; indexO++){
                            if(all[indexO].split(/\t/).length < 1+i){
                                all[indexO] = all[indexO] +"\tO";
                            }
                    }
                this.lineNum = Math.max(this.lineNum,i)
            }
        },
        findShortestEndIndex(startNum,start,end){//a是实体起始位置，需要找到从该点开始的最短实体
            var endNum = [];//存放startNum对应的实体结束位置
            var indexOfEndNUm = [];//startNum对应的实体结束位置在end中的位置，便于从start和end中删除对应元素
            for(let index = 0; start.indexOf(startNum,index) != -1;){//找到startnum在起始位置序列中的位置，在结束位置序列的对应位置找到endnum
                index = start.indexOf(startNum,index);
                indexOfEndNUm.push(index);
                endNum.push(end[index]);
                index = index + 1;
            }
            var shortestEnd = Math.min.apply(null,endNum);
            var indexOfShortestEnd = indexOfEndNUm[endNum.indexOf(shortestEnd)];
            start.splice(indexOfShortestEnd,1);
            end.splice(indexOfShortestEnd,1);
            return shortestEnd;
        },
        findLongestEndIndex(startNum,start,end){//a是实体起始位置，需要找到从该点开始的最长实体
            var endNum = [];//存放startNum对应的实体结束位置
            var indexOfEndNUm = [];//startNum对应的实体结束位置在end中的位置，便于从start和end中删除对应元素
            for(let index = 0; start.indexOf(startNum,index) != -1;){//找到startnum在起始位置序列中的位置，在结束位置序列的对应位置找到endnum
                index = start.indexOf(startNum,index);
                indexOfEndNUm.push(index);
                endNum.push(end[index]);
                index = index + 1;
            }
            var longestEnd = Math.max.apply(null,endNum);
            var indexOfLongestEnd = indexOfEndNUm[endNum.indexOf(longestEnd)];
            start.splice(indexOfLongestEnd,1);
            end.splice(indexOfLongestEnd,1);
            return longestEnd;
        }
    }
}
</script>

<style scoped>
    .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>