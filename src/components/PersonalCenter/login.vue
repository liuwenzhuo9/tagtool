<template>
  <div class="boxaaa">
      <!-- <div class="login-box"> -->
        <!-- <div class="login-title text-center">
          <h1>
            <small>TAGTOOL账号登陆</small>
          </h1>
        </div>
        <div class="login-content ">
          <el-form class="login_form" ref="form" :model="form" label-width="100px" :rules='rules'>
            <el-form-item label="账号" prop="accountName">
                <el-input v-model="form.accountName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password"  @keyup.enter.native="toLogin('form')"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="toLogin('form')">登陆</el-button>
                <el-button type="primary" @click="toLoginOut('form')">注销</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div> -->
  </div>
</template>



<script>
  // import { login,getCookie,setCookie,delCookie,loginOut } from '../../unit/fetch'
  // import { Encrypt } from '../../utils/encoder'

  // export default {
  //   data(){
  //     return{
  //       form:{
  //         accountName:'',
  //         password:'',
  //       },
  //       rules:{
  //         accountName:[{required:true,message:"请填写账号!",trigger:'blur'}],
  //         password:[{required:true,message:"请填写密码！",trigger:'blur'}],
  //       }
  //     }
  //   },
  //   // mounted(){
  //   //     this.init()
  //   // },
  //   methods:{
  //     // init(){
  //         // this.$store.commit('changePersonState',false)
  //           // console.log(this.$route.query.redirect);
  //           // console.log(this.$store.state.personState);
  //           // console.log(this.$store.state.isFour);
  //     // },
  //     toLogin(formName){
  //       this.$refs[formName].validate((valid) => {
  //         if(valid){
  //           var encoderStr = Encrypt(this.form.password)
  //           this.loginNow({
  //             account: this.form.accountName,
  //             password: encoderStr,
  //           });
  //         }
  //       });
  //     },
  //     loginNow(info){
  //       (async() => {
  //         try{
  //           const accountinfo = await login(info);
  //           if (accountinfo.data == 0||accountinfo.data == 1||accountinfo.data == 2){
  //             this.$message.error(accountinfo.message);
  //             if (getCookie('role')){
  //               let url = '/' + getCookie('role');
  //               this.$router.push(url);
  //             }
  //           }else{
  //             setCookie('account',this.form.accountName);
  //             setCookie('role',accountinfo.data);
  //             // if(this.$route.query.redirect == '/resource'){
  //             // this.$router.push('/resource');
  //             // // let url = '/' + getCookie('role');
  //             // // this.$router.push(url);
  //             // }else{
  //             // let url = '/resource';
  //             // this.$router.push('/resource');
  //             // if(this.$store.state.isFour){
  //             // this.$store.commit('changelogin');
  //             // this.$router.push('/resource');
  //             // this.$store.commit('changePersonState',true);
  //             // // console.log(this.$store.state.loginstate);
  //             // }else{
  //             let url = '/' + getCookie('role');
  //             this.$router.push(url);
  //             // }
  //             }
  //           // }
  //           // this.$store.commit('changelogin');
  //           // this.$store.commit('changeuser');
  //           // this.$store.commit('changerole');
  //         }catch(e){
  //           // console.log('error')
  //           this.$i18n.locale === 'zh' ? this.$message.error((e && e.message) ? e.message : '登陆失败，请稍后重试') : this.$message.error((e && e.message) ? e.message : 'Login error, Please try again later!');
  //         }
  //       })();
  //     },
  //     toLoginOut(){
  //       (async() => {
  //       try{
  //           const accountinfo = await loginOut();
  //           this.$message.error(accountinfo.message);
  //           if (getCookie('account')){
  //             delCookie('account');
  //           }
  //           if (getCookie('role')){
  //             delCookie('role');
  //           }
  //           // this.$store.commit('changelogin');
  //           // this.$store.commit('changeuser');
  //           // this.$store.commit('changerole');
  //         }catch(e){
  //           // console.log('error')
  //           this.$i18n.locale === 'zh' ? this.$message.error((e && e.message) ? e.message : '登出失败，请稍后重试') : this.$message.error((e && e.message) ? e.message : 'LoginOut error, Please try again later!');
  //         }
  //         })();
  //     },
  //   }
  // }
</script>
<style lang='scss'>
// @import '../../../static/css/base.scss';

// .index-wrap{
//   height: 100%;
// }

// .login-input{
//   width: 80%;
// }

// .el-form-item__content{
//   margin-right: 100px;
// }

// .login-box {
//     width: 100%;
//     max-width: 500px;
//     height: 400px;
//     position: absolute;
//     top: 50%;

//     margin-top: -200px;
//     text-align: center;
//     /*设置负值，为要定位子盒子的一半高度*/

// }

// .login-title {
//     border-top-left-radius: 8px;
//     border-top-right-radius: 8px;
//     padding: 20px 10px;
//     background-color: rgba(0, 0, 0, .6);
// }

// .login-title h1 {
//     margin-top: 10px !important;
//     /* height: 20px; */
//     font-size: 30px;
// }
// .login-title small {
//     color: #fff;
// }

// .login-content {
// 	/* background:url("../image/03.png") no-repeat center center; */
//     border-bottom-left-radius: 8px;
//     border-bottom-right-radius: 8px;
//     padding-top: 20px;
//     height: 205px;
//     width: 100%;
//     max-width: 500px;
//     background-color: rgba(255, 250, 2550, .6);
//     float: left;
//     text-align: center;
// }

//  @media screen and (min-width: 500px) {
//             .login-box {
//                 left: 50%;
//                 /*设置负值，为要定位子盒子的一半宽度*/
//                 margin-left: -250px;
//             }
//         }

// .login_form{
//     /* width: 300px; */
//     margin-left: auto;
//     margin-right: auto;
//     /* padding-right: 30px; */
// }

// html,body {
//   width: 100%;
//   height: 100%;
// }
// .boxaaa {
//             background: url(../../assets/login.jpg) no-repeat center center;
//             background-size: cover;
//             margin: 0 auto;
//             position: relative;
//             top: 50px;
//             width: 100%;
//             height: calc(100% - 50px);
//         }
</style>
