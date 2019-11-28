<template>
    <div class="add-account-container">
            <el-form ref="form" :model="form" label-width="100px" :rules='rules'>
                <el-form-item label="账号" prop="account">
                    <el-input placeholder="请输入账号" v-model="form.account"></el-input>
                </el-form-item>
                
                <el-form-item label="姓名" prop="name">
                    <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="角色" prop="role">
                    <el-radio v-model="form.role" label="教师">教师</el-radio>
                    <el-radio v-model="form.role" label="学生">学生</el-radio>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="toAddAccount('form')">确定</el-button>
                    <el-button @click="this.changeAddAccount">取消</el-button>
                </el-form-item>
            </el-form>
    </div>
</template>

<script>
    import { addAccount } from '../../../unit/fetch';
    export default {
        props: {
            initAccount: Function,
            changeAddAccount: Function,
        },
        data() {
            return {
                form: {
                    account: '',
                    name: '',
                    role: '',
                },
                rules: {
                    account: [{required: true, message: '请输入账号!', trigger: 'blur'}],
                    name: [{required: true, message: '请输入姓名!', trigger: 'blur'}],
                    role: [{required: true, message: '请选择账号类型!'}],
                },
            }
        },
        methods: {
            toAddAccount(formName) {
                this.$refs[formName].validate(valid => {
                    if(!valid) {
                        return;
                    }

                    (async() => {
                        await addAccount({
                            account: this.form.account,
                            name: this.form.name,
                            role: this.form.role,
                        });
                        this.initAccount();
                        this.changeAddAccount();
                        this.$message.success('添加成功！');
                    })();

                });
            }
        }
    };
</script>

<style lang='scss'>
    .add-account-container {
        width: 85%;
        margin: 50px auto;
    }
</style>