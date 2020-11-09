<template>
    <div class = "inferResult">
        <el-button type="primary" v-if="!showCI" round @click="showListOrPie">查看标注一致性</el-button>
        <el-button type="primary" v-if="showCI" round @click="showListOrPie">查看标签分类汇总图</el-button>
        <el-button type="success" v-if="showCI" round @click="downLoadRes">导出标注结果</el-button>
        <div v-show="!showCI" ref="chart" style="width:1040px;height:376px"></div>
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
                <el-table-column
                label="内容"
                width="700">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.content }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="标签"
                width="100">
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
                <el-table-column
                label="标注一致性"
                width="100">
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
    // this.initInfo();
    },
    props: {
            editInfo: Object,
            selectShowPart: Function
        },
    data(){
        return{
            pieInfo:[
                // {value: 1, name: '富强'},
                // {value: 1, name: '民主'},
                // {value: 1, name: '文明'},
                // {value: 1, name: '和谐'},
                // {value: 1, name: '自由'},
                // {value: 1, name: '平等'},
                // {value: 1, name: '公正'},
                // {value: 1, name: '法制'},
                // {value: 1, name: '爱国'},
                // {value: 1, name: '敬业'},
                // {value: 1, name: '诚信'},
                // {value: 1, name: '友善'},
            ],
            labelsNum: [],
            tableData: [],//预测结果等信息以列表的形式展示
            showCI: true,
            options: [],//存放可选标签
            maxLabelsNum: '',
            flag: true,
            // currentPage: 1,
            // pageSize: 5,
            }
    },
    methods: {
        async init(){
            this.tableData = [];
            this.labelsNum = [];
            const info = await findInferInfoByTaskId({task_id: this.editInfo.id});
            this.options = this.editInfo.task_label.split(",");
            const num = this.options.length
            for(var i = 0; i<num; i++){
                this.labelsNum[i] = 0;
            }
            info.data.map((item, index) =>{
                // 如果final_result存在，则在列表中显示final_result；否则显示infer_result
                if(item.final_result != null && item.final_result != ''){
                    this.tableData.push({index: index+1, 
                                    content: item.content, 
                                    tag: item.final_result, 
                                    ci: item.ci,
                                    confirm: true});
                    this.labelsNum[this.options.indexOf(item.final_result)]++;
                    this.maxLabelsNum = Math.max(this.labelsNum[this.options.indexOf(item.final_result)], this.maxLabelsNum);
                }else{
                    this.tableData.push({index: index+1, 
                                    content: item.content, 
                                    tag: item.infer_result, 
                                    ci: item.ci,
                                    confirm: false});
                }
                console.log(this.tableData)
                
            })
            this.pieInfo = [];
            for(var j = 0; j<num; j++){
                this.pieInfo.push({name:this.options[j], max:this.maxLabelsNum});
            }
            console.log(this.pieInfo);
            this.getEchartData();
        },
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
                                data: ['当前部门']
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
                                indicator: this.pieInfo,//name max
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
        async handleSave(index, row) {
            // console.log(row);
            await updateFinalResultByPosition({task_id: this.editInfo.id, paragraph_position: index, final_result: row.tag});
            this.init();
        },
        showListOrPie(){
            this.showCI = !this.showCI;
            if(this.showCI){
                this.getEchartData();
            }
        },
        async downLoadRes(){
          const infer_res = await findInferInfoByTaskId({task_id:this.editInfo.id});
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
</style>