import Vue from 'vue'
import Router from 'vue-router'
const allSentences = () =>import('@/components/allSentences')
const tagEntity = () =>import('@/components/tagEntity')
const tagResult = () =>import('@/components/tagResult')
const personal = () =>import('@/components/PersonalCenter/login')
const labUser = () =>import('@/components/PersonalCenter/labUser')
const system = () =>import('@/components/PersonalCenter/system')
const regUser = () =>import('@/components/PersonalCenter/regUser')
const showTasks = () =>import('@/components/showTasks')

Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [
        {
            path:'/',
            name:'allSentences',
            component: allSentences,
        },
        {
            path:'/allSentences',
            name:'allSentences',
            component: allSentences,
        },
        {
            path:'/tagEntity',
            name:'tagEntity',
            component: tagEntity,
        },
        {
            path:'/tagResult',
            name:'tagResult',
            component: tagResult,
        },
        {
            path: '/personal',
            name: 'personal',
            meta:{
              needAuth : true,
            },
            component: personal,
          },
          {
            path: '/labUser',
            name: 'labUser',
            component: labUser,
          },
          {
            path: '/system',
            name: 'system',
            component: system,
          },
          {
            path: '/regUser',
            name: 'regUser',
            component: regUser,
          },
          {
            path: '/showTasks',
            name: 'showTasks',
            component: showTasks,
          },
    ]
})