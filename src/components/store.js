import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    content: '',
    index:'',
    isEdit:''
  }

  export default new Vuex.Store({
    state:state,
    mutations: {
        setCurrentTextarea(state,item) {
            state.content = item
        },
        setCurrentIndex(state,index) {
            state.index = index
        },
        setIsMarked() {
            state.isEdit = true
        }
    }
  });
  