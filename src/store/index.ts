import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    sessionData: null,
    sessionDataTIPM: null,
    sessionDataECM: null,
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
    cartKeyECM: null,
    cartKeyTIPM: null,
    cartItemCount: 0,
    cartTIPMCount: 0,
    cartECMCount: 0,
    cartItemList: [],
    isInstallationSlideOpen: true,
    productsWithCoreRefund: [],
    productsWith4x4: [],
    productsWithOutLidOptions: [],
    onlineStatus: false,
  },
  mutations: {
    SET_SESSION_DATA: function (state, sessionData) {
      state.sessionData = sessionData;
    },
    RESET_SESSION_DATA: function (state) {
      state.sessionData = null;
    },
    SET_SESSION_DATA_TIPM: function (state, sessionDataTIPM) {
      state.sessionDataTIPM = sessionDataTIPM;
    },
    RESET_SESSION_DATA_TIPM: function (state) {
      state.sessionDataTIPM = null;
    },
    SET_SESSION_DATA_ECM: function (state, sessionDataECM) {
      state.sessionDataECM = sessionDataECM;
    },
    RESET_SESSION_DATA_ECM: function (state) {
      state.sessionDataECM = null;
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
    SET_CART_KEY_ECM: function (state, cartKeyECM) {
      state.cartKeyECM = cartKeyECM;
    },
    SET_CART_KEY_TIPM: function (state, cartKeyTIPM) {
      state.cartKeyTIPM = cartKeyTIPM;
    },
    RESET_CART_KEY: function (state) {
      state.cartKeyECM = null;
      state.cartKeyTIPM = null;
    },
    SET_CART_ITEM_COUNTER: function (state, cartItemCount) {
      state.cartItemCount = cartItemCount;
    },
    RESET_CART_ITEM_COUNTER: function (state) {
      state.cartItemCount = 0;
    },
    SET_CART_TIPM_COUNTER: function (state, cartTIPMCount) {
      state.cartTIPMCount = cartTIPMCount;
    },
    SET_CART_ECM_COUNTER: function (state, cartECMCount) {
      state.cartECMCount = cartECMCount;
    },
    SET_CART_ITEM_LIST: function (state, cartItemList) {
      state.cartItemList = cartItemList;
    },
    REST_CART_ITEM_LIST: function (state) {
      state.cartItemList = [];
    },
    SET_INSTALLATION_SLIDE_STATUS: function (state, isInstallationSlideOpen) {
      state.isInstallationSlideOpen = isInstallationSlideOpen;
    },
    SET_PRODUCTS_W_CORE_REFUND: function (state, productsWithCoreRefund) {
      state.productsWithCoreRefund = productsWithCoreRefund;
    },
    RESET_PRODUCTS_W_CORE_REFUND: function (state) {
      state.productsWithCoreRefund = [];
    },
    SET_PRODUCTS_W_4x4: function (state, productsWith4x4) {
      state.productsWith4x4 = productsWith4x4;
    },
    RESET_PRODUCTS_W_4x4: function (state) {
      state.productsWith4x4 = [];
    },
    SET_PRODUCTS_WOUT_LID_OPTIONS: function (state, productsWithOutLidOptions) {
      state.productsWithOutLidOptions = productsWithOutLidOptions;
    },
    RESET_PRODUCTS_WOUT_LID_OPTIONS: function (state) {
      state.productsWithOutLidOptions = [];
    },
    SET_ONLINE_STATUS: function (state, onlineStatus) {
      state.onlineStatus = onlineStatus;
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
