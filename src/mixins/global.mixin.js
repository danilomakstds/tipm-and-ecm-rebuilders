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
                if (price.split('.')[1].length == 1) {
                    finalPrice = price+'0';
                } else {
                    finalPrice = price;
                }
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
        addToCart: function (id, source, cart_data) {
            var base = null;
            var cartKey = null;
            var item_data = [];
            if (!Object.keys(cart_data).length == 0) {
                var cartdata = JSON.parse(cart_data);
                if ('ECM' == source) {
                    cartKey = this.cartKeyECM;
                    item_data = {
                        "tmcartepo": [
                            {
                                "mode": "builder",
                                "cssclass": "orig_vin_input",
                                "element": {
                                    "type": "textfield",
                                    "rules": [
                                        [
                                            ""
                                        ]
                                    ],
                                    "rules_type": [
                                        [
                                            ""
                                        ]
                                    ],
                                    "_": {
                                        "price_type": false
                                    }
                                },
                                "name": "Enter Your 17-digit VIN",
                                "value": cartdata.Enter_Your_17_digit_VIN.toUpperCase(),
                                "price": 0,
                                "section": "61aef0290daa43.58738802",
                                "section_label": "Enter Your 17-digit VIN",
                                "percentcurrenttotal": 0,
                                "fixedcurrenttotal": 0,
                                "currencies": [],
                                "price_per_currency": [],
                                "quantity": 1,
                                "key_id": 0,
                                "keyvalue_id": 0
                            },
                            {
                                "mode": "builder",
                                "cssclass": "vin_output",
                                "element": {
                                    "type": "textfield",
                                    "rules": [
                                        [
                                            ""
                                        ]
                                    ],
                                    "rules_type": [
                                        [
                                            ""
                                        ]
                                    ],
                                    "_": {
                                        "price_type": false
                                    }
                                },
                                "name": "This Vehicle",
                                "value": cartdata.This_Vehicle,
                                "price": 0,
                                "section": "61b19acc705ce2.94202255",
                                "section_label": "This Vehicle",
                                "percentcurrenttotal": 0,
                                "fixedcurrenttotal": 0,
                                "currencies": [],
                                "price_per_currency": [],
                                "quantity": 1,
                                "key_id": 0,
                                "keyvalue_id": 0
                            }
                        ],
                        "tmpost_data": {
                            "tm-epo-counter": "1",
                            "tcaddtocart": id,
                            "tmcp_textfield_0": cartdata.Enter_Your_17_digit_VIN.toUpperCase(),
                            "tmcp_textfield_1": cartdata.This_Vehicle,
                            "quantity": "1",
                            "add-to-cart": id
                        },
                        "tmdata": {
                            "tmcp_post_fields": {
                                "tmcp_textfield_0": cartdata.Enter_Your_17_digit_VIN.toUpperCase(),
                                "tmcp_textfield_1": cartdata.This_Vehicle
                            },
                            "product_id": id,
                            "per_product_pricing": true,
                            "variation_id": false,
                            "tc_added_in_currency": "USD",
                            "tc_default_currency": "USD",
                            "tmcartepo_data": [
                                {
                                    "key": cartdata.Enter_Your_17_digit_VIN.toUpperCase(),
                                    "attribute": "tmcp_textfield_0"
                                },
                                {
                                    "key": cartdata.This_Vehicle,
                                    "attribute": "tmcp_textfield_1"
                                }
                            ]
                        },
                    }
    
                    if (cartdata.Current_Mileage) {
                        var current_mileage = {
                            "mode": "builder",
                            "cssclass": "vehicle_mileage",
                            "element": {
                                "type": "textfield",
                                "rules": [
                                    [
                                        ""
                                    ]
                                ],
                                "rules_type": [
                                    [
                                        ""
                                    ]
                                ],
                                "_": {
                                    "price_type": false
                                }
                            },
                            "name": "Current Mileage",
                            "value": cartdata.Current_Mileage,
                            "price": 0,
                            "section": "61f384449114d3.14596028",
                            "section_label": "Current Mileage",
                            "percentcurrenttotal": 0,
                            "fixedcurrenttotal": 0,
                            "currencies": [],
                            "price_per_currency": [],
                            "quantity": 1,
                            "key_id": 0,
                            "keyvalue_id": 0
                        }
                        item_data.tmcartepo.push(current_mileage);
                        item_data.tmpost_data.tmcp_textfield_2 = cartdata.Current_Mileage;
                        item_data.tmdata.tmcp_post_fields.tmcp_textfield_2 = cartdata.Current_Mileage;
                        item_data.tmdata.tmcartepo_data.push({
                            "key": cartdata.Current_Mileage,
                            "attribute": "tmcp_textfield_2"
                        });
                    }
    
                    if (cartdata.Transmission_Type) {
                        var transmission_type = {
                            "mode": "builder",
                            "cssclass": "trans_type",
                            "hidelabelincart": "",
                            "hidevalueincart": "",
                            "hidelabelinorder": "",
                            "hidevalueinorder": "",
                            "element": {
                                "type": "radio",
                                "rules": {
                                    "Automatic_0": [
                                        ""
                                    ],
                                    "Manual_1": [
                                        ""
                                    ]
                                },
                                "rules_type": {
                                    "Automatic_0": [
                                        ""
                                    ],
                                    "Manual_1": [
                                        ""
                                    ]
                                },
                                "_": {
                                    "price_type": false
                                }
                            },
                            "name": "Transmission Type",
                            "value": cartdata.Transmission_Type.split('_')[0],
                            "price": 0,
                            "section": "61f384589114e9.09906841",
                            "section_label": "Transmission Type",
                            "percentcurrenttotal": 0,
                            "fixedcurrenttotal": 0,
                            "currencies": [],
                            "price_per_currency": {
                                "USD": ""
                            },
                            "quantity": 1,
                            "multiple": "1",
                            "key": cartdata.Transmission_Type,
                            "key_id": 0,
                            "keyvalue_id": 0
                        }
                        item_data.tmcartepo.push(transmission_type);
                        item_data.tmpost_data.tmcp_radio_3 = cartdata.Transmission_Type;
                        item_data.tmdata.tmcp_post_fields.tmcp_radio_3 = cartdata.Transmission_Type;
                        item_data.tmdata.tmcartepo_data.push({
                            "key": cartdata.Transmission_Type,
                            "attribute": "tmcp_radio_3"
                        });
                    }
                } else {
                    cartKey = this.cartKeyTIPM;

                    item_data = {
                        "tmcartepo": [],
                       'tmpost_data' : {
                            "tm-epo-counter": "1",
                            "tcaddtocart": id,
                            "quantity": "1",
                            "add-to-cart": id
                        },
                        "tmdata": {
                            "tmcp_post_fields": {},
                            "product_id": id,
                            "per_product_pricing": true,
                            "variation_id": false,
                            "tc_added_in_currency": "USD",
                            "tc_default_currency": "USD",
                            "tmcartepo_data": []
                        },
                    }

                    if (cartdata.Core_Fee) {
                        var core_fee = {
                            "mode": "builder",
                            "cssclass": "test_class",
                            "element": {
                                "type": "range",
                                "rules": [
                                    [
                                        ""
                                    ]
                                ],
                                "rules_type": [
                                    [
                                        "currentstep"
                                    ]
                                ],
                                "_": {
                                    "price_type": false
                                }
                            },
                            "name": "Use slider to set your own core fee and get double your money back! ",
                            "value": cartdata.Core_Fee,
                            "price": parseInt(cartdata.Core_Fee),
                            "section": "61107dfc04ab62.87263170",
                            "section_label": "Use slider to set your own core fee and get double your money back! ",
                            "currencies": [],
                            "price_per_currency": [],
                            "percentcurrenttotal": 0,
                            "fixedcurrenttotal": 0,
                            "quantity": 1,
                            "key_id": 0,
                            "keyvalue_id": 0
                        }
                        item_data.tmcartepo.push(core_fee);
                        item_data.tmpost_data.tmcp_range_3 = cartdata.Core_Fee;
                        item_data.tmdata.tmcp_post_fields.tmcp_range_3 = cartdata.Core_Fee;
                        item_data.tmdata.tmcartepo_data.push({
                            "key": cartdata.Core_Fee,
                            "attribute": "tmcp_range_3"
                        });
                    }

                    if (cartdata.FxF_Check) {
                        var fourbyfour_check = {
                            "mode": "builder",
                            "element": {
                                "type": "radio",
                                "rules": {
                                    "W/ 4x4_0": [
                                        ""
                                    ],
                                    "W/O 4x4_1": [
                                        ""
                                    ]
                                },
                                "rules_type": {
                                    "W/ 4x4_0": [
                                        ""
                                    ],
                                    "W/O 4x4_1": [
                                        ""
                                    ]
                                },
                                "_": {
                                    "price_type": false
                                }
                            },
                            "name": "4x4 Check",
                            "value": cartdata.FxF_Check.split('_')[0],
                            "price": 0,
                            "section": "62a3ac95c90705.57882013",
                            "section_label": "4x4 Check",
                            "percentcurrenttotal": 0,
                            "fixedcurrenttotal": 0,
                            "currencies": [],
                            "price_per_currency": {
                                "USD": ""
                            },
                            "quantity": 1,
                            "multiple": "1",
                            "key": cartdata.FxF_Check,
                            "key_id": 0,
                            "keyvalue_id": 0
                        }
                        item_data.tmcartepo.push(fourbyfour_check);
                        item_data.tmpost_data.tmcp_radio_0 = cartdata.FxF_Check;
                        item_data.tmdata.tmcp_post_fields.tmcp_radio_0 = cartdata.FxF_Check;
                        item_data.tmdata.tmcartepo_data.push({
                            "key": cartdata.FxF_Check,
                            "attribute": "tmcp_radio_0"
                        });
                    }

                    if (cartdata.Lid_Options) {
                        var lid_options = {
                            "mode": "builder",
                            "element": {
                                "type": "radio",
                                "rules": {
                                    "Include a Lid_0": [
                                        SettingsConstants.ADDED_PRICE_OF_LID.toString()
                                    ],
                                    "No Lid Needed_1": [
                                        "0"
                                    ]
                                },
                                "rules_type": {
                                    "Include a Lid_0": [
                                        ""
                                    ],
                                    "No Lid Needed_1": [
                                        ""
                                    ]
                                },
                                "_": {
                                    "price_type": false
                                }
                            },
                            "name": "Lid Options",
                            "value": cartdata.Lid_Options.split('_')[0],
                            "price": 15,
                            "section": "5e0a4fea7ba940.51559257",
                            "section_label": "Lid Options",
                            "percentcurrenttotal": 0,
                            "fixedcurrenttotal": 0,
                            "currencies": [],
                            "price_per_currency": {
                                "USD": 15
                            },
                            "quantity": 1,
                            "multiple": "1",
                            "key": cartdata.Lid_Options,
                            "key_id": 0,
                            "keyvalue_id": 0
                        }
                        item_data.tmcartepo.push(lid_options);
                        item_data.tmpost_data.tmcp_radio_1 = cartdata.Lid_Options;
                        item_data.tmdata.tmcp_post_fields.tmcp_radio_1 = cartdata.Lid_Options;
                        item_data.tmdata.tmcartepo_data.push({
                            "key": cartdata.Lid_Options,
                            "attribute": "tmcp_radio_1"
                        });
                    }
                }
            }
            if ('ECM' == source) {
                base = SettingsConstants.ECMURL;
            } else {
                base = SettingsConstants.TIPMURL;
            }
            this.emitter.emit('showFullScreenLoader', true);
            var url = base + 'wp-json/cocart/v2/cart/add-item?id='+id;
            if (cartKey) {
              url = url + '&cart_key=' + cartKey;
            }
            axios({
                method: "POST",
                url: url,
                data: {
                    "quantity": "1",
                    "item_data": item_data,
                },
                headers: { "Content-Type": "application/json" },
            })
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
        validateVin: function (vin) {
            if (vin == "11111111111111111") { return false; }
            if (!vin.match("^([0-9a-hj-npr-zA-HJ-NPR-Z]{10,17})+$")) { return false;}
            var letters = [{ k: "A", v: 1 }, { k: "B", v: 2 }, { k: "C", v: 3 },
            { k: "D", v: 4 }, { k: "E", v: 5 }, { k: "F", v: 6 }, { k: "G", v: 7 },
            { k: "H", v: 8 }, { k: "J", v: 1 }, { k: "K", v: 2 }, { k: "L", v: 3 },
            { k: "M", v: 4 }, { k: "N", v: 5 }, { k: "P", v: 7 }, { k: "R", v: 9 },
            { k: "S", v: 2 }, { k: "T", v: 3 }, { k: "U", v: 4 }, { k: "V", v: 5 },
            { k: "W", v: 6 }, { k: "X", v: 7 }, { k: "Y", v: 8 }, { k: "Z", v: 9 }];
            var weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
            var exclude = ["I", "O", "Q"];
            var val = 0;
            for (var idx = 0; idx < vin.length; idx++) {
                var item = vin.charAt(idx).toUpperCase();
                if (exclude.includes(function (x) { return x == item; })) { return false; }
                var pos = (item.match("^[0-9]+$") != null) ? parseInt(item) : letters.filter(function (letter) { return letter.k == item; })[0].v;
                val += (pos * weights[idx]);
            }
            var checksum = (val % 11);
            //  if (!(vin.charAt(8) == (checksum < 10 ? checksum.toString() : "X"))) {
            //     return 'ninth-digit-error';
            // }
            return (vin.charAt(8) == (checksum < 10 ? checksum.toString() : "X"));
        },
        computePriceAddToCart: function (price) {
            var addedPrice = this.coreFeePrice + this.lidOptionsPrice;
            var productPrice = parseFloat(price) + parseFloat(addedPrice);
            productPrice = this.formatRegularPrice(productPrice.toString());
            return productPrice;
        },
        createAccount: function (email, password, color, showAlert) {
            if (!color) {
                color = '#4b7838';
            }
            var bodyFormData = new FormData();
            bodyFormData.append('email', email);
            if (password) {
                bodyFormData.append('password', password);
            } else {
                bodyFormData.append('password', '');
            }
            axios({
                method: "post",
                url: SettingsConstants.BASE_URL + "customerREST.php?op=create_customer&site="+SettingsConstants.TIPMSITE,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(function (response) {
            if (response.data) {
                if (showAlert) {
                    Swal.fire({
                        title: 'Great!',
                        text: 'Account created!',
                        icon:'success',
                        confirmButtonColor: color,
                    });
                }
                store.commit('SET_SESSION_DATA', response.data);
                console.log(response.data)
            }
            }.bind(this));
        },
    }
  };