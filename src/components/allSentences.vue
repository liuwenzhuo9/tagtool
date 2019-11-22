<template>
    <div class="allsentences">
        <div class="input_sentences">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入句子" v-model="textarea">
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
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.content)" v-if ="logCount">删除</el-button>
                    <el-button size="mini" type="success" v-if="scope.row.is_marked" @click="handleShow(scope.$index, scope.row.content)">查看</el-button>
                    <el-button size="mini" type="warning" v-if="!scope.row.is_marked" @click="handleTag(scope.$index, scope.row.content)">标记</el-button>
                    <el-button size="mini"  @click="handleEdit(scope.$index, scope.row.content,scope.row.is_marked)" v-if ="logCount">编辑</el-button>  
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="show_bottom">
            <div class="shoe_bottom_pageNum">
                <el-pagination
                    @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 30, 50]"
                    layout="sizes,  pager">
                </el-pagination>
                共{{this.pageNumTotal}}页 
                跳转至第&nbsp;<el-input-number v-model="num" @change="handleChange(num)" :min="1" :max="this.pageNumTotal" label="描述文字" size="mini"></el-input-number>
                &nbsp;页&nbsp;
                        <el-button type="success" size="mini" @click="handleChange(num)">跳转</el-button>&nbsp;
                <el-divider direction="vertical"></el-divider>
                当前是第{{this.pageNumNow}}页
            </div>
            <div class="show_bottom_delete">
                从第&nbsp;
                <el-input class="deleteInput" v-model="begin" size="mini"></el-input>
                &nbsp;句到第&nbsp;
                <el-input class="deleteInput" v-model="end" size="mini"></el-input>
                &nbsp;句
                <el-button type="danger" size="mini" @click="deleteFromBeginToEnd(begin,end)">批量删除</el-button>
            </div>
            <div class="show_bottom_unmarked">
                当前还有&nbsp;{{unmarkedNum}}&nbsp;个句子未被标记
                <el-button type="danger" size="mini" v-if="showPart" :disabled="this.unmarkedNum == 0" @click="showAllSentences(0)">只显示未标记句子</el-button>
                <el-button type="danger" size="mini" v-if="!showPart" @click="showAllSentences(1)">显示全部句子</el-button>
            </div>
        </div>
    </div>
</template>>

