import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    sessionData: null,
    selectedProduct: null,
    selectedYear: null,
    selectedMake: null,
    selectedModel: null,
    searchKeyword: null,
    fedexToken: null,
    trackedOrderNumber: null
  },
  mutations: {
    SET_SESSION_DATA: function (state, sessionData) {
      state.sessionData = sessionData;
    },
    SET_SELECTED_PRODUCT: function (state, selectedProduct) {
      state.selectedProduct = selectedProduct;
    },
    RESET_SELECTED_PRODUCT: function (state) {
      state.selectedProduct = null;
    },
    SET_SELECTED_YEAR: function (state, selectedYear) {
      state.selectedYear = selectedYear;
    },
    SET_SELECTED_MAKE: function (state, selectedMake) {
      state.selectedMake = selectedMake;
    },
    SET_SELECTED_MODEL: function (state, selectedModel) {
      state.selectedModel = selectedModel;
    },
    SET_SEARCH_KEYWORD: function (state, searchKeyword) {
      state.searchKeyword = searchKeyword;
    },
    SET_FEDEX_TOKEN: function (state, fedexToken) {
      state.fedexToken = fedexToken;
    },
    SET_TRACKED_ORDER_NUMBER: function (state, trackedOrderNumber) {
      state.trackedOrderNumber = trackedOrderNumber;
    }
  },
  getters: {

  },
  actions: {

  },
  modules: {

  },
  plugins: [createPersistedState()],
})
