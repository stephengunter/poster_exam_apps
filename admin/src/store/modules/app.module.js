import Errors from '@/common/errors';
import { SET_LOADING, SET_ERROR, CLEAR_ERROR, 
   SET_DRAWER, SET_IMAGE, 
   SET_RESPONSIVE, SET_COLOR, TOGGLE_DRAWER } from '@/store/mutations.type';

const initialState = {
   loading: false,
   responsive: false,
   drawer: null,
   color: 'info',
   image: '',
   errorList: new Errors(),
};

export const state = { ...initialState };


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
   [SET_IMAGE](state, image) {
      state.image = image;
   },
   [SET_COLOR](state, color) {
      state.color = color;
   },
   [TOGGLE_DRAWER](state) {
      state.drawer = !state.drawer;
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
};
 