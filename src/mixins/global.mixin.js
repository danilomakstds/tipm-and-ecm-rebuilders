import moment from 'moment'

export default {
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
        }   
    }
  };