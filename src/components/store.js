import Vue from 'vue';
import Vuex from 'vuex';
import { isLogin,getCookie } from '../unit/fetch';

Vue.use(Vuex);

const state = {
    content: '',
    index:'',
    isMark:'',
    activeIndex:'0',
    loginstate:isLogin(),
    loginuser:getCookie('account'),
    loginrole:getCookie('role'),
    loginname:getCookie('name'),
    personState: true,
  }

  export default new Vuex.Store({
    state:state,
    mutations: {
        setCurrentTextarea(state,item) {
            state.content = item;
        },
        setCurrentIndex(state,index) {
            state.index = index;
        },
        setIsMarked(state,isMark) {
            state.isMark = isMark;
        },
        setActiveIndex(state,activeIndex){
            state.activeIndex = activeIndex;
        },
        changelogin (state) {
            state.loginstate = isLogin();
        },
        changeuser(state) {
            state.loginuser = getCookie('account');
        },
        changerole(state) {
            state.loginrole = getCookie('role');
        },
        changename(state) {
            state.loginname = getCookie('name');
        },
        changePersonState(state, n) {
            state.personState = n;
        },
    }
  });
  