<template>
  <div class="index-wrap">
    <navbar/>
    <router-view></router-view>
    
    <bottom/>
  </div>
</template>

<script>
import navbar from './components/nav'
import bottom from './components/bottom'
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    navbar,
    bottom
  }
}
</script>

<style>
.index-wrap {
    min-width: 1700px;
}
.el-menu-item, .el-submenu__title {
    color: #4f71b1!important;
    font-size: 16px!important;
}
.el-menu-item-group .el-menu-item  {
    font-size: 14px!important;
}
</style>
