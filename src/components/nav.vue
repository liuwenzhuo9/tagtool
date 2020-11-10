<template>
    <div id="navbar">
        <div class="nav_title">
            <img src="../assets/NAV.png" alt="title">
        </div>
        <div class="nav_bar">
            <el-menu :default-active="count.toString()" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item v-for="(item,$index) in section" :key="(item,$index)" :index="$index.toString()">
                    <font-awesome-icon :icon="icon($index)" />
                    {{item}}
                    </el-menu-item>
            </el-menu>
        </div>
        <div class="nav_bar_logout" v-if='logCount'>
            {{loginName}},
            你好！ &nbsp;
            <font-awesome-icon icon="sign-out-alt" />
            <el-link :underline="false" class="logout"  @click="toLoginOut('form')">注销</el-link>
        </div>
    </div>
</template>


<script>
import { getCookie,delCookie,loginOut } from '../unit/fetch'
  export default {
      
    name:'navbar',
    data(){
        return {
            section: ['任务展示','所有句子','标注标签','导出结果','个人中心'],
            sectionUrl: ['showTasks','allSentences','tagEntity','tagResult','personal'],
            // userName:'',
        }       
    },
    computed:{
		count() {
            return this.$store.state.activeIndex
        },
        logCount() {
            return this.$store.state.loginstate
        },
        userCount() {
            return this.$store.state.loginuser
        },
        loginName() {
            return this.$store.state.loginname
        },
	},
	watch:{
		count() {
        },
        logCount() {
        },
        userCount() {
        },
        loginName() {
        },
	},
    mounted(){
        this.handleSelect(0);
        // this.loginName = getCookie('name');
        // this.getName();
    },
    methods: {
      handleSelect(key) {
          let url = '/'+ this.sectionUrl[key]
          this.$router.push(url)
      },
    //   async getName(){
    //       const accInfo = this.$store.state.loginuser;
    //     const nameInfo = await findAccountByAccount({account:accInfo});
    //     this.userName = nameInfo.data.name;
    //   },
      toLoginOut(){
        (async() => {
        try{
            const accountinfo = await loginOut();
            this.$message.error(accountinfo.message);
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
            this.$store.commit('setActiveIndex',5);
            this.$router.push('/personal');
          }catch(e){
            // console.log('error')
            this.$message.error((e && e.message) ? e.message : '登出失败，请稍后重试');
          }
          })();
      },
      icon(i) {
          switch(i){
              case 0 : return 'bullhorn'
              case 1 : return 'list'
              case 2 : return 'tags'
              case 3 : return 'download'
              case 4: return 'user-edit'
          }
      }
    },
    // components: {
    //     rePassword,
    //   }
  }

</script>

<style scoped>
#navbar {
    min-height: 80px;
}
.nav_title {
    width: 100%;
    /* margin: 0 auto; */
    height: 167px;
    display: flex;
    justify-content: space-between;
}
.nav_title img {
    display: inline-block;
    height: 100%;
    margin: auto;
}
.nav_bar_logout {
    position: relative;
    top: -41px;
    left: 86%;
    color: #4f71b1;
    font-size: 17px;
    width: 226px;
}
.nav_bar_logout a {
    color: #4f71b1;
    font-size: 16px;
}
/* .el-menu{
    background: rgb(224, 218, 209);
} */
</style>
