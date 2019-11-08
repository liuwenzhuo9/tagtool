<template>
    <div class="tagEntity">
        <div class = "left">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>第{{textIndex}}句</span>
                </div>
                <div  class="text item">{{textarea}}</div>
            </el-card>

            <div class = "button">
                <el-button type="primary" v-if="!isEdit" @click="addTag()" size="small">添加标签</el-button>
                <el-button type="success" v-if="!isEdit" @click="saveTag()" size="small">保存标记</el-button>
                <el-button type="success" v-if="isEdit" @click="editTag()" size="small">修改标记</el-button>
                <el-button type="danger" v-if="!isEdit && dynamicTags.length != 0" @click="deleteAllTag()" size="small">删除所有标签</el-button>
                <el-button type="warning" v-if="isQuitEdit" @click="quitEditTag()" size="small">取消修改</el-button>
                <el-button type="primary" icon="el-icon-arrow-left" size="small" @click="turnTo(1,isShowAll)" :disabled="isFirst">上一句</el-button>
                <el-button type="primary" size="small" @click="turnTo(2,isShowAll)" :disabled="isLast">下一句<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </div>
            <div class = "tagarea">
                <el-tag :key="index" v-for="(tag,index) in dynamicTags" :closable="!isEdit" :disable-transitions="false" @close="handleClose(tag.content,index)">
                    {{tag.content}}&nbsp;({{tag.startIdx}},{{tag.endIdx}})
                </el-tag>
            </div>
        </div>
        <div class ="right">
            <el-row>
            <el-col :span="24">
            <el-card shadow="always">
                <el-dropdown @command="handleCommandShow">
                    <span class="el-dropdown-link">
                        选择显示内容<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">显示全部句子</el-dropdown-item>
                        <el-dropdown-item command="0">显示未标记句子</el-dropdown-item>
                        <el-dropdown-item  disabled>默认显示未标记句子</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <p v-if="isShowAll">当前：显示全部句子</p>
                <p v-if="!isShowAll">当前：显示未标记句子</p>
                <el-divider></el-divider>
                <el-dropdown @command="handleCommandDelete">
                    <span class="el-dropdown-link">
                        选择删除标签的方式<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="0">仅在该句中删除标签</el-dropdown-item>
                        <el-dropdown-item command="1">在所有句子中删除该标签</el-dropdown-item>
                        <el-dropdown-item  disabled>默认在所有句子中删除该标签</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <p v-if="isDeleteinAll">当前：在所有句子中删除该标签</p>
                <p v-if="!isDeleteinAll">当前：仅在该句中删除标签</p>
            </el-card>
            </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import {findIdBySentence, getAllEntity, findIdByEntity, getLastSentence, getNextSentence, getFirstUnmarkedSentence, deleteEntity, insertEntityIndex, insertEntity, deleteEntityByEntityId, deleteEntityBySentenceId, updateSentenceMarkById, findIndexBySentenceId} from "../unit/fetch";
