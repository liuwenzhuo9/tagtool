import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    content: '',
    index:'',
    isMark:'',
    // activeIndex:''
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
        // setActiveIndex(){
        //     state.activeIndex = 1;
        // }
    }
  });
  