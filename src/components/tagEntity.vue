<template>
    <div class="tagEntity">
        <div class = "inputarea">{{textarea}}</div>
            &nbsp;&nbsp;
            <div class = "button1">
                <el-button type="primary" v-if="isMarked" @click="addTag()" size="mini">添加标签</el-button>
                <el-button type="success" v-if="isMarked" @click="saveTag()" size="mini">保存标记</el-button>
            </div>
        
        <div class = "tagarea">
            <el-tag :key="index" v-for="(tag,index) in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
                {{tag.content}}&nbsp;{{tag.index}}
            </el-tag>
        </div>

        <div class=button2>
            <el-button-group>
                <el-button type="primary" icon="el-icon-arrow-left" size="small" @click="turnToLast()">上一句</el-button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <el-button type="primary" size="small" @click="turnToNext()">下一句<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
        </div>

    </div>
</template>

<script>
import {findIdBySentence, getLastSentence, getNextSentence, getFirstUnmarkedSentence, deleteEntity, insertEntityIndex, insertEntity, deleteEntityByEntityId, updateSentenceMarkById, getAllEntity} from "../unit/fetch";
export default {
    data() {
        return {
            textareaId:'',
            dynamicTags: [],
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
          this.preTag();
      },
      async preTag() {
          const lastEntity = this.allEntity;
          try{
                const info = await getAllEntity();
                info.data.map(async (item) =>{
                this.allEntity.push(item)
                    for(var index = 0; this.textarea.indexOf(item.content,index) != -1;){
                        const startIndex = this.textarea.indexOf(item.content);
                        const endIndex = startIndex + item.length;
                        index = endIndex;
                        var tagContent = '';
                        tagContent = {content:item.content,index:'(' + startIndex + ',' + endIndex + ')'};
                        this.dynamicTags.push (tagContent);
                        await insertEntityIndex({id_sentence:this.textareaId, id_entity:item.id, start_index:startIndex, end_index:endIndex})
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
            // 将信息显示在标签中
            var tagContent = '';
            tagContent = {content:selection,index:'(' + startIndex + ',' + endIndex + ')'};
            this.dynamicTags.push (tagContent);
            // 将标签内容添加到数据库中
            const info = await insertEntity({content:selection,length:entityLength});
            var entityId = info.data;
            await insertEntityIndex({id_sentence:this.textareaId, id_entity:entityId, start_index:startIndex, end_index:endIndex})
      },
    //   删除标签
      handleClose(tag) {
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
            .then(async () => {
                const info = await deleteEntity({content:tag.content});
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
          this.preTag();
      },
      async turnToNext() {
          const info = await getNextSentence({id : this.textareaId});
          const count = info.data[0];
          this.textarea = count.content;
          this.textareaId = count.id;
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
    margin: 5px;
}
#txt{
    width: 700px;
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