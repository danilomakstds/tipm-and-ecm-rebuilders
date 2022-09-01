import moment from 'moment'
import store from '../store';
import axios from 'axios'
import SettingsConstants from '../constants/settings.constants'
import Swal from 'sweetalert2'
import { mapState } from 'vuex';

export default {
    computed: mapState([
        'cartKeyECM',
        'cartKeyTIPM',
        'cartItemCount',
        'cartTIPMCount',
        'cartECMCount',
        'cartItemList'
    ]),
    methods: {
        cleanString: function (string) {
            if (string) {
                return string.replace(/&amp;/g,'&');
            } else {
                return null;
            }
        },
        cleanPartNumber: function (string) {
            if (string) {
                return string.replace(/- Part/g,'Part');
            } else {
                return null;
            }
        },
        formatRegularPrice (price) {
            var finalPrice = null;
            if (!price.includes('.')) {
                finalPrice = price+'.00';
            } else {
                finalPrice = price;
            }
            return finalPrice;
        },
        validateEmail: function (email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        },
        kFormatter: function (num) {
            if (Math.abs(num) < 999999) {
                return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(2)) + 'K' : Math.sign(num)*Math.abs(num)
            } else {
                return Math.abs(num) > 999999 ? Math.sign(num)*((Math.abs(num)/1000000).toFixed(2)) + 'M' : '';
            }
            
        },
        deviceType: function () {
            const ua = navigator.userAgent;
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
                return "tablet";
            }
            else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
                return "mobile";
            }
            return "desktop";
        },
        isMobile: function () {
            if (this.deviceType == 'mobile' || this.deviceType == 'tablet') {
                return true;
            } else {
                return false;
            }
        },
        getStars: function (rating, height) {
            // Round to nearest half
            var h = height ? height : '10';
            rating = Math.round(rating * 2) / 2;
            let output = [];
            // Append all the filled whole stars
            for (var i = rating; i >= 1; i--)
                output.push('<img src="https://database.tipmrebuilders.com/resources/star-solid-fill.svg" class="star-icon" style="height:'+h+'px">&nbsp;');
            // If there is a half a star, append it
            if (i == .5) {
                output.push('<img sr="https://database.tipmrebuilders.com/resources/star-half-solid-fill.svg" class="star-icon" style="height:'+h+'px">&nbsp;');
            }
            // Fill the empty stars
            // for (let i = (5 - rating); i >= 1; i--)
            //   output.push('<img src="https://database.tipmrebuilders.com/resources/star-half-solid.svg" class="star-icon" style="height:10px">&nbsp;');
            return output.join('');
        },
        formatDate: function (date) {
           return moment(date).fromNow();
        },
        addToCart: function (id, source) {
            var base = null;
            var cartKey = null;
            if ('ECM' == source) {
              base = SettingsConstants.ECMURL;
              cartKey = this.cartKeyECM;
            } else {
              base = SettingsConstants.TIPMURL;
              cartKey = this.cartKeyTIPM;
            }
      
            this.emitter.emit('showFullScreenLoader', true);
            var url = base + 'wp-json/cocart/v2/cart/add-item?id='+id+'&quantity=1';
            if (cartKey) {
              url = url + '&cart_key=' + cartKey;
            }
            axios.post(url)
              .then(function (response) {
                if (response.data.cart_key) {
                  this.emitter.emit('showFullScreenLoader', false);
                  Swal.fire({
                    title: 'Great!',
                    text: 'Item was added to '+source+' cart!',
                    icon: 'success',
                    confirmButtonText: 'View Cart'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        location.pathname = '/cart';
                    } else if (result.isDenied) {
                        console.log('go to cart cancelled');
                    }
                  })
      
                  if ('ECM' == source) {
                    store.commit('SET_CART_ECM_COUNTER', response.data.items.length);
                  } else {
                    store.commit('SET_CART_TIPM_COUNTER', response.data.items.length);
                  }
                  store.commit('SET_CART_ITEM_COUNTER', this.cartTIPMCount + this.cartECMCount);
      
                  var list = [];
                  list = this.cartItemList.concat(response.data.items.filter(
                  function (item) {
                    return this.cartItemList.indexOf(item) < 0;
                  }.bind(this)));
                  store.commit('SET_CART_ITEM_LIST', list);
      
                  if (!cartKey) {
                    store.commit('SET_CART_KEY_'+source, response.data.cart_key);
                  }
                }
              }.bind(this))
              .catch(function (error) {
                console.log(error);
            });
        }, 
    }
  };