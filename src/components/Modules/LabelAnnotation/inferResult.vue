<template>
    <div class = "inferResult">
        <el-button type="primary" v-if="!showCI" round @click="showListOrRadar">查看标注一致性</el-button>
        <el-button type="primary" v-if="showCI" round @click="showListOrRadar">查看标签分类汇总图</el-button>
        <el-button type="success" v-if="showCI" round @click="downLoadRes">导出标注结果</el-button>
        <div v-show="!showCI && taskType!=2" ref="chart" style="width:1040px;height:700px"></div>
        <el-row v-show="!showCI && taskType ==2">
            <el-col :span="12"><div ref="chart1" style="width:500px;height:500px"></div></el-col>
            <el-col :span="12"><div ref="chart2" style="width:500px;height:500px"></div></el-col>
        </el-row>
        <div v-if="showCI">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                label="序号"
                width="50">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.index }}</span>
                </template>
                </el-table-column>
                <!-- 单标签标注内容 -->
                <el-table-column
                v-if="taskType == 1"
                label="内容"
                width="700">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.content }}</span>
                </template>
                </el-table-column>
                <!-- 量级标签标注内容 -->
                <el-table-column
                v-if="taskType == 2 || taskType == 3"
                label="内容"
                width="600">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" slot="reference"  @click="dialogVisible = true">{{ scope.row.content }}</span>
                </template>
                </el-table-column>
                <!-- 单标签和量级标签的标签显示 -->
                <el-table-column
                v-if="taskType == 1 || taskType == 2"
                label="标签">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.tag" placeholder="请选择" size = "mini">
                        <el-option
                        v-for="item in options"
                        :key="item"
                        :label="item"
                        :value="item"
                        >
                        </el-option>
                    </el-select>
                </template>
                </el-table-column>
                <!-- 多层次标签显示 -->
                <el-table-column
                v-if="taskType == 3"
                label="标签">
                <template slot-scope="scope">
                    <el-cascader
                    :options="options"
                    v-model="scope.row.multiLabel"
                    :props="{ multiple: true, checkStrictly: true }"
                    clearable></el-cascader>
                </template>
                </el-table-column>
                <!-- 两级标签的量级显示 -->
                <el-table-column
                v-if="taskType == 2"
                label="量级"
                width="140">
                <template slot-scope="scope">
                    <el-input-number size="mini" v-model="scope.row.orderScore" :precision="2" :step="granularity" :max="10"></el-input-number>
                </template>
                </el-table-column>
                <el-table-column
                label="标注一致性"
                width="90">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.ci }}</span>
                </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" >
                        <el-button
                        v-if ="!scope.row.confirm"
                        size="mini"
                        type="success"
                        @click="handleSave(scope.$index, scope.row)">确认</el-button>
                        <el-button
                        v-if ="scope.row.confirm"
                        size="mini"
                        @click="handleSave(scope.$index, scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination
                layout="prev, pager, next"
                :total="tableData.length"
                :page-size = pageSize
                :current-page="currentPage">
            </el-pagination> -->
        </div>
    </div>
</template>

