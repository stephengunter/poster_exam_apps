import Errors from '@/common/errors';
import { INIT, FETCH_ACTIONS, LOAD_ACTIONS } from '@/store/actions.type';

import { SET_CURRENT_PAGE, SET_BREAD_ITEMS, SET_LOADING, SET_ERROR, CLEAR_ERROR, 
   SET_DRAWER, SET_MENUS, SET_FOOTER_MENUS, SET_USER_MENUS, SET_WINDOW_WIDTH,
   SET_RESPONSIVE, TOGGLE_DRAWER, SET_VIEW_ACTIONS, SET_APP_ACTIONS
} from '@/store/mutations.type';

import { fetchViewActions } from '@/utils';

const initialState = {
   currentPage: null,
   breadItems: [],
   loading: false,
   loadingText: '',
   sideBarWidth: 260,
   windowWidth: 991,
   responsive: false,
   drawer: null,
   menus: [],
   footerMenus: [],
   userMenus: [],
   viewActions: [],
   actions: [],
   errorList: new Errors(),
};

export const state = { ...initialState };


const getters = {
   currentPage(state) {
      return state.currentPage;
   },
   breadItems(state) {
      return state.breadItems;
   },
   loading(state) {
      return state.loading;
   },
   menus(state) {
      return state.menus;
   },
   userMenus(state) {
      return state.userMenus;
   },
   footerMenus(state) {
      return state.footerMenus;
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

const actions = {
   [INIT](context) {
      context.commit(SET_LOADING, false);
      context.commit(CLEAR_ERROR);
      context.commit(SET_CURRENT_PAGE, null);
      context.commit(SET_BREAD_ITEMS, []);
      
   },
   [FETCH_ACTIONS](context, route) {
      context.commit(SET_APP_ACTIONS, []);
      let viewActions = fetchViewActions(route.name);
      context.commit(SET_VIEW_ACTIONS, viewActions);
   },
   [LOAD_ACTIONS](context, blocks) {
      let viewActions =  context.state.viewActions;

      let actions = [];
      blocks.forEach(block => {
         let blockActions = [];
         block.forEach(name => {
            blockActions.push(viewActions.find(item => item.name === name));
         })
         actions.push(blockActions);
      });

      context.commit(SET_APP_ACTIONS, actions);
   },
}



const mutations = {
   [SET_CURRENT_PAGE](state, page) {
      state.currentPage = page;
   },
   [SET_BREAD_ITEMS](state, items) {
      state.breadItems = items;
   },
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
   [SET_FOOTER_MENUS](state, footerMenus) {
      state.footerMenus = footerMenus;
   },
   [SET_USER_MENUS](state, userMenus) {
      state.userMenus = userMenus;
   },
   [SET_VIEW_ACTIONS](state, actions) {
      state.viewActions = actions;
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
   actions,
   mutations,
   getters
};
 