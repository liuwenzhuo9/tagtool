<template>
    <div class='output'>从第&nbsp;<el-input v-model="begin" size="mini"></el-input>&nbsp;句到&nbsp;<el-input v-model="end" size="mini"></el-input>&nbsp;几句 
    <el-button type="success" plain @click="outTxt(begin,end)">导出成txt文件</el-button>
    </div>
</template>>

<script>
export default {
    data(){
        return {
            input1:'',
            input2:''
        }
    },
    methods:{
        outTxt(begin,end){
            window.console.log(begin);
            window.console.log(end);
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