<template>
  <div>
    <div class="index-wrap">
      <navbar/>
      <router-view></router-view>
    </div>
    <!-- <bottom/> -->
</div>
</template>

<script>
import navbar from './components/nav'
import bottom from './components/bottom'

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
    max-width: 1300px;
    margin: auto;
    min-height: 870px;
}
.el-menu-item, .el-submenu__title {
    color: #4f71b1!important;
    font-size: 16px!important;
    /* border-bottom:#4f71b1 */
}
</style>
