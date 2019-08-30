import Errors from '@/common/errors';
import { SET_LOADING, SET_ERROR, CLEAR_ERROR, 
   SET_DRAWER, SET_MENUS,
   SET_RESPONSIVE, TOGGLE_DRAWER } from '@/store/mutations.type';

const initialState = {
   loading: false,
   responsive: false,
   drawer: null,
   menus: [],
   color: 'info',
   image: '',
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
   errorList(state) {
     return state.errorList;
   }
};



const mutations = {
   [SET_LOADING](state, loading) {
      state.loading = loading;
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
 