<script>
import {getAllSentences, insertSentence, deleteSentence, findIdBySentence, updateSentenceContentById, updateSentenceMarkById, deleteEntityBySentenceId, deleteSentenceFromOffset, findUnmarkedNum} from '../unit/fetch';
export default {
    data () {
        return {
            textarea: '',
            isInitial:true,
            isEdit:false,//判断是否点击了编辑按钮
            isMark:0,//保存handleEdit(scope.$index, scope.row.content,scope.row.is_marked)中的scope.row.is_marked状态
            editSentenceId:'',//保存正在编辑的句子id，便于在数据表中修改句子内容
            editSentenceIndex:'',//保存正在编辑的句子在该页的index值，便于修改显示内容
            sentences:[],//数据库中所有句子的内容
            sentencesCurrent:[],//当前页面显示的句子
            splitSentence:[],//根据txt文档中回车得到的句子
            num:0,//加减跳转按钮的数字
            maxShowLength:10,//每页显示的条数
            pageNumTotal:1,//总页数
            pageNumNow:1,//当前页数
            begin:'',
            end:'',
            unmarkedNum:0,
            showPart:true
        }
    },
    mounted(){
        this.init();
        this.$store.commit('setActiveIndex',0)
    },
    computed:{
        logCount() {
            return this.$store.state.loginstate
        }
	},
	watch:{
        logCount() {
        },
	},
    methods:{
        async init() {
            this.showAllSentences(1);
            this.getUnmarkedNum();
        },
        // 展示所有句子
        async showAllSentences(type){
            const lastSentences = this.sentences;
                try{
                    this.sentences = [];
                    const info = await getAllSentences({is_marked:type});
                    info.data.map((item) => {
                            this.sentences.push(item)
                        })
                }catch(e){
                    this.sentences = [...lastSentences];
                    this.$message.error((e && e.message) ? e.message : '获取句子错误，请稍后重试');
                }
            this.pageNumTotal = Math.ceil(this.sentences.length/this.maxShowLength);
            if(this.isInitial){
                this.showCurrentPage(this.pageNumNow);
            }
            if(type == 0){
                this.showPart = false;
            }else{
                this.showPart = true;
            }
        },
        //获取未标记句子数
        async getUnmarkedNum(){
            const info = await findUnmarkedNum();
            this.unmarkedNum = info.data;
        },
        // 控制每页显示的句子内容
        showCurrentPage(page){
            this.sentencesCurrent = [];
            for(var index=(page - 1) * this.maxShowLength; index < (page * this.maxShowLength) && index < this.sentences.length ;index++){
                    this.sentencesCurrent.push(this.sentences[index]);
                }
        },
        // 控制每页显示的句子数
        handleSizeChange(max){
            this.maxShowLength = max;
            this.pageNumTotal = Math.ceil(this.sentences.length/this.maxShowLength);
            this.num = 1;
            this.pageNumNow = 1
            this.showCurrentPage(1);
        },
        // 确认添加
        async handleClick(){
            if(this.textarea !== ''){
                this.textarea = this.textarea.toString()
                this.splitSentence = this.textarea.split('\n')
                await this.spiltByENTER();
                this.textarea=''
                this.isInitial = false;
                await this.showAllSentences(1);
                this.pageNumNow = this.pageNumTotal;
                this.num = this.pageNumNow
                await this.showCurrentPage(this.pageNumNow);
            }else{
                this.$message({
                message: '输入为空',
                type: 'warning'
                });
            }
        },
        //将输入框内容按照换行分割，并存放到句子表中
        async spiltByENTER(){
            await Promise.all(this.splitSentence.map(async (item) => {
                if(item != null && item != '' && item != undefined ){//输入不能为空
                    await insertSentence({content:item}
                    )}
                }))
        },
        // 编辑句子
        async handleEdit(index, row, msg) {
            this.isEdit = true
            this.textarea = row
            const info = await findIdBySentence({content:row})
            this.editSentenceId = info.data
            this.editSentenceIndex = index
            this.$store.commit('setCurrentIndex', index + (this.pageNumNow-1)*this.maxShowLength +1)
            if(msg == 1){
                this.isMark = 1
            }//已标记的句子进行编辑
        },
        // 确认编辑
        handleClickEdit(){
            updateSentenceContentById({id:this.editSentenceId,content:this.textarea})
            this.isEdit = false
            const editId = this.sentencesCurrent[this.editSentenceIndex]
            this.sentencesCurrent.splice(this.editSentenceIndex,1,{id:editId,content:this.textarea,is_marked:0})
            this.$store.commit('setCurrentTextarea', this.textarea)
            if(this.isMark == 1){//判断该句子是否被标记过
                updateSentenceMarkById({id:this.editSentenceId, is_marked:0})
                this.$confirm('该句子已被标记，保存编辑后是否重新标记？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(async () => {
                    this.isMark = 0;
                    this.$router.push("./tagEntity")
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已保存编辑，已取消标记'
                    });          
                });
            }
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
        //查看已标记的句子结果
        handleShow(index,row){
            this.$store.commit('setCurrentTextarea', row)
            this.$store.commit('setCurrentIndex', index + (this.pageNumNow-1)*this.maxShowLength +1)
            this.$store.commit('setIsMarked',true)
            this.$router.push("./tagEntity")
        },
        // 选中句子进行标记
        handleTag(index,row){
            this.$store.commit('setCurrentTextarea', row)
            this.$store.commit('setCurrentIndex', index + (this.pageNumNow-1)*this.maxShowLength +1)
            this.$store.commit('setIsMarked',false)
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
                this.sentences.splice(index + (this.pageNumNow-1) * this.maxShowLength ,1);
                const info = await deleteSentence({content:row});
                await deleteEntityBySentenceId({id_sentence:info.data});
                this.pageNumTotal = Math.ceil(this.sentences.length/this.maxShowLength);
                if(this.pageNumNow > this.pageNumTotal){
                    this.showCurrentPage(this.pageNumTotal);
                    this.pageNumNow = this.pageNumTotal
                }else{
                    this.showCurrentPage(this.pageNumNow);
                }
                this.num = this.pageNumNow;
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
        },
        //批量删除句子
        async deleteFromBeginToEnd(begin,end){
            if(begin == ''|| end == ''|| begin < 0 || end < 0){
                this.$message({
                    type: 'info',
                    message: '请检查输入！'
                });  
            }else{
                this.$confirm('此操作将永久删除这些句子, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
            .then(async () => {
                await deleteSentenceFromOffset({offset:begin-1,count:end-begin+1});
                this.sentences.splice(begin-1,end-begin+1);
                this.pageNumTotal = Math.ceil(this.sentences.length/this.maxShowLength);
                this.num = this.pageNumTotal;
                this.showCurrentPage(this.pageNumTotal);
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
            }
        }
    }
}
</script>

<style lang='scss' scoped>
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
    width: 100%;
}
.show_bottom_delete{
    margin: 10px 0px 10px 833px;
    width: 380px;
    .el-input {
        width:60px;
    }  
}
.el-pagination{
    display: inline-block;
    padding-right: 0px;
}
.shoe_bottom_pageNum{
    margin: 10px 0 0 558px;
}
.show_bottom_unmarked{
     margin: 10px 0 0 858px;
}
.el-button--primary {
    color: #FFF;
    background-color: #409EFF;
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
.el-button--primary:focus{
    background: #409EFF;
    border-color: #409EFF;
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