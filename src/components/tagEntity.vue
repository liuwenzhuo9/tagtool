<template>
    <div class="tagEntity">
        <div class="inputarea">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
        &nbsp;&nbsp;
        <el-button type="primary">添加标签</el-button>
        <el-button type="success">保存标记</el-button>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            textarea:"我和我的祖国，一刻也不能分割",
            
        }
    }
    
}
</script>

<style scoped>
.tagging{
    padding: auto;
}
.inputarea{
    display: flex;
    margin: 5px;
}
.el-button{
    font-size: 17px;
}
</style>