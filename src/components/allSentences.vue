<template>
    <div class="allsentences">
        <div class="input_sentences">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入句子" v-model="textarea" >
            </el-input>
            &nbsp;&nbsp;
            <div class="buttons">
                <el-button class="addbutton" type="success" @click="handleClick()">确认添加</el-button>
                &nbsp;&nbsp;
                <el-upload  class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-success="handleSuccess" :before-remove="beforeRemove" list-type="text">
                <el-button size="middle" type="primary">上传txt文件</el-button>
                </el-upload>
            </div>
        </div>
        <div class="show_sentences">
            <el-table :data="sentences" style="width: 100%">
                <el-table-column label="句子" width="1000">
                    <template slot-scope="scope">
                        <p >{{ scope.row }}</p>
                    </template>
                </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini"  @click="handleEdit(scope.$index, scope.row)">标记</el-button>
                    <el-button size="mini"  @click="handleDelete(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
            <!-- <ol class="all_sentences">
                <li v-for="(item,index) in sentences.slice(0,5)" :key='index'>
                {{item}}
                <button class="button3">标注</button>
                &nbsp;&nbsp;
                <button class="button3">删除</button>
                </li>
            </ol> -->
        </div>
        <hr/>
        <div class="show_bottom">
        共80页 跳转至第&nbsp;<el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字" size="small"></el-input-number>
        &nbsp;页&nbsp;
        <el-button size="small">跳转</el-button>&nbsp;
        当前是第1页
        <br>
            <div class=buttons1>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-arrow-left" size="small">上一页</el-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button type="primary" size="small">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
            </div>
        </div>
    </div>
</template>>

<script>
export default {
    data () {
        return {
            textarea: '',
            sentences:[
                '1.自然语言处理是计算机科学领域与人工智能领域中的一个重要方向。',
                '2.它研究能实现人与计算机之间用自然语言进行有效通信的各种理论和方法。',
                '3.自然语言处理（NLP）是计算机科学，人工智能，语言学关注计算机和人类（自然）语言之间的相互作用的领域。',
                '4.用自然语言与计算机进行通信，这是人们长期以来所追求的。',
                '5.实现人机间自然语言通信意味着要使计算机既能理解自然语言文本的意义，也能以自然语言文本来表达给定的意图、思想等。'
            ]
        }
    },
    methods:{
        handleClick(){
            this.sentences.push(this.textarea)
            this.textarea=''
        },
        handleSuccess(response, file, fileList){
            window.console.log(file,fileList)
            // const file = e.file.originFileObj;
            const reader = new FileReader();
            reader.readAsText(file.raw, "UTF-8");
            reader.onload = e => {
                const fileString = e.target.result;
                this.textarea = fileString
                window.console.log(fileString)
            };
        },
        beforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
        }
        // handleEdit(index, row) {
        // // console.log(index, row);
        // },
    //    handleDelete(index, row) {
    //     // console.log(index, row);
    //    }
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
}
.addbutton {
    height: 40px;
}

.inputText1 {
    width: 25px
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
/* .button3 {
    float: right;
    height: 33px;
    width:55px;
} */
.show_bottom {
    float: right;
}
.buttons1 {
    float: right;
    margin: 5px;
}
</style>
