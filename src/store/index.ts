import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    sessionData: null,
    popularProducList: [],
    selectedProduct: null,
    selectedYear: null,
    selectedMake: null,
    selectedModel: null,
    searchKeyword: null,
    searchVinNumber: null,
    fedexToken: null,
    trackedOrderNumber: null,
    youtubeVideoList: [],
    youtubeChannelInfo: null,
    customerOrderNumberList: [],
    customerOrderWatchList: [],
    customerOrderList: [],
    shopperApprovedData: null,
    productBackRoute: null,
  },
  mutations: {
    SET_SESSION_DATA: function (state, sessionData) {
      state.sessionData = sessionData;
    },
    RESET_SESSION_DATA: function (state) {
      state.sessionData = null;
    },
    SET_POPULAR_PRODUCT_LIST: function (state, popularProducList) {
      state.popularProducList = popularProducList;
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
    SET_SEARCH_VIN_NUMBER: function (state, searchVinNumber) {
      state.searchVinNumber = searchVinNumber;
    },
    SET_FEDEX_TOKEN: function (state, fedexToken) {
      state.fedexToken = fedexToken;
    },
    SET_TRACKED_ORDER_NUMBER: function (state, trackedOrderNumber) {
      state.trackedOrderNumber = trackedOrderNumber;
    },
    SET_YOUTUBE_VIDEOLIST: function (state, youtubeVideoList) {
      state.youtubeVideoList = youtubeVideoList;
    },
    SET_YOUTUBE_CHANNELINFO: function (state, youtubeChannelInfo) {
      state.youtubeChannelInfo = youtubeChannelInfo;
    },
    SET_CUSTOMER_ORDERNUMBER_LIST: function (state, customerOrderNumberList) {
      state.customerOrderNumberList = customerOrderNumberList;
    },
    RESET_CUSTOMER_ORDERNUMBER_LIST: function (state) {
      state.customerOrderNumberList = [];
    },
    SET_CUSTOMER_ORDER_WATCHLIST: function (state, customerOrderWatchList) {
      state.customerOrderWatchList = [].concat(state.customerOrderWatchList, customerOrderWatchList);
    },
    RESET_CUSTOMER_ORDER_WATCHLIST: function (state) {
      state.customerOrderWatchList = [];
    },
    SET_CUSTOMER_ORDER_LIST: function (state, customerOrderList) {
      state.customerOrderList = customerOrderList;
    },
    RESET_CUSTOMER_ORDER_LIST: function (state) {
      state.customerOrderList = [];
    },
    SET_SA_DATA: function (state, shopperApprovedData) {
      state.shopperApprovedData = shopperApprovedData;
    },
    RESET_SA_DATA: function (state) {
      state.shopperApprovedData = null;
    },
    SET_PRODUCT_BACK_ROUTE: function (state, productBackRoute) {
      state.productBackRoute = productBackRoute;
    },
    RESET_PRODUCT_BACK_ROUTE: function (state) {
      state.productBackRoute = null;
    },
  },
  getters: {

  },
  actions: {

  },
  modules: {

  },
  plugins: [createPersistedState()],
})
