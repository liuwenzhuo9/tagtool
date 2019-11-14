<template>
    <div class='output'>
        从第&nbsp;
        <el-input v-model="begin" size="mini"></el-input>
        &nbsp;句到第&nbsp;
        <el-input v-model="end" size="mini"></el-input>
        &nbsp;句 
        <el-button type="success"  @click="outTxt(begin,end,1)" :disabled="!textarea ==''">大实体靠前导出</el-button>
        <el-button type="success"  @click="outTxt(begin,end,0)" :disabled="!textarea ==''">小实体靠前导出</el-button>
        <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 10}"  v-model="textarea" ></el-input>
        <br/>
        <el-button type="success" @click="saveTxt('test.txt',textarea)" :disabled="textarea ==''">确认保存为txt</el-button>
        <el-button type="warning" @click="cancel()" :disabled="textarea ==''">取消</el-button>
    </div>
</template>

<script>
import {findSentenceFromOffset, getEntityIndexBySentenceId} from '../unit/fetch';
export default {
    data(){
        return {
            textarea:'',
            begin:'',
            end:'',
            // showInput:false,
            startIndex:[],
            endIndex:[],
            allSentences:[],
            lineNum: 0
        }
    },
    mounted(){
        this.$store.commit('setActiveIndex',2)
    },
    methods:{
        async outTxt(begin,end,type){
            const sentencesInfo = await findSentenceFromOffset({offset:begin-1,count:end-begin+1});
            this.allSentences = [];
            await Promise.all(sentencesInfo.data.map(async (item)=>{
                var splitSentence = item.content.split('');
                splitSentence.pop();
                this.startIndex = [];
                this.endIndex = [];
                const indexInfo = await getEntityIndexBySentenceId({id_sentence:item.id});
                indexInfo.data.map((item)=>{
                    this.startIndex.push(item.start_index);
                    this.endIndex.push(item.end_index);
                })
                this.addBIO(splitSentence,this.startIndex,this.endIndex,type);
                this.allSentences = this.allSentences.concat(splitSentence);
            }))
            this.textarea = '';
            for(var index = 0;index < this.allSentences.length;index++ ){
                if(this.allSentences[index].split(/\t/).length < 1 + this.lineNum){//为保证所有句子输出时列数相同
                    this.allSentences[index] = this.allSentences[index] +"\tO";
                    }
                this.textarea = this.textarea + this.allSentences[index] + '\n';
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
        saveTxt(name, data){
            var urlObject = window.URL || window.webkitURL || window;
            var export_blob = new Blob([data]);
            var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = name;
            var ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(ev);
        },
        cancel(){
            // this.showInput = false;
            this.textarea = '';
        },
        findMinStartAfterEndIndex(a,b){//a是endIndex，b是存放实体起始位置的数组，找到b中比a大的最小值
            var arr =[]; 
                for(var index = 0;index < b.length;index++){
                    if(b[index] >= a){
                        arr.push(b[index]);
                    }
                }
                if(arr.length != 0){
                    var nextStart = Math.min.apply(null,arr);
                    return nextStart;
                }else{
                    return -1;
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
</script>>

<style scoped>
.output{
    display: inline-block;
    margin: 10px;
}
.el-input {
    position: relative;
    font-size: 11px;
    display: inline-block;
    width: 10%;
}
.el-textarea {
    margin: 10px;
    width:800px;
}
.el-button--success:focus{
    background: #67C23A;
    border-color: #67C23A;
}
 .el-button--success:hover {
    background: #85ce61;
    border-color: #85ce61;
    color: #FFF;
}
.el-button--warning:focus{
    background: #E6A23C;
    border-color: #E6A23C;
    color: #FFF;
}
.el-button--warning:hover  {
    background: #ebb563;
    border-color: #ebb563;
    color: #FFF;
}
</style>