import Errors from '@/common/errors';
import { SET_LOADING, SET_ERROR, CLEAR_ERROR, 
   SET_DRAWER, SET_MENUS, SET_WINDOW_WIDTH,
   SET_RESPONSIVE, TOGGLE_DRAWER, SET_APP_ACTIONS
} from '@/store/mutations.type';

const initialState = {
   loading: false,
   loadingText: '',
   sideBarWidth: 260,
   windowWidth: 991,
   responsive: false,
   drawer: null,
   menus: [],
   actions: [],
   errorList: new Errors(),
};

export const state = { ...initialState };


const getters = {
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
   appActions(state) {
      return state.actions;
   },
   errorList(state) {
      return state.errorList;
   }
};



const mutations = {
   [SET_LOADING](state, loading, text = '') {
      state.loading = loading;
      if(loading) state.loadingText = text;
      else state.loadingText = '';
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
   [SET_APP_ACTIONS](state, actions) {
      state.actions = actions;
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
 