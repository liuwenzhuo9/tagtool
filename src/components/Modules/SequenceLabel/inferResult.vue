<template>
    <div class = "inferResult">
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                <!-- <el-form-item label="序号">
                    <span>{{ props.row.index }}</span>
                </el-form-item>
                <el-form-item label="内容">
                    <span>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item label="标记一致性">
                    <span>{{ props.row.ci }}</span>
                </el-form-item> -->
                <el-form-item label="序列标签结果" width="500">
                    <span>{{ props.row.label_res }}</span>
                </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="序号"
            prop="index"
            width="50">
            </el-table-column>
            <el-table-column
            label="内容"
            prop="content">
            </el-table-column>
            <el-table-column
            label="标记一致性"
            prop="ci"
            width="80">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {findInferInfoByTaskId} from '../../../unit/fetch';
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
            tableData: [],
            options: this.editInfo.task_label.split(','),//存放可选标签
        }
    },
    methods: {
        async init(){
            const info  = await findInferInfoByTaskId({task_id: this.editInfo.id});
            info.data.map((item, index) =>{
                // 如果final_result存在，则在列表中显示final_result；否则显示infer_result
                if(item.final_result != null && item.final_result != ''){
                    this.tableData.push({index: index+1, 
                                content: item.content, 
                                ci: parseFloat(item.ci).toFixed(2),
                                label_res: item.final_result});
                }else{
                    this.tableData.push({index: index+1, 
                                content: item.content, 
                                ci: parseFloat(item.ci).toFixed(2),
                                label_res: item.infer_result});
                }
            })
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        }
    }
}
</script>

<style scoped>
    .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>