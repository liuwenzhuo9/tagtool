<template>
    <div id="navbar">
        <div class="nav_title">
            <img src="../assets/NAV.png" alt="title">
        </div>
        <div class="nav_bar">
                <el-row class="tac">
                    <el-col :span="12">
                        <el-menu default-active="2" class="el-menu-vertical-demo">
                            <el-menu-item index="1">
                                <i class="el-icon-list"></i>
                                <span slot="title">导航二</span>
                            </el-menu-item>
      
                            <el-menu-item index="2">
                                <i class="el-icon-menu"></i>
                                <span slot="title">导航二</span>
                            </el-menu-item>
     
                            <el-menu-item index="3">
                                <i class="el-icon-setting"></i>
                               <span slot="title">导航四</span>
                            </el-menu-item>
                        </el-menu>
                    </el-col>
                </el-row> 
        </div>
    </div>
</template>


<script>
  export default {
      
    name:'navbar',
    data(){
        return {
            section: ['所有句子','标注标签','导出结果']
        }       
    },
    methods: {
      showFunc:function(index){
          let url = '/'+ this.secition[index]
          this.$router.push(url)
      }
    }
  }

</script>

<style scoped>
.nav_title {
    width: 74%;
    margin: 0 auto;
    height: 115px;
    display: flex;
    justify-content: space-between;
}
.nav_title img {
    display: inline-block;
    height: 100%;
}
/* .nav_bar {
    width: 100%;
    height: 50px;
    margin: 15px auto 30px auto;
    background: #4f71b1;
    min-width: 1700px;
} */
</style>
