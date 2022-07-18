import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    sessionData: null,
    selectedProduct: null
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
