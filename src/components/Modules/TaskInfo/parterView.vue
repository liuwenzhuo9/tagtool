<template>
    <div>
        <div v-if="taskType == 0">

        </div>
        <!-- 展示单标签标注结果 -->
        <div v-if="taskType == 1">
            <el-table
                :data="showInfo"
                height="800"
                border
                style="width: 100%">
                <el-table-column
                prop="content"
                label="句子内容"
                width="700">
                </el-table-column>
                <el-table-column
                prop="userRes"
                label="你的标签">
                </el-table-column>
                <el-table-column
                prop="keyRes"
                label="参考标签">
                </el-table-column>
                <el-table-column
                prop="isTest"
                label="句子类型">
                </el-table-column>
            </el-table>
        </div>
        <!-- 展示量级标签编标注结果 -->
        <div v-if="taskType == 2">
            <el-table
                :data="showInfo"
                height="800"
                border
                style="width: 100%">
                <el-table-column
                prop="content"
                label="句子内容"
                width="700">
                </el-table-column>
                <el-table-column
                label="你的标签">
                    <el-table-column
                        :prop="userResTag"
                        label="标签"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        :prop="userResScore"
                        label="量级"
                        width="120">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                label="参考标签">
                    <el-table-column
                        :prop="keyResTag"
                        label="标签"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        :prop="keyResScore"
                        label="量级"
                        width="120">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                prop="isTest"
                label="句子类型">
                </el-table-column>
            </el-table>
        </div>
        <!-- 展示多层次标签标注结果 -->
        <div v-if="taskType == 3">
            <el-table
                :data="showInfo"
                height="800"
                border
                style="width: 100%">
                <el-table-column
                prop="content"
                label="句子内容"
                width="700">
                </el-table-column>
                <el-table-column
                label="你的标签">
                    <el-table-column
                        :prop="userResFirstTag"
                        label="一级标签"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        :prop="userResSecondTag"
                        label="二级标签"
                        width="120">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                label="参考标签">
                    <el-table-column
                        :prop="keyResFirstTag"
                        label="一级标签"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        :prop="keyResSecondTag"
                        label="二级标签"
                        width="120">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                prop="isTest"
                label="句子类型">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { findLabelResultByIsTest, findContentByTaskId, findInferInfoByTaskId } from '../../../unit/fetch';
    export default {
        props: {
            editInfo: Object,
            selectShowPart: Function
        },
        data() {
            return {
                taskType: this.editInfo.task_type,
                userAccount:this.$store.state.loginuser,
                hasTest: false,
                labelRes: [],//存放用户正式任务标注结果
                testLabelRes: [],//存放用户监督数据的标注结果
                keyRes: [],//正式任务的预测结果
                testKeyRes: [],//监督数据的标注结果
                contentArr: [],//正式任务句子内容
                testContentArr: [],//监督数据句子内容
                showInfo: [],//存放最终显示给用户看的句子内容和标记结果
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            async init(){
                // 判断是否有监督数据
                if(this.editInfo.sds_name != null && this.editInfo.sds_name != ''){
                    this.hasTest = true;
                }
                //初始化监督数据的标注结果、正确结果、句子内容
                if(this.hasTest){
                    const testLabelInfo = await findLabelResultByIsTest({task_id: this.editInfo.id, user_account: this.userAccount, is_test: 1});
                    this.testLabelRes = testLabelInfo.data;
                    const testKeyInfo = await findContentByTaskId({task_id: this.editInfo.id, is_test: 1});
                    testKeyInfo.data.map((item, index)=>{
                        this.testKeyRes.push(item.test_label);
                        this.testContentArr.push(item.content);
                    })
                }
                //初始化正式任务的标注结果、正确结果、句子内容
                const labelInfo = await findLabelResultByIsTest({task_id: this.editInfo.id, user_account: this.userAccount, is_test: 0});
                this.labelRes = labelInfo.data;
                const keyInfo = await findInferInfoByTaskId({task_id: this.editInfo.id, type: 0});
                keyInfo.data.map((item, index) =>{
                    // ！！！！！！！！！！！！！！！！！this.keyRes.push(item.final_result);！！！！！！正确的 现在用infer_result测试
                    // this.keyRes.push(item.infer_result);
                    this.keyRes.push(item.final_result);
                    this.contentArr.push(item.content);
                })
                this.findDiffLabelRes(this.taskType);
            },
            //将用户标注错误的内容存放在showInfo中
            findDiffLabelRes(type){
                this.showInfo = [];
                // 查找监督数据中用户错误标注的内容
                if(this.hasTest){
                    const testNum = this.testLabelRes.length;
                    for(var i = 0; i<testNum; i++){
                        //如果正确结果为空，则自动跳过
                        if(this.testKeyRes[i] == null || this.testKeyRes[i] == ''){
                            continue;
                        }
                        // 如果标注结果不一致或为空，则将该句子的内容、标注结果、真实结果存入showInfo中
                        if(this.testLabelRes[i] == null || this.testLabelRes[i] == '' || !this.compareLabelRes(this.testLabelRes[i], this.testKeyRes[i], type, true)){
                            if(this.taskType == 2){
                                this.showInfo.push({content: this.testContentArr[i], 
                                                    userResTag: this.testLabelRes[i].split(':')[0], 
                                                    userResScore: this.testLabelRes[i].split(':')[1], 
                                                    keyResTag: this.testKeyRes[i].split(':')[0], 
                                                    keyResScore: this.testKeyRes[i].split(':')[1], 
                                                    isTest: "监督数据"});
                            }else if(this.taskType == 3){
                                this.multiTagToTable(this.testLabelRes[i], this.testKeyRes[i], this.testContentArr[i], "监督数据");
                            }else if(this.taskType == 0){
                            
                            }else{
                                this.showInfo.push({content: this.testContentArr[i], userRes: this.testLabelRes[i], keyRes: this.testKeyRes[i], isTest: "监督数据"});
                            }
                        }
                    }
                }
                // 查找正式任务中用户错误标注的内容
                const num = this.labelRes.length;
                for(var i = 0; i<num; i++){
                    //如果正确结果为空，则自动跳过
                    if(this.keyRes[i] == null || this.keyRes[i] == ''){
                        continue;
                    }
                    // 如果标注结果不一致或为空，则将该句子的内容、标注结果、真实结果存入showInfo中
                    if(this.labelRes[i] == null || this.labelRes[i] == '' || !this.compareLabelRes(this.labelRes[i], this.keyRes[i], type, false, this.contentArr[i].length)){
                        if(this.taskType == 2){
                            this.showInfo.push({content: this.contentArr[i], 
                                                userResTag: this.labelRes[i].split(':')[0], 
                                                userResScore: this.labelRes[i].split(':')[1], 
                                                keyResTag: this.keyRes[i].split(':')[0], 
                                                keyResScore: this.keyRes[i].split(':')[1], 
                                                isTest: "正式任务"});
                        }else if(this.taskType == 3){
                            this.multiTagToTable(this.labelRes[i], this.keyRes[i], this.contentArr[i], "正式任务");
                        }else if(this.taskType == 0){

                        }else{
                            this.showInfo.push({content: this.contentArr[i], userRes: this.labelRes[i], keyRes: this.keyRes[i], isTest: "正式任务"});
                        }
                    }
                }
            },
            //判断两个结果字符串是否相同，返回true或false，isTest记录句子是否为监督数据，len记录句子的长度
            compareLabelRes(str1, str2, type, isTest, len){
                if(type == 0){
                    // 序列标注监督数据的keyLabelRes和用户标注的label都以字符串形式存在{0,2,“国际”,1},{2,4,“控股”,2},{4,6,“话题”,1}，将其转化为数组
                    if(isTest){
                        const arr1 = this.labelStrToArr0(str1);
                        const arr2 = this.labelStrToArr0(str2);
                        const arrToStr1 = this.getIndexTag(arr1, len);
                        const arrToStr2 = this.getIndexTag(arr2, len);
                        return arrToStr1.toString() == arrToStr2.toString();
                    }else{// 正式任务的final_result是以数组形式存在，但是用户标注的label以字符串形式存在，所以先将用户标注的label转成数组
                        const arr  = this.labelStrToArr0(str1);
                        const str = this.getIndexTag(arr, len).toString();
                        return str.toString() == str2;
                    }
                }else if(type == 1 || type == 2){
                    return str1 == str2;
                }else if(type == 3){
                    const arr1 = this.labelStrToArr3(str1);
                    const arr2 = this.labelStrToArr3(str2);
                    return arr1.toString() == arr2.toString();
                }
            },
            //将序列标签字符串转为按照索引排序的数组
            labelStrToArr0(str){
                var regex = /\{[^\}]+\}/g;
                var labelResArr = [];
                const labelResShow = str.match(regex);
                for(var i = 0; i<labelResShow.length; i++){
                    var tagArr = labelResShow[i].substring(1, labelResShow[i].length-1).split(',');
                    labelResArr.push(tagArr[0] + '-' + tagArr[1] + '-' + tagArr[2].substring(1,tagArr[2].length-1) + '-' + tagArr[3]);
                }
                var temp = [].concat(labelResArr);
                this.sortLabelRes(temp);
                return temp;
                // this.contentToHtml( temp, this.contentInfo);
            },
            //将多层次标签结果字符串转为排序数组
            labelStrToArr3(str){
                var regex = /\{[^\}]+\}/g;
                var labelResArr = [];
                const labelResShow = str.match(regex);
                labelResShow.sort();
                return labelResShow;
            },
            // 将已存在的序列标签结果按照起始index降序排列，便于按照index值添加html标签
            sortLabelRes(info){
                info.sort(function(a, b){
                    return b.split('-')[0]-a.split('-')[0];
                })
            },
            //将["18-22-不知所云-动词", "13-17-临表涕零-名词", "10-12-远离-动词", "3-7-受恩感激-动词"]这种形式的标签记录成[null,tag1,tag2,null]的形式
            getIndexTag(arr, len){
                var res = [];
                for(var i = 0; i<len; i++){
                    res[i] = null;
                }
                for(var i = 0; i<arr.length; i++){
                    var perArr = arr[i].split('-');
                    for(var j = perArr[0]; j<perArr[1]; j++){
                        res[j] = perArr[3];
                    }
                }
                return res;
            },
            // 多层次标签结果存储到表格中
            multiTagToTable(res, key, contentInfo, isTestInfo){
                const tempLabelArr = this.labelStrToArr3(res);
                const tempKeyArr = this.labelStrToArr3(key);
                var labelFisrtTag = [];
                var labelSecondTag = [];
                var firstTag = [];
                var secondTag = [];
                for(var i = 0; i<tempLabelArr.length; i++){
                    const temp = tempLabelArr[i].slice(1, tempLabelArr[i].length-1).split(',');
                    labelFisrtTag.push(temp[0]);
                    labelSecondTag.push(temp[1]);
                }
                for(var i = 0; i<tempKeyArr.length; i++){
                    const temp = tempKeyArr[i].slice(1, tempKeyArr[i].length-1).split(',');
                    firstTag.push(temp[0]);
                    secondTag.push(temp[1]);
                }
                this.showInfo.push({content: contentInfo, 
                                    userResFirstTag: labelFisrtTag.toString(), 
                                    userResSecondTag: labelSecondTag.toString(), 
                                    keyResFirstTag: firstTag.toString(), 
                                    keyResSecondTag: secondTag.toString(), 
                                    isTest: isTestInfo})
            }
        }
    };
</script>

<style lang='scss'>
    
</style>