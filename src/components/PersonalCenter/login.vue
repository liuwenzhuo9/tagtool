<template>
  <div class="boxaaa">
      <div class="login-box" v-if="!this.isRegist">
         <div class="login-title text-center"> 
          <h1>
            <small>TAGTOOL账号登录</small>
          </h1>
        </div>
        <div class="login-content ">
          <el-form class="login_form" ref="form" :model="form" label-width="100px" :rules='rules'>
            <el-form-item label="用户名" prop="accountName" v-if="loginMethod == 'name'">
                <el-input v-model="form.accountName"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="accountName" v-if="loginMethod == 'account'">
                <el-input v-model="form.accountName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password"  @keyup.enter.native="toLogin('form')"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="toLogin('form')">登录</el-button>
                <!-- <el-button type="primary" @click="toLoginOut('form')">注销</el-button> -->
                <el-button type="primary" @click="toRegist()">注册</el-button>
            </el-form-item>
            <el-link :underline="false" class="reg"  v-if ="loginMethod == 'account'" @click="changeLoginMethod('name')">用户名登录</el-link>
            <el-link :underline="false" class="reg"  v-if ="loginMethod == 'name'" @click="changeLoginMethod('account')">账号登录</el-link>
          </el-form>
        </div>
      </div>
      <div class="regist-box" v-else>
         <div class="regist-title text-center"> 
          <h1>
            <small>TAGTOOL账号注册</small>
          </h1>
        </div>
        <div class="regist-content ">
          <el-form class="regist_form" ref="form" :model="form" label-width="100px" :rules='rules'>
            <el-form-item label="账号" prop="account">
                <el-input v-model="form.account" placeholder="请输入六位数字"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
                <el-input v-model="form.name" placeholder="请输入包含数字和字母的三位以上字符"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="toAddAccount('form')">注册</el-button>
                <el-button type="primary" @click="quitRegist()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
  </div>
</template>



<script>
  import { login,getCookie,setCookie,delCookie,loginOut, addAccount, insertUserInfo } from '../../unit/fetch'
  import { Encrypt } from '../../utils/encoder'

  export default {
    data(){
      return{
        isRegist:false,
        form:{
          accountName:'',
          password:'',
          account:'',
          name:''
        },
        rules:{
          accountName:[{required:true,message:"请填写账号！",trigger:'blur'}],
          account:[{required:true,message:"请填写账号！",trigger:'blur'}],
          name:[{required:true,message:"请填写用户名！",trigger:'blur'}],
          password:[{required:true,message:"请填写密码！",trigger:'blur'}],
        },
        loginMethod:'account'
      }
    },
    mounted(){
        this.init()
    },
    methods:{
      init(){
          this.$store.commit('changePersonState',false)
      },
      toLogin(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            var encoderStr = Encrypt(this.form.password);
            this.loginNow({
              account: this.form.accountName,
              password: encoderStr,
            });
          }
        });
      },
      loginNow(info){
        (async() => {
          try{
            const accountinfo = await login(info);
            if (accountinfo.data == 0||accountinfo.data == 1||accountinfo.data == 2){
              this.$message.error(accountinfo.message);
              if (getCookie('role')){
                let url = '/' + getCookie('role');
                this.$router.push(url);
              }
            }else{
              setCookie('account',this.form.accountName);
              setCookie('role',accountinfo.data);
              setCookie('name',accountinfo.message);
              let url = '/' + getCookie('role');
              this.$router.push(url);
              }
            this.$store.commit('changelogin');
            this.$store.commit('changeuser');
            this.$store.commit('changerole');
            this.$store.commit('changename');
          }catch(e){
             this.$message.error((e && e.message) ? e.message : '登陆失败，请稍后重试') ;
          }
        })();
      },
      toLoginOut(){
        (async() => {
        try{
            // const accountinfo = await loginOut();
            await loginOut();
            if (getCookie('account')){
              delCookie('account');
            }
            if (getCookie('role')){
              delCookie('role');
            }
            if (getCookie('name')){
              delCookie('name');
            }
            this.$store.commit('changelogin');
            this.$store.commit('changeuser');
            this.$store.commit('changerole');
            this.$store.commit('changename');
            this.$router.push('/personal');
          }catch(e){
            this.$message.error((e && e.message) ? e.message : '登出失败，请稍后重试');
          }
          })();
      },
      toRegist(){
          this.isRegist = true;
      },
      quitRegist(){
          this.isRegist = false;
      },
      toAddAccount(formName) {
          this.$refs[formName].validate(valid => {
              if(!valid) {
                  return;
              }
              (async() => {
                var accountReg = /^[0-9]{6}$/
                var nameReg = /^[a-zA-Z0-9]{3,}$/;
                
                if(nameReg.test(this.form.name) && accountReg.test(this.form.account)){
                  await addAccount({
                      account: this.form.account,
                      name: this.form.name,
                      role: "普通用户",
                  });
                  this.$message.success('添加成功！') ;
                }else if(!nameReg.test(this.form.name)){
                  this.$message.error('请按要求输入用户名！') ;
                }else if(!accountReg.test(this.form.account)){
                  this.$message.error('请按要求输入账号！') ;
                }
                await insertUserInfo({
                    account: this.form.account,
                    name: this.form.name,
                });
              })();
          });
      },
      changeLoginMethod(info) {
        this.loginMethod = info;
      }
    }
  }
</script>
<style lang='scss'>
// @import '../../../static/css/base.scss';

// .index-wrap{
//   height: 100%;
// }
.boxaaa {
  width: 100%;
  margin:10px;
}
.login-input, .regist-input{
  width: 80%;
}
.el-form-item {
    margin-bottom: 17px;
    margin-top:10px;
}
.el-form-item__content{
  margin-right: 100px;
}

.login-box ,.regist-box{
    width: 100%;
    max-width: 500px;
    height: 300px;
    position: absolute;
    top: 50%;
    text-align: center;
    /*设置负值，为要定位子盒子的一半高度*/

}
.el-button--primary {
    color: #FFF;
    background-color: #88a3d0;
    border-color: #88a3d0;
}

.login-title ,.regist-title{
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 20px 10px;
    background-color: rgba(57, 102, 177, 0.6)
}

.login-title h1 ,.regist-title h1{
    margin-top: 10px !important;
    /* height: 20px; */
    font-size: 30px;
}
.login-title small ,.regist-title small{
    color: #fff;
}

.login-content,.regist-content {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding-top: 20px;
    height: 220px;
    width: 100%;
    max-width: 500px;
    // background-color: rgb(214, 220, 232);
    
    background-color: #e2e4e8;
    float: left;
    text-align: center;
}
 @media screen and (min-width: 500px) {
            .login-box ,.regist-box{
                left: 50%;
                /*设置负值，为要定位子盒子的一半宽度*/
                margin-left: -250px;
            }
        }

.login_form, .regist_form{
    /* width: 300px; */
    margin-left: auto;
    margin-right: auto;
    /* padding-right: 30px; */
}

html,body {
  width: 100%;
  height: 100%;
}
.reg{
    text-decoration: underline;
}
.boxaaa {
            // background: url(../../assets/login.jpg) no-repeat center center;
            // background-size: cover;
            margin: 0 auto;
            position: relative;
            top: 50px;
            width: 100%;
            height: calc(100% - 50px);
        }
</style>