<script>
import {findInferInfoByTaskId, updateFinalResultByPosition} from '../../../unit/fetch';
export default {
    mounted(){
        this.init();
    },
    props: {
            editInfo: Object,
            selectShowPart: Function
        },
    data(){
        return{
            radarInfo:[],
            labelsNum: [],
            labelsScore: [],//记录标签总分
            labelsAverageScore: [],//记录标签平均分
            tableData: [],//预测结果等信息以列表的形式展示
            showCI: true,
            options: [],//存放可选标签
            maxLabelsNum: '',
            taskType: this.editInfo.task_type,
            inferType: 0,
            granularity: this.editInfo.granularity,
            multiLabel:'',
            firstLevelTag: [],//多层次标签的第一层标签
            secondLevelTag: [],//多层次标签的第二层标签
            multiLengendData: [],//多层次标签的一级标签和二级标签合集
            firstLevelNum: [],//多层次标签第一层标签出现的次数
            secondLevelNum: [],//多层次标签第二层标签出现的次数
            firstLevelData: [],//饼状图中第一层呈现数据
            secondLevelData: [],//饼状图中第二层呈现数据
            dialogVisible: false,
            // currentPage: 1,
            // pageSize: 5,
            }
    },
    methods: {
        async init(){
            this.tableData = [];
            this.labelsNum = [];
            this.firstLevelTag = [];
            this.secondLevelTag = [];
            this.firstLevelNum = [];
            this.secondLevelNum = [];
            this.multiLengendData = [];
            this.firstLevelData = [];
            this.secondLevelData = [];
            const info = await findInferInfoByTaskId({task_id: this.editInfo.id, type: this.inferType});
            if(this.taskType != 3){
                this.options = this.editInfo.task_label.split(",");
            }else{
                this.options = [];
                var regex = /\{[^\}]+\}/g;
                var multiTag = this.editInfo.task_label.match(regex);
                for(var i = 0; i<multiTag.length; i++){
                    var tempArr = multiTag[i].substring(1,multiTag[i].length-1).split(':');
                    this.firstLevelTag.push(tempArr[0]);
                    this.firstLevelNum.push(0);
                    this.multiLengendData.push(tempArr[0])
                    const secondArr = tempArr[1].split(',');
                    this.secondLevelTag.push(secondArr);
                    var childList = [];
                    var tempSecondNum = [];
                    for(var j = 0; j<secondArr.length; j++){
                        this.multiLengendData.push(secondArr[j]);
                        tempSecondNum.push(0);
                        let list = {value: secondArr[j], label: secondArr[j]};
                        childList.push(list);
                    }
                    this.secondLevelNum.push(tempSecondNum);
                    var fatherList = {value: tempArr[0], label: tempArr[0], children: childList};
                    this.options.push(fatherList);
                }
            }
            const num = this.options.length;
            for(var i = 0; i<num; i++){
                this.labelsNum[i] = 0;
                this.labelsScore[i] = 0;
                this.labelsAverageScore[i] = 0;
            }
            info.data.map((item, index) =>{
                // 如果final_result存在，则在列表中显示final_result；否则显示infer_result
                if(item.final_result != null && item.final_result != ''){
                    if(this.taskType == 1){
                        this.tableData.push({index: index+1, 
                                    content: item.content, 
                                    tag: item.final_result, 
                                    ci: item.ci,
                                    confirm: true});
                        this.labelsNum[this.options.indexOf(item.final_result)]++;
                        this.maxLabelsNum = Math.max(this.labelsNum[this.options.indexOf(item.final_result)], this.maxLabelsNum);
                    }
                    if(this.taskType == 2){
                        const tagArr = item.final_result.split(":");
                        this.tableData.push({index: index+1, 
                                    content: item.content, 
                                    tag: tagArr[0], 
                                    orderScore: parseFloat(tagArr[1]).toFixed(2),
                                    ci: parseFloat(item.ci).toFixed(2),
                                    confirm: true});
                        const tagIndex = this.options.indexOf(tagArr[0]);
                        this.labelsNum[tagIndex]++;
                        this.labelsScore[tagIndex] += parseFloat(tagArr[1]);
                        this.labelsScore[tagIndex].toFixed(2);
                        // this.maxLabelsNum = Math.max(this.labelsNum[this.options.indexOf(tagArr[0])], this.maxLabelsNum);
                    }
                    if(this.taskType == 3){
                        const tagArr = item.final_result;
                        var regex = /\{[^\}]+\}/g;
                        var multiTag = tagArr.match(regex);
                        this.multiLabel = [];
                        for(var i = 0; i<multiTag.length; i++){
                            var tempArr = multiTag[i].substring(1,multiTag[i].length-1).split(',');
                            this.multiLabel.push(tempArr);
                            const firstIndex = this.firstLevelTag.indexOf(tempArr[0]);
                            this.firstLevelNum[firstIndex]++;
                            const secondIndex = this.secondLevelTag[firstIndex].indexOf(tempArr[1]);
                            this.secondLevelNum[firstIndex][secondIndex]++;
                        }
                        this.tableData.push({index: index+1, 
                                    content: item.content, 
                                    multiLabel: this.multiLabel,
                                    ci: parseFloat(item.ci).toFixed(2),
                                    confirm: true});
                    }
                }else{
                    if(this.taskType == 1){
                        this.tableData.push({index: index+1, 
                                    content: item.content, 
                                    tag: item.infer_result, 
                                    ci: item.ci,
                                    confirm: false});
                    }
                    if(this.taskType == 2){
                        const tagArr = item.infer_result.split(":");
                        this.tableData.push({index: index+1, 
                                    content: item.content, 
                                    tag: tagArr[0], 
                                    orderScore: parseFloat(tagArr[1]).toFixed(2),
                                    ci: parseFloat(item.ci).toFixed(2),
                                    confirm: true});
                    }
                    if(this.taskType == 3){
                        const tagArr = item.infer_result;
                        var regex = /\{[^\}]+\}/g;
                        var multiTag = tagArr.match(regex);
                        this.multiLabel = [];
                        for(var i = 0; i<multiTag.length; i++){
                            var tempArr = multiTag[i].substring(1,multiTag[i].length-1).split(',');
                            this.multiLabel.push(tempArr);
                            const firstIndex = this.firstLevelTag.indexOf(tempArr[0]);
                            this.firstLevelNum[firstIndex]++;
                            const secondIndex = this.secondLevelTag[firstIndex].indexOf(tempArr[1]);
                            this.secondLevelNum[firstIndex][secondIndex]++;
                        }
                        this.tableData.push({index: index+1, 
                                    content: item.content, 
                                    multiLabel: this.multiLabel,
                                    ci: parseFloat(item.ci).toFixed(2),
                                    confirm: true});
                    }
                }
            })
            if(this.taskType == 1){
                this.radarInfo = [];
                for(var j = 0; j<num; j++){
                    this.radarInfo.push({name:this.options[j], max:this.maxLabelsNum});
                }
                this.getEchartData();
            }else if(this.taskType == 2){
                for(var i = 0 ; i<this.labelsScore.length; i++){
                    if(this.labelsNum[i] != 0){
                        this.labelsAverageScore[i] = this.labelsScore[i]/this.labelsNum[i];
                    }
                }
                this.getEchartDataOrder();
            }else if(this.taskType == 3){
                for(var i = 0; i<this.firstLevelNum.length; i++){
                    this.firstLevelData.push({value: this.firstLevelNum[i], name: this.firstLevelTag[i]});
                    for(var j = 0; j<this.secondLevelTag[i].length; j++){
                        this.secondLevelData.push({value: this.secondLevelNum[i][j], name: this.secondLevelTag[i][j]})
                    }
                }
                this.getEchartDataMulti();
            }
        },
        // 展现单标签结果的雷达图
        getEchartData() {
            const chart = this.$refs.chart
            if (chart) {
                const myChart = this.$echarts.init(chart)
                const option = {
                            // title: {
                            //   text: '基础雷达图'
                            // },
                            tooltip: {},
                            legend: {
                                right: 10,
                                // data: ['当前部门', '集团大盘']
                                // data: ['当前部门']
                            },
                            radar: {
                                // shape: 'circle',
                                name: {
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 20,
                                    backgroundColor: '#999',
                                    borderRadius: 3,
                                    padding: [3, 5]
                                }
                                },
                                axisLine: {
                                lineStyle: {
                                    color: 'rgba(131,141,158,.1)',
                                },
                                },
                                indicator: this.radarInfo,//name max
                                splitArea: {
                                show: true,
                                areaStyle: {
                                    color: '#d0e888f5', // 图表背景的颜色
                                },
                                },
                                splitLine: {
                                show: true,
                                lineStyle: {
                                    width: 1,
                                    color: 'rgba(131,141,158,.1)', // 设置网格的颜色
                                },
                                },
                            },
                            series: [{
                                name: '雷达图',
                                type: 'radar',
                                // areaStyle: {normal: {}},
                                data: [{
                                    value: this.labelsNum,
                                    name: '标签统计',
                                    itemStyle: {
                                    normal: {
                                        color: '#5B8FF9',
                                        lineStyle: {
                                        color: '#5AD8A6',
                                        },
                                    },
                                    },
                                },
                                ]
                            }]
                    
                }
                myChart.setOption(option);
                window.addEventListener("resize", function() {
                myChart.resize()
                })
            }
            this.$on('hook:destroyed',()=>{
                window.removeEventListener("resize", function() {
                myChart.resize();
                });
            })
        },
        // 展现多层次标签结果的饼图
        getEchartDataMulti() {
            const chart = this.$refs.chart
            if (chart) {
                const myChart = this.$echarts.init(chart)
                const option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b}: {c} ({d}%)'
                            },
                            legend: {
                                data: this.multiLengendData
                            },
                            series: [
                                {
                                    name: '标签数目',
                                    type: 'pie',
                                    selectedMode: 'single',
                                    radius: [0, '30%'],
                                    label: {
                                        position: 'inner',
                                        fontSize: 14,
                                    },
                                    labelLine: {
                                        show: false
                                    },
                                    data: this.firstLevelData
                                },
                                {
                                    name: '标签数目',
                                    type: 'pie',
                                    radius: ['45%', '60%'],
                                    labelLine: {
                                        length: 30,
                                    },
                                    label: {
                                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                        backgroundColor: '#F6F8FC',
                                        borderColor: '#8C8D8E',
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        
                                        rich: {
                                            a: {
                                                color: '#6E7079',
                                                lineHeight: 22,
                                                align: 'center'
                                            },
                                            hr: {
                                                borderColor: '#8C8D8E',
                                                width: '100%',
                                                borderWidth: 1,
                                                height: 0
                                            },
                                            b: {
                                                color: '#4C5058',
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                                lineHeight: 33
                                            },
                                            per: {
                                                color: '#fff',
                                                backgroundColor: '#4C5058',
                                                padding: [3, 4],
                                                borderRadius: 4
                                            }
                                        }
                                    },
                                    data: this.secondLevelData
                                }
                            ]
                    
                }
                myChart.setOption(option);
                window.addEventListener("resize", function() {
                myChart.resize()
                })
            }
            this.$on('hook:destroyed',()=>{
                window.removeEventListener("resize", function() {
                myChart.resize();
                });
            })
        },
        // 展现单个句子量级标签结果的柱状图
        getEchartDataOrder() {
            const chart1 = this.$refs.chart1
            if (chart1) {
                const myChart = this.$echarts.init(chart1)
                const option = {
                    legend: {},
                    tooltip: {},
                    title: {
                        text: '标签数量统计',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.options
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.labelsNum,
                        type: 'line'
                    }]
                    
                }
                    myChart.setOption(option);
                    window.addEventListener("resize", function() {
                    myChart.resize()
                    })
            }
            const chart2 = this.$refs.chart2
            if (chart2) {
                const myChart = this.$echarts.init(chart2)
                const option = {
                    legend: {},
                    tooltip: {},
                    title: {
                        text: '标签平均分统计',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.options
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.labelsAverageScore,
                        type: 'line'
                    }]
                    
                }
                myChart.setOption(option);
                window.addEventListener("resize", function() {
                myChart.resize()
                })
            }
            this.$on('hook:destroyed',()=>{
                window.removeEventListener("resize", function() {
                myChart.resize();
                });
            })
        },
        async handleSave(index, row) {
            var finStr = "";
            if(this.taskType == 1){ finStr = row.tag};
            if(this.taskType == 2){ finStr = row.tag + ":" + row.orderScore};
            if(this.taskType == 3){ for(var i = 0; i< row.multiLabel.length; i++){
                                        finStr += i==0 ? '{' + row.multiLabel[i][0] + ',' + row.multiLabel[i][1] + '}' : ',{' + row.multiLabel[i][0] + ',' + row.multiLabel[i][1] + '}';
                                    } 
                                  }
            await updateFinalResultByPosition({task_id: this.editInfo.id, paragraph_position: index, final_result: finStr});
            this.init();
        },
        showListOrRadar(){
            this.showCI = !this.showCI;
            if(this.showCI && this.taskType == 1){
                this.getEchartData();
            }
            if(this.showCI && this.taskType == 2){
                this.getEchartDataOrder();
            }
            if(this.showCI && this.taskType == 3){
                this.getEchartDataMulti();
            }
        },
        //导出标注结果功能
        async downLoadRes(){
            const infer_res = await findInferInfoByTaskId({task_id:this.editInfo.id, type: this.inferType});
            var finalLabel = [];
            for(var i = 0; i<infer_res.data.length; i++){
                finalLabel.push(infer_res.data[i].final_result);
            }
            var urlObject = window.URL || window.webkitURL || window;
            var export_blob = new Blob([finalLabel.toString()]);
            var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = this.editInfo.task_name + '.txt';
            var ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(ev);
        },
    }
}
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
</style>