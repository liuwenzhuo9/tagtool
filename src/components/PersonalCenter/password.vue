<template>
  <div class="boxaaa">
    <!-- <div class="outer_label"> -->
      <!-- <img class="inner_label" src="../../assets/2.jpg"> -->
    <!-- </div> -->
      <div class="login-box">
        <div class="login-title text-center">
          <h1>
            <small>修改密码</small>
          </h1>
        </div>
        <div class="login-content ">
          <el-form class="login_form" ref="form" :model="form" label-width="100px" :rules='rules'>
            <el-form-item label="账号" prop="accountName">
                <el-input v-model="form.accountName"></el-input>
            </el-form-item>
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input type="password" v-model="form.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="form.newPassword"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="toChangePassword('form')">登陆</el-button>
                <!-- <el-button type="primary" @click="toLoginOut('form')">注销</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </div>
  </div>
</template>
 
 
 
<script>
//  import { userLogin } from '../../api/api';
  import { getCookie,setCookie,delCookie, isLogin,rePassword,loginOut } from '../../unit/fetch';
  // import vuexStore from '../store';
  import { Encrypt,Decrypt } from '../../utils/encoder'

  export default {
    data(){
      return{
        form:{
          accountName:'',
          oldPassword:'',
          newPassword:'',
        },
        rules:{
          accountName:[{required:true,message:"请填写账号!",trigger:'blur'}],
          oldPassword:[{required:true,message:"请填写旧密码！",trigger:'blur'}],
          newPassword:[{required:true,message:"请填写旧密码！",trigger:'blur'}],
        }
      }
    },
    methods:{
        toChangePassword(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    let oldEncoderStr = Encrypt(this.form.oldPassword);
                    let newEncoderStr = Encrypt(this.form.newPassword);
                    this.changePassword({
                        account: this.form.accountName,
                        oldPassword: oldEncoderStr,
                        newPassword: newEncoderStr,
                    });
                }
            });
        },
        changePassword(info){
            (async() => {
                try{
                    const result = await rePassword(info);
                    if (result.data == 0){
                        this.$message.error(result.message);
                    }else{
                        const accountinfo = await loginOut();
                        // this.$message.error(accountinfo.message);
                        if (getCookie('account')){
                        delCookie('account');
                        }
                        if (getCookie('role')){
                        delCookie('role');
                        }
                        this.$store.commit('changelogin');
                        this.$store.commit('changeuser');
                        this.$store.commit('changerole');
                        this.$store.commit('changename');
                        this.$router.push('/personal'); 
                    }
                }catch(e){
                    // console.log('error')
                    this.$i18n.locale === 'zh' ? this.$message.error((e && e.message) ? e.message : '登陆失败，请稍后重试') : this.$message.error((e && e.message) ? e.message : 'Login error, Please try again later!');
                }
            })();
        },
      
      
    }
  }
</script>
<style lang='scss'>
@import '../../../static/css/base.scss';

.index-wrap{
  height: 100%;
}

.login-input{
  width: 80%;
}

.el-form-item__content{
  margin-right: 100px;
}

.login-box {
            width: 100%;
            max-width: 500px;
            height: 400px;
            position: absolute;
            top: 50%;

            margin-top: -200px;
            text-align: center;
            /*设置负值，为要定位子盒子的一半高度*/

}

.login-title {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            padding: 20px 10px;
            background-color: rgba(0, 0, 0, .6);
        }

.login-title h1 {
            margin-top: 10px !important;
            /* height: 20px; */
            font-size: 30px;
        }
.login-title small {
            color: #fff;
        }

.login-content {
        	/* background:url("../image/03.png") no-repeat center center; */
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            padding-top: 20px;
            height: 250px;
            width: 100%;
            max-width: 500px;
            background-color: rgba(255, 250, 2550, .6);
            float: left;
            text-align: center;
}

 @media screen and (min-width: 500px) {
            .login-box {
                left: 50%;
                /*设置负值，为要定位子盒子的一半宽度*/
                margin-left: -250px;
            }
        }

.login_form{
    /* width: 300px; */
    margin-left: auto;
    margin-right: auto;
    /* padding-right: 30px; */
}

html,body {
  width: 100%;
  height: 100%;
}
/* body {
  background: url(../../assets/login.jpg) no-repeat center center;
  background-size: 100% 100%;

  margin: 0 auto;
  position: relative;
  width: 100%;
  height: 100%;
} */
.boxaaa {
            background: url(../../assets/login.jpg) no-repeat center center;
            background-size: cover;

            margin: 0 auto;
            position: relative;
            width: 100%;
            height: 100%;
        }
</style>