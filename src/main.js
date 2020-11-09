
import Vue from 'vue'
import App from './App.vue'
import store from './components/store'
import router from './router'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

Vue.use(ElementUI);
Vue.config.productionTip = false
library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

//登陆跳转
router.beforeEach((to,from,next) => {
  // 这里的meta就是我们刚刚在路由里面配置的meta
  if(to.meta.needAuth){
      // 下面这个判断是自行实现到底是否有没有登录
      if (!store.state.loginstate){
      // 没登录就继续
          next();
      }else {
      // 登录跳转到对应页面
          if (store.state.loginrole){
              let url = '/' + store.state.loginrole;
              next({
                  path : url,
                  query : {redirect : to.fullPath}
              });
        }else{
          next();
        }
      }
      // if(to.path == '/resource' && !store.state.loginstate){
      //   next();
      // }else{
      //   next({
      //     path : '/resource',
      //     query : {redirect : to.fullPath}
      //   });
      // }

    }
    else {
  // 不需要登录的，可以继续访问
      next();
  }
});