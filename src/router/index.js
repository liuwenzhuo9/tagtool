import Vue from 'vue'
import Router from 'vue-router'
const allSentences = () =>import('@/components/allSentences')
const tagEntity = () =>import('@/components/tagEntity')
const tagResult = () =>import('@/components/tagResult')

Vue.use(Router)

export default new Router({
    mode: 'history',
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
    ]
})