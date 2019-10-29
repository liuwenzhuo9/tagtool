<template>
    <div class="tagEntity">
        第{{textIndex}}句：
        <div class = "inputarea">{{textarea}}</div>
            <div class = "button">
                <el-button type="primary" v-if="isMarked" @click="addTag()" size="small">添加标签</el-button>
                <el-button type="success" v-if="isMarked" @click="saveTag()" size="small">保存标记</el-button>
                <el-button type="primary" icon="el-icon-arrow-left" size="small" @click="turnToLast()">上一句</el-button>
                <el-button type="primary" size="small" @click="turnToNext()">下一句<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </div>
        <div class = "tagarea">
            <el-tag :key="index" v-for="(tag,index) in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag.content)">
                {{tag.content}}&nbsp;({{tag.startIdx}},{{tag.endIdx}})
            </el-tag>
        </div>

    </div>
</template>

<script>
import {findIdBySentence, getLastSentence, getNextSentence, getFirstUnmarkedSentence, deleteEntity, insertEntityIndex, insertEntity, deleteEntityByEntityId, updateSentenceMarkById, getAllEntity, findIndexBySentenceId} from "../unit/fetch";
export default {
    data() {
        return {
            textIndex:'',
            textareaId:'',
            dynamicTags: [],
            dynamicTagsPre: [],
            dynamicTagsNow: [],
            textarea:'',
            isMarked:true,
            allEntity:[],//实体{id content length}的数组
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
          const infoIndex = await findIndexBySentenceId({id:this.textareaId});
          this.textIndex = infoIndex.data;
          this.preTag();
      },
    //   预标记的标签内容存在dynamicTags数组中，没有插入entityIndex表中，保存标记时才将所有实体信息保存在entityIndex中。
      async preTag() {
          this.dynamicTags = [];
          const lastEntity = this.allEntity;
          try{
                const info = await getAllEntity();
                info.data.map((item) =>{
                    this.allEntity.push(item)
                        for(var index = 0; this.textarea.indexOf(item.content,index) != -1;){
                            const startIndex = this.textarea.indexOf(item.content);
                            const endIndex = startIndex + item.length;
                            index = endIndex;
                            var tagContent = '';
                            tagContent = {content:item.content, startIdx: startIndex, endIdx: endIndex, id:item.id};
                            this.dynamicTags.push (tagContent);
                            this.dynamicTagsPre = this.dynamicTags;//存储预标记的内容
                        }
                })
          }catch(e){
              this.allEntity = [...lastEntity];
              this.$message.error((e && e.message) ? e.message : '获取实体错误，请稍后重试');
          }
      },
      async addTag() {
          //不同浏览器兼容问题，获取选中的内容及坐标
          if (window.getSelection) {
            var selectTxt = window.getSelection();
            } else if (window.document.getSelection) {
                selectTxt = window.document.getSelection();
            } else if (window.document.selection) {
                selectTxt = window.document.selection.createRange().text;
            }
            var selection = selectTxt.toString();
            var startIndex = selectTxt.anchorOffset;
            var endIndex = selectTxt.focusOffset;
            var entityLength = endIndex-startIndex;
            // 添加标签之前先判断是否被预标记过
            var infoPre = [];
            this.dynamicTagsPre.map((item) =>{
                infoPre.push(item.content);//存放预标记dynamicTags中已有的标签内容
            })
            var infoNow = [];
            this.dynamicTagsNow.map((item) =>{
                infoNow.push(item.content);//存放新加的标签
            })
            if(infoPre.indexOf(selection) == -1){//预标记中不含有选中内容
                if(infoNow.indexOf(selection) == -1){//新加的标签中不含选中内容
                    // 将标签内容添加到数据库中
                    const info =  await insertEntity({content:selection,length:entityLength});
                    var entityId = info.data;
                }else{//新加的标签中已有该内容，则不用加入entityONly表中
                    // 将信息显示在标签中
                    var tagContent = {content:selection, startIdx:startIndex, endIdx: endIndex, id:entityId};
                    this.dynamicTagsNow.push (tagContent);
                }   
            }else{
                this.$message({
                    type: 'info',
                    message: '该实体已被预标记，请勿重复标记'
                    });
            }
            this.dynamicTags.concat(this.dynamicTagsNow);
      },
    //   删除标签
      handleClose(tag) {
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
            .then(async () => {
                const info = await deleteEntity({content:tag});
                const entityId = info.data;
                await deleteEntityByEntityId({id_entity:entityId});
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
      },
      saveTag(){
          this.$confirm('此操作将保存已有标签, 且不能再添加新标签，确定要保存标记？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
            .then(async () => {
                this.dynamicTags.map((item) =>{
                    insertEntityIndex({id_sentence:this.textareaId, id_entity:item.id, start_index:item.startIdx, end_index:item.endIdx})
                })
                updateSentenceMarkById({id:this.textareaId,is_marked:1});
                this.isMarked = false;
                this.$message({
                    type: 'success',
                    message: '保存成功!'
                });
                this.turnToNext();
                this.dynamicTags = [];
                this.isMarked = true;
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消保存'
                });          
            });
      },
      async turnToLast() {
          const info = await getLastSentence({id : this.textareaId});
          const count = info.data[0];
          this.textarea = count.content;
          this.textareaId = count.id;
          const infoIndex = await findIndexBySentenceId({id:this.textareaId});
          this.textIndex = infoIndex.data;
          this.preTag();
      },
      async turnToNext() {
          const info = await getNextSentence({id : this.textareaId});
          const count = info.data[0];
          this.textarea = count.content;
          this.textareaId = count.id;
          const infoIndex = await findIndexBySentenceId({id:this.textareaId});
          this.textIndex = infoIndex.data;
          this.preTag();
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
    margin: 20px 10px;
}
.button{
    display: flex;
    width: 20%;
    height: 33px;
    font-size: 14px;
    margin: 30px 10px;
}
.tagarea{
    width: 92%;
    margin: 30px 0px;
}
.el-tag {
    margin: 10px;
    font-size: 17px
}
</style>