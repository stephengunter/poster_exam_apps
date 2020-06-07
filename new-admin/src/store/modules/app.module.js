import Errors from '@/common/errors';
import { INIT, SCROLL_TOP } from '@/store/actions.type';
import { SET_CURRENT_PAGE, SET_LOADING, SET_ERROR, CLEAR_ERROR, 
   SET_DRAWER, SET_MENUS, SET_WINDOW_WIDTH,
   SET_RESPONSIVE, TOGGLE_DRAWER } from '@/store/mutations.type';

const initialState = {
   currentPage: null,
   loading: false,
   sideBarWidth: 260,
   windowWidth: 991,
   responsive: false,
   drawer: null,
   menus: [],
   errorList: new Errors(),
};

export const state = { ...initialState };


const getters = {
   currentPage(state) {
      return state.currentPage;
   },
   loading(state) {
      return state.loading;
   },
   menus(state) {
      return state.menus;
   },
   windowWidth(state) {
      return state.windowWidth;
   },
   contentMaxWidth(state) {
      if(state.responsive) return state.windowWidth * 0.9;
      return (state.windowWidth - state.sideBarWidth) * 0.9;
   },
   responsive(state) {
      return state.responsive;
   },
   errorList(state) {
      return state.errorList;
   }
};


const actions = {
   [INIT](context) {
      context.commit(SET_LOADING, false);
      context.commit(CLEAR_ERROR);
      context.commit(SET_CURRENT_PAGE, null);
   },
   [SCROLL_TOP](context) {
      var element = document.getElementById('app-container');
      if(!element) return;
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest'});
   },
}



const mutations = {
   [SET_CURRENT_PAGE](state, page) {
      if(page) state.currentPage = page;
      else state.currentPage = null;
   },
   [SET_LOADING](state, loading) {
      state.loading = loading;
   },
   [SET_WINDOW_WIDTH](state, val) {
      state.windowWidth = val;
   },
   [SET_RESPONSIVE](state, val) {
      state.responsive = val;
   },
   [SET_DRAWER](state, drawer) {
      state.drawer = drawer;
   },
   [TOGGLE_DRAWER](state) {
      state.drawer = !state.drawer;
   },
   [SET_MENUS](state, menus) {
      state.menus = menus;
   },
   [SET_ERROR](state, errors) {
      state.errorList.record(errors);
   },
   [CLEAR_ERROR](state) {
      state.errorList.clear();   
   },
};

export default {
   state,
   mutations,
   getters
};
 