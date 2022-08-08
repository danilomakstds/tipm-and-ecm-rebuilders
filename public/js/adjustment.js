jQuery(document).ready(function ($) {
    var checkExist = setInterval(function() {
        if ($('.ytp-gradient-bottom').length) {
            $('.ytp-gradient-bottom').remove();
            $('.ytp-gradient-top').remove();
            clearInterval(checkExist);
        }
    }, 100);
});
