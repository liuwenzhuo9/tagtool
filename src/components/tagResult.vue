<template>
    <div class='output'>从第&nbsp;<el-input v-model="begin" size="mini"></el-input>&nbsp;句到第&nbsp;<el-input v-model="end" size="mini"></el-input>&nbsp;句 
    <el-button type="success" plain @click="outTxt(begin,end)">导出成txt文件</el-button>
    </div>
</template>>

<script>
import {findSentenceFromOffset, getEntityIndexBySentenceId} from '../unit/fetch';
export default {
    data(){
        return {
            begin:'',
            end:'',
            startIndex:[],
            endIndex:[],
            eachSentence:[],
            allSentences:[]
        }
    },
    methods:{
        async outTxt(begin,end){
            const sentencesInfo = await findSentenceFromOffset({offset:begin-1,count:end-begin+1});
            sentencesInfo.data.map(async (item)=>{
                this.eachSentence = item.content.split('');
                this.startIndex = [];
                this.endIndex = [];
                const indexInfo = await getEntityIndexBySentenceId({id_sentence:item.id});
                indexInfo.data.map((item)=>{
                    this.startIndex.push(item.start_index);
                    this.endIndex.push(item.end_index);
                })
                this.addBIO(this.eachSentence,this.startIndex,this.endIndex);
            })
        },

        addBIO(all,start,end){
            let lengthOfSentence = all.length;
            var minStart = 0, indexOfMin = 0, minEnd = 0;
            while(start.length!=0){
                minStart = Math.min.apply(null,start);//数据表的内容
                indexOfMin = start.indexOf(minStart);//在start中最小的起始位置index
                minEnd = end[indexOfMin];//数据表的内容
                for(let index = 0;index <= lengthOfSentence; index++){
                    if(index == minStart){
                        all[index] = all[index] +"B";
                    }else if(index > minStart && index < minEnd){
                        all[index] = all[index] +"I";
                    }else{
                        all[index] = all[index] +"0";
                    }
                }
                start.splice(indexOfMin,1);//将标记过的位置信息从start表中删除，直到start表为空，则标记结束。
                end.splice(indexOfMin,1);
            }
            this.eachSentence = all;
            window.console.log(all)
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
</style>