export default {
    data() {
        return {
            textIndex:'',
            textareaId:'',
            textarea:'',
            dynamicTags: [],
            dynamicTagsPre: [],
            dynamicTagsNow: [],
            isEdit:false,//是否显示“修改标签”按钮
            isFirst:false,
            isLast:false,
            isShowAll:0,//显示未标记句子
            isDeleteinAll:1,//在所有句子中删除该标签
            isQuitEdit:false
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
              if(this.$store.state.isMark){
                  this.isEdit = this.$store.state.isMark
              }
          }else{
              const info = await getFirstUnmarkedSentence();
              this.textarea = info.data[0].content;
              this.textareaId = info.data[0].id;
          }
          const infoIndex = await findIndexBySentenceId({id:this.textareaId});
          this.textIndex = infoIndex.data;
          await this.preTag();
          this.judgeFirstandLast();
      },
      async judgeFirstandLast(){// 显示是否为第一条or最后一条
          const infoL =  await getLastSentence({id : this.textareaId, is_marked : this.isShowAll});
          const infoN =  await getNextSentence({id : this.textareaId, is_marked : this.isShowAll});
          if(infoL.data == 0){ //已是第一条
            this.isFirst = true
          }else{
            this.isFirst = false
          }
          if(infoN.data == 0){//已是最后一条
            this.isLast = true
          }else{
            this.isLast = false
          }
      },
    //   预标记的标签内容存在dynamicTagsPre数组中。还没有插入entityIndex表中，保存标记时才将所有实体信息保存在entityIndex中。
      async preTag() {
         this.dynamicTags = [];
         this.dynamicTagsPre = [];
         this.dynamicTagsNow = [];
         const info = await getAllEntity();
         info.data.map( (item) =>{
            for(let index = 0; this.textarea.indexOf(item.content,index) != -1;){
                let startIndex = this.textarea.indexOf(item.content,index);
                let endIndex = startIndex + item.length;
                index = endIndex + 1;
                let tagContent = [];
                tagContent = {content:item.content, startIdx: startIndex, endIdx: endIndex, id:item.id};
                this.dynamicTagsPre.push (tagContent);
            }
        })
        this.dynamicTags = this.dynamicTags.concat(this.dynamicTagsPre);//存储预标记的内容
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
            var startIndex = Math.min(selectTxt.anchorOffset,selectTxt.focusOffset);
            var endIndex = Math.max(selectTxt.anchorOffset,selectTxt.focusOffset);//防止标记顺序从右到左时，记录错误
            var entityLength = endIndex-startIndex;
            var infoPre = [];
            var infoNow = [];
            var infoNowStart = [];
            if(selection == ''||selection == null){
                this.$message({
                    type: 'info',
                    message: '选中内容为空！'
                    });
            }else{
                // 添加标签之前先判断是否被预标记过
                if(this.dynamicTagsPre.length != 0){
                    this.dynamicTagsPre.map((item) =>{
                        infoPre.push(item.content);//存放预标记dynamicTagsPre中已有的标签内容
                    });
                }
                
                if(this.dynamicTagsNow.length != 0){
                    this.dynamicTagsNow.map((item) =>{
                        infoNow.push(item.content);//存放新加的标签 (预标记之后通过add添加的)
                        infoNowStart.push(item.startIdx); 
                    })
                }
                
                var tagContent = [];
                if(infoPre.indexOf(selection) == -1){//预标记中不含有选中内容
                    var isInNow = infoNow.indexOf(selection)
                    var isSame = infoNowStart[isInNow]
                    if( isInNow == -1){//新加的标签中不含选中内容
                        // 将标签内容添加到数据库中
                        const info =  await insertEntity({content:selection,length:entityLength});
                        tagContent = {content:selection, startIdx:startIndex, endIdx: endIndex, id:info.data};
                        this.dynamicTagsNow.push (tagContent);
                        this.dynamicTags.push (tagContent);
                    }else if( isSame != startIndex){//新加的标签中已有该内容，则不用加入entityONly表中。且在不同位置。
                        // 将信息显示在标签中
                        const info = await findIdByEntity({content:selection})
                        tagContent = {content:selection, startIdx:startIndex, endIdx: endIndex, id:info.data};
                        this.dynamicTagsNow.push (tagContent);
                        this.dynamicTags.push (tagContent);
                    }else{//新加的标签中已有该内容，且在相同位置。不允许重复标记
                        this.$message({
                        type: 'info',
                        message: '该实体已被标记，请勿重复标记'
                        });
                    }
                }else{
                    this.$message({
                        type: 'info',
                        message: '该实体已被预标记，请勿重复标记'
                        });
                }
            }
            
      },
    //   删除标签
      handleClose(item,index) {
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
            .then(async () => {
                if(this.isDeleteinAll == 1){//删除所有句子中的该标签
                    const info = await deleteEntity({content:item});
                    const entityId = info.data;
                    await deleteEntityByEntityId({id_entity:entityId});
                }
                this.dynamicTags.splice(index, 1);//仅删除该句中的该标签
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
    //   删除该句子所有标签
      deleteAllTag(){
          this.$confirm('确定要删除该句子的所有标记？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
            .then(async () => {
                await Promise.all(this.dynamicTags.map((tag) =>{
                    if(this.isDeleteinAll == 1){//删除所有句子中的该标签
                    const info = deleteEntity({content:tag.content});
                    const entityId = info.data;
                    deleteEntityByEntityId({id_entity:entityId});
                    }
                }))
                deleteEntityBySentenceId({id_sentence:this.textareaId});
                this.isEdit = false;
                this.isQuitEdit = false;
                this.dynamicTags = [];//仅删除该句中的该标签
                this.dynamicTagsPre = [];
                this.dynamicTagsNow = [];
                updateSentenceMarkById({id:this.textareaId,is_marked:0});//删除全部标签后改变句子的标记状态
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
      },
      saveTag(){
          if(this.dynamicTags.length == 0){
              this.$message({
                    type: 'warning',
                    message: '该句子未被标记，无法保存标记！'
                    });
          }else{
                this.$confirm('确定要保存标记？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        })
                    .then(async () => {
                        await deleteEntityBySentenceId({id_sentence:this.textareaId})
                        this.dynamicTags.map((item) =>{
                            insertEntityIndex({id_sentence:this.textareaId, id_entity:item.id, start_index:item.startIdx, end_index:item.endIdx})
                        })
                        updateSentenceMarkById({id:this.textareaId,is_marked:1});
                        this.isQuitEdit = false;
                        this.isEdit = true;
                        if(!this.isLast){
                            this.$message({
                            type: 'success',
                            message: '保存成功！'
                            })
                        }else{
                            this.$message({
                            type: 'success',
                            message: '保存成功！已是最后一句！'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消保存'
                        });          
                    });
           }
      },
      async editTag(){
          this.isEdit = false;
          this.isQuitEdit = true;
          await this.preTag();
          this.judgeFirstandLast();
      },
      quitEditTag(){
          this.isEdit = true;
          this.isQuitEdit = false;
          this.$message({
            type: 'info',
            message: '已取消修改'
            });
      },
      //选择删除全部/当前句子中的标签
      handleCommandDelete(command){
          if( command == 1){
              this.isDeleteinAll = 1;//删除全部句子中的该标签
          }else{
              this.isDeleteinAll = 0;//删除当前句子中的该标签
          }
      },
      //选择显示全部还是未标记句子
      handleCommandShow(command) {
        if( command == 1){
              this.isShowAll = 1;//查看全部句子
          }else{
              this.isShowAll = 0;//查看未标记句子
          }
        this.judgeFirstandLast();
      },
      async turnTo(msg,type) {
          window.console.log(type)
          var info = [];
          if(msg == 1){
              info = await getLastSentence({id : this.textareaId, is_marked : type});
          }else if(msg == 2){
              info = await getNextSentence({id : this.textareaId, is_marked : type});
          }
         const count = info.data[0];
         if(count.is_marked == 0){
             this.isEdit = false;
         }else{
             this.isEdit = true;
         }
         this.textarea = count.content;
         this.textareaId = count.id;
         const infoIndex = await findIndexBySentenceId({id:this.textareaId});
         this.textIndex = infoIndex.data;
         this.preTag();
         this.judgeFirstandLast();
      }
    }
}
</script>

<style lang='scss' scoped>
.tagEntity{
    width: 100%;
    margin:10px;
}
.right{
    width: 22%;
    float: right;
    .el-card{
    background:#e1ebf5;
    color:#909399;
    font-size: 15px;
    min-height: 240px;
    }
}
.left{
    width: 75%;
    float: left;
    .el-card{
    background:#e1ebf5;
    color:#5d5d5d;
    font-size: 20px;
    min-height: 240px;
    }
}
.clearfix{
    color:#8b8d90;
}
.el-dropdown-link {
    cursor: pointer;
    color: #606266;
  }
.el-icon-arrow-down {
    font-size: 12px;
  }
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
    font-size: 18px;
    margin: 30px 10px;
}
.tagarea{
    width: 92%;
    // margin: 30px 0px;
}
.el-tag {
    margin: 10px;
    font-size: 17px
}
.el-button--primary:focus{
    background: #409EFF;
    border-color: #409EFF;
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
.el-button--danger:hover {
    background: #f78989;
    border-color: #f78989;
    color: #FFF;
}
.el-button--danger:focus{
    color: #FFF;
    background-color: #F56C6C;
    border-color: #F56C6C;
}
</style>