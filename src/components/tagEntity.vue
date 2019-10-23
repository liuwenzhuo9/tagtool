<template>
    <div class="tagEntity">
        <div class = "inputarea">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
            &nbsp;&nbsp;
            <div class = "button1">
                <el-button type="primary">添加标签</el-button>
                <el-button type="success">保存标记</el-button>
            </div>
        </div>

        <div class = "tagarea">
            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
                {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" 
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">
                + New Tag
            </el-button>
        </div>

        <div class=button2>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-arrow-left" size="small">上一页</el-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button type="primary" size="small">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
            </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            dynamicTags: ['标签一', '标签二', '标签三'],
            inputVisible: false,
            textarea:'',
            sentencesIndex:'',
            inputValue: ''
        }
    },
    mounted(){
        this.setTextarea();
    },
    methods: {
      async setTextarea(){
          this.textarea = this.$store.state.content
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
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
    width: 92%;
    margin: 5px;
}
.button1{
    display: flex;
    width: 20%;
    height: 40px;
    font-size: 14px;
}
.tagarea{
    width: 92%;
    margin: 10px;
}
.el-tag {
    margin-left: 10px;
    font-size: 17px
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    font-size: 17px
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
    font-size: 17px
}
.button2 {
    float: right;
    margin: 5px;
}
</style>