<template>
    <div class="tagEntity">
        <div class = "inputarea">
            <input type="text" id="txt" value="abcdefghijklmn" @click="getSelectPosition(this)">点击文本框内容触发事件<br/>
            <!-- <el-input type="textarea"  placeholder="请输入内容" v-model="textarea" @select="getSelectPosition(this)"></el-input> -->
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
            <!-- <p>当前是第{{textIndex}}条</p> -->
                <el-button-group>
                    <el-button type="primary" icon="el-icon-arrow-left" size="small" @click="turnToLast()">上一句</el-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button type="primary" size="small" @click="turnToNext()">下一句<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
            </div>

    </div>
</template>

<script>
import {findIdBySentence, getLastSentence, getNextSentence, getFirstUnmarkedSentence} from "../unit/fetch";
export default {
    data() {
        return {
            textareaId:'',
            dynamicTags: ['标签一', '标签二', '标签三'],
            inputVisible: false,
            textarea:'',
            inputValue: '',
            // textIndex:''
        }
    },
    mounted(){
        this.setTextarea();
    },
    methods: {
      async setTextarea(){
          if(this.$store.state.content){
              this.textarea = this.$store.state.content;
              this.textIndex = this.$store.state.index;
              const info = await findIdBySentence({content:this.textarea});
              this.textareaId = info.data;
          }else{
              const info = await getFirstUnmarkedSentence();
              this.textarea = info.data[0].content;
              this.textareaId = info.data[0].id;
          }
          
      },
      getSelectPosition(oTxt) {
            var nullvalue = -1;
            var selectStart ;//选中开始位置
			var selectEnd ;//选中结束位置
			var position;//焦点位置
			var selectText;//选中内容
            if(oTxt.setSelectionRange){//非IE浏览器
                selectStart= oTxt.selectionStart;
				selectEnd = oTxt.selectionEnd;
				if(selectStart == selectEnd){
					position = oTxt.selectionStart;
					selectStart = nullvalue;
					selectEnd = nullvalue;
				}else{
					position = 	nullvalue;
				}
                selectText = oTxt.value.substring(selectStart,selectEnd);
            }else{//IE
                var range = document.selection.createRange();
				selectText=range.text;
                range.moveStart("character",-oTxt.value.length);
				position = range.text.length;
				selectStart = position - (selectText.length);
				selectEnd = selectStart + (selectText.length);
				if(selectStart != selectEnd){
					position = nullvalue;
				}else{
					selectStart = nullvalue;
					selectEnd = nullvalue;
				}
            }
            window.console.log(selectStart)
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
      },
      async turnToLast() {
          const info = await getLastSentence({id : this.textareaId});
          const count = info.data[0];
          this.textarea = count.content;
          this.textareaId = count.id;
      },
      async turnToNext() {
          const info = await getNextSentence({id : this.textareaId});
          const count = info.data[0];
          this.textarea = count.content;
          this.textareaId = count.id;
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