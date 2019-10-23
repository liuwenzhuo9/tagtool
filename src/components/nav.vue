<template>
    <div id="navbar">
        <div class="nav_title">
            <img src="../assets/NAV.png" alt="title">
        </div>
        <div class="nav_bar">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" >
                <el-menu-item v-for="(item,$index) in section" :key="(item,$index)" @click="showFunc($index)">{{item}}</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>


<script>
  export default {
      
    name:'navbar',
    data(){
        return {
            section: ['所有句子','标注标签','导出结果'],
            sectionUrl: ['allSentences','tagEntity','tagResult'],
            activeIndex:'1'
        }       
    },
    methods: {
      showFunc(index){
          let url = '/'+ this.sectionUrl[index]
          this.$router.push(url)
      }
    }
  }

</script>

<style scoped>
#navbar {
    min-height: 80px;
}
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
    margin: auto;
}
</style>
