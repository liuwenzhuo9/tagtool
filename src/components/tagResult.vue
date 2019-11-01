<template>
    <div class='output'>从第&nbsp;<el-input v-model="begin" size="mini"></el-input>&nbsp;句到第&nbsp;<el-input v-model="end" size="mini"></el-input>&nbsp;句 
    <el-button type="success"  @click="outTxt(begin,end)" v-if="textarea ==''">导出</el-button>
    <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}"  v-model="textarea" v-if="showInput"></el-input>
    <el-button type="success" @click="saveTxt('test.txt',textarea)" v-if="textarea!=''">确认保存为txt</el-button>
    <el-button type="warning" @click="cancel()" v-if="textarea!=''">取消</el-button>
    </div>
</template>>

<script>
import {findSentenceFromOffset, getEntityIndexBySentenceId} from '../unit/fetch';
export default {
    data(){
        return {
            textarea:'',
            begin:'',
            end:'',
            showInput:false,
            startIndex:[],
            endIndex:[],
            allSentences:[]
        }
    },
    methods:{
        async outTxt(begin,end){
            const sentencesInfo = await findSentenceFromOffset({offset:begin-1,count:end-begin+1});
            this.allSentences = [];
            await Promise.all(sentencesInfo.data.map(async (item)=>{
                var splitSentence = item.content.split('');
                // splitSentence.pop();
                this.startIndex = [];
                this.endIndex = [];
                const indexInfo = await getEntityIndexBySentenceId({id_sentence:item.id});
                indexInfo.data.map((item)=>{
                    this.startIndex.push(item.start_index);
                    this.endIndex.push(item.end_index);
                })
                this.addBIO(splitSentence,this.startIndex,this.endIndex);
                this.allSentences = this.allSentences.concat(splitSentence);
            }))
            this.showInput = true;
            this.textarea = '';
            for(var index = 0;index < this.allSentences.length;index++ ){
                this.textarea = this.textarea + this.allSentences[index] + '\n';
            }
        },

        addBIO(all,start,end){
            window.console.log(all)
            window.console.log(start)
            window.console.log(end)
            let lengthOfSentence = all.length;
            var minStart = 0, indexOfMin = 0, minEnd = 0;
            for(let i = 1; start.length != 0;i++){//判断该句子实体展示需要多少列
            window.console.log(start)
                var lineStartIndex =[];//存储当列展现的实体位置
                var lineEndIndex =[];
                minStart = Math.min.apply(null,start);
                indexOfMin = start.indexOf(minStart);
                minEnd = end[indexOfMin];
                lineStartIndex.push(minStart);
                lineEndIndex.push(minEnd);//记录到当列存储数组中,元素为实体在句子中的位置
                start.splice(indexOfMin,1);
                end.splice(indexOfMin,1);//删除已记录到列的位置信息
                //lastEndIndex为当列目前存在的、最后一个实体的位置
                // nextStart为得到的下一个实体位置
                for (var lastEndIndex = minEnd; lastEndIndex < lengthOfSentence; ){
                    var nextStart = this.findMinStartAfterEndIndex(lastEndIndex,start);
                    if(nextStart != -1){
                        var indexOfnextStart = start.indexOf(nextStart);
                        var nextEnd = end[indexOfnextStart]
                        lineStartIndex.push(nextStart);
                        lineEndIndex.push(nextEnd);
                        start.splice(indexOfnextStart,1);
                        end.splice(indexOfnextStart,1);
                        lastEndIndex = nextEnd;
                    }else{
                        break;
                    }
                }
                //到此，可最大限度存放在同一列的实体位置信息（同一列实体相互独立，没有嵌套、重叠关系）已经全部保存在了lineStartIndex和lineEndIndex中，接下来对这一列实体进行标注。
                var lineLength = lineStartIndex.length;
                    for(var n = 0; n < lineLength; n++){
                        var indexB = lineStartIndex[n];
                        all[indexB] = all[indexB] +" B";
                        for(var indexI = lineStartIndex[n] +1 ; indexI > lineStartIndex[n] && indexI < lineEndIndex[n] ; indexI++){
                            all[indexI] = all[indexI] +" I";
                        }
                    }
                    for(var indexO = 0;indexO < lengthOfSentence; indexO++){
                            if(all[indexO].length < 1+i*2){
                                all[indexO] = all[indexO] +" O";
                            }
                    }
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
            this.showInput = false;
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
}
</style>