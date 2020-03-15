<template>
    <div class="account-table-container">
            <el-table
                :data="accountList"
                stripe
                style="width: 100%">
                <el-table-column
                    prop="account"
                    label="账号">
                </el-table-column>

                <el-table-column
                    prop="name"
                    label="姓名">

                </el-table-column>

                <el-table-column
                    prop="role"
                    label="角色">
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                        <el-button 
                            @click.native.prevent="deleteRow(scope.row,accountList)"  
                            type="text" 
                            size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <template v-if="!isAdd">
                <el-button style="margin-top:20px;" type="primary" size="small" icon="el-icon-plus" @click="changeAddAccount">添加账号</el-button>
            </template>
            
            <template v-else>
                <el-button style="margin-top:20px;" type="primary" size="small" icon="el-icon-minus" @click="changeAddAccount">取消</el-button>

                <Add :initAccount="init" :changeAddAccount="changeAddAccount" />
            </template>
    </div>
</template>

<script>
    import { getAllAccount, deleteAccount } from '../../../unit/fetch';
    import Add from './add.vue';

    export default {
        data() {
            return {
                accountList: [],

                isAdd: false,
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            async init() {
                try {
                    const info = await getAllAccount();
                    this.accountList = info.data;
                } catch(e) {
                    this.$message.error((e && e.message) ? e.message : '获取信息失败，请稍后重试') ;
                }
            },
            async deleteRow(row,accountList) {
                console.log(row);
                try {
                    await deleteAccount({
                        account: row.account,
                        role: row.role,
                    });
                    this.init();
                    this.$message.success('删除成功！');
                } catch(e) {
                    this.$message.error((e && e.message) ? e.message : '删除失败，请稍后重试')
                }
            },
            changeAddAccount() {
                this.isAdd = !this.isAdd;
            }
        },
        components: {
            Add,
        }
    };
</script>

<style lang='scss'>
    .account-table-container {
        width: 85%;
        margin: 50px auto;
    }
</style>