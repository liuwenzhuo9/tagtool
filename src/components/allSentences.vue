<template>
    <div class="allsentences">
        <div class="input_sentences">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入句子" v-model="textarea" >
            </el-input>
            &nbsp;&nbsp;
            <div class="buttons">
                <el-button type="success" @click="handleClick()" v-if="!isEdit">确认添加</el-button>
                <el-button type="success" @click="handleClickEdit()" v-if="isEdit">确认修改</el-button>
                &nbsp;&nbsp;
                <el-upload  class="upload-demo" v-if="this.textarea == ''" action="https://jsonplaceholder.typicode.com/posts/" :on-success="handleSuccess" :before-remove="beforeRemove" list-type="text">
                <el-button size="middle" type="primary">上传txt文件</el-button>
                </el-upload>
                <el-button v-if="this.textarea !== ''" type="success" @click="handleClickEditQuit()">取消</el-button>
            </div>
        </div>
        <div class="show_sentences">
            <el-table :data="this.sentencesCurrent" style="width: 100%" >
                <el-table-column label="句子" width="1000" >
                    <template slot-scope="scope">
                        <p >
                            {{ scope.$index + (pageNumNow-1) * maxShowLength +1}}. &nbsp;&nbsp;{{ scope.row.content }}
                        </p>
                    </template>
                </el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.content)">删除</el-button>
                    <el-button size="mini"  v-if="!scope.row.is_marked" @click="handleTag(scope.$index, scope.row.content)">标记</el-button>
                    <el-button size="mini"  v-if="!scope.row.is_marked" @click="handleEdit(scope.$index, scope.row.content)" >编辑</el-button>  
                </template>
            </el-table-column>
        </el-table>
        </div>
        <hr/>
        <div class="show_bottom">
        共{{this.pageNumTotal}}页 跳转至第&nbsp;<el-input-number v-model="num" @change="handleChange(num)" :min="1" :max="1000" label="描述文字" size="mini"></el-input-number>
        &nbsp;页&nbsp;
                <el-button size="mini" @click="handleChange(num)">跳转</el-button>&nbsp;
        当前是第{{this.pageNumNow}}页
        <br>
            
        </div>
    </div>
</template>>

<script>
import {getAllSentences, insertSentence, deleteSentence, findIdBySentence, updateSentenceContentById} from '../unit/fetch';
export default {
    data () {
        return {
            textarea: '',
            isInitial:true,
            isEdit:false,
            editSentenceId:'',
            editSentenceIndex:'',
            sentences:[],//数据库中所有句子的内容
            markedId:[],//数据库中所有句子的编辑状态
            sentencesCurrent:[],//当前页面显示的句子
            splitSentence:[],//根据txt文档中回车得到的句子
            num:0,//加减跳转按钮的数字
            maxShowLength:10,//每页显示的条数
            pageNumTotal:'',//总页数
            pageNumNow:1,//当前页数
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        async init() {
            this.showAllSentences();
        },
        // 展示所有句子
        async showAllSentences(){
            const lastSentences = this.sentences;
                try{
                    this.sentences = [];
                    const info = await getAllSentences();
                    info.data.map((item) => {
                            this.sentences.push(item)
                            // this.markedId.push(item.is_marked)
                        })
                }catch(e){
                    this.sentences = [...lastSentences];
                    this.$message.error((e && e.message) ? e.message : '获取句子错误，请稍后重试');
                }
                this.pageNumTotal = Math.ceil(this.sentences.length/this.maxShowLength);
                if(this.isInitial){
                    this.showCurrentPage(this.pageNumNow);
                }
        },
        // 控制每页显示的句子个数（10）
        showCurrentPage(page){
            this.sentencesCurrent = [];
            // this.currentMarkedIndex = [];
            for(var index=(page - 1) * this.maxShowLength; index < (page * this.maxShowLength) && index < this.sentences.length ;index++){
                    this.sentencesCurrent.push(this.sentences[index]);
                    // this.currentMarkedIndex.push(this.markedId[index]);
                }
        },
        // 确认添加
        async handleClick(){
            if(this.textarea !== ''){
                this.textarea = this.textarea.toString()
                this.splitSentence = this.textarea.split('\n')
                await this.spiltByENTER();
                this.textarea=''
            }else{
                this.$message({
                message: '输入为空',
                type: 'warning'
                });
            }
            this.isInitial = false;
            await this.showAllSentences();
            this.pageNumNow = this.pageNumTotal;
            this.num = this.pageNumNow
            await this.showCurrentPage(this.pageNumNow);
            
        },
        async spiltByENTER(){
            await Promise.all(this.splitSentence.map(async (item) => {
                await insertSentence({content:item})
                }))
        },
        
        // 编辑句子
        async handleEdit(index, row) {
            this.isEdit = true
            this.textarea = row
            const info = await findIdBySentence({content:row})
            this.editSentenceId = info.data
            this.editSentenceIndex = index
        },
        // 确认编辑
        handleClickEdit(){
            updateSentenceContentById({id:this.editSentenceId,content:this.textarea})
            this.isEdit = false
            const editId = this.sentencesCurrent[this.editSentenceIndex]
            this.sentencesCurrent.splice(this.editSentenceIndex,1,{id:editId,content:this.textarea,is_marked:0})
            this.textarea = ''
        },
        // 取消添加或编辑
        handleClickEditQuit(){
            this.textarea = ''
            this.isEdit = false
        },
        // 上传文件，读取内容到文本框
        handleSuccess(response, file){
            const reader = new FileReader();
            reader.readAsText(file.raw, "UTF-8");
            reader.onload = e => {
                const fileString = e.target.result;
                this.textarea = fileString
            };
            this.isQuit = true
        },
        beforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
        },
        // 选中句子进行标记
        handleTag(index,row){
            this.$store.commit('setCurrentTextarea', row)
            this.$store.commit('setCurrentIndex', index + (this.pageNumNow-1)*this.maxShowLength +1)
            this.$router.push("./tagEntity")
        },
        
        // 删除句子
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该句子, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
            .then(async () => {
                await deleteSentence({content:row}),
                // this.sentences.splice(this.sentences.indexOf(row) ,1),
                this.sentences.splice(index + (this.pageNumNow-1) * this.maxShowLength ,1),
                this.showCurrentPage(this.pageNumNow);
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
        // 页面跳转
        handleChange(page){
            this.pageNumNow = page;
            this.showCurrentPage(page);
        }
    }
}
</script>

<style scoped>
.allsentences {
    width: 100%;
    margin: 0;
    display: block;
    justify-content: space-between;
}
.input_sentences {
    display: flex;
    width: 92%;
    margin: 5px;
}
.buttons {
    display: flex;
    width:20%;
    height: 40px;
}
.show_sentences {
    display: flex;
    width: 100%;
    justify-content: space-between;
    min-height: 500px;
}
.all_sentences {
    list-style-type: decimal;
    line-height: 2;
}
.content {
    word-spacing:nowrap;
}
.show_bottom {
    float: right;
}
</style>
