

const BASE_URL_API = 'https://database.tipmrebuilders.com/tipmecm-rest/';
const SOFTWARE_NAME = 'TIPM and ECM Rebuilders';
const ECMSITE = 'liveecm';
const TIPMSITE = 'livetipm';
const ECMURL = 'https://ecmrebuilders.com/';
const TIPMURL = 'https://tipmrebuilders.com/';

const SA_TIPM_ID = "31512";
const SA_ECM_ID = "33992";
const SA_ECM_TOKEN = "?token=793c74681c&from=2000-01-01&sort=highest&xml=false";
const SA_TIPM_TOKEN = "?token=931e8d534b&from=2000-01-01&sort=highest&xml=false";
const SA_PRODUCT_RATINGS = 'https://api.shopperapproved.com/aggregates/products/'; //https://api.shopperapproved.com/aggregates/products/31512/195?token=931e8d534b&xml=false
const SA_PRODUCT_REVIEWS = 'https://api.shopperapproved.com/products/reviews/'; //https://api.shopperapproved.com/products/reviews/31512/195?token=931e8d534b&limit=100&xml=false
const SA_SITE_REVIEWS = 'https://api.shopperapproved.com/reviews/'; //https://api.shopperapproved.com/reviews/33992?token=793c74681c&from=2011-01-01&rating=1%2C2%2C3%2C4%2C5&sort=highest&limit=100&test=false&xml=false

const SHIPSTATION_ECM_ID = "235901";
const SHIPSTATION_TIPM_ID = "69270";
const SHIPSTATION_BASE_URL = 'https://database.tipmrebuilders.com/shipstation/shipment.rest.php';
const FEDEX_BASE_URL = 'https://database.tipmrebuilders.com/shipstation/fedex.rest.php?';

export default {
    BASE_URL: BASE_URL_API,
    SOFTWARE_NAME: SOFTWARE_NAME,
    ECMSITE: ECMSITE,
    TIPMSITE: TIPMSITE,
    SA_TIPM_ID: SA_TIPM_ID,
    SA_ECM_ID: SA_ECM_ID,
    SA_ECM_TOKEN: SA_ECM_TOKEN,
    SA_TIPM_TOKEN: SA_TIPM_TOKEN,
    SA_PRODUCT_RATINGS: SA_PRODUCT_RATINGS,
    SA_PRODUCT_REVIEWS: SA_PRODUCT_REVIEWS,
    SA_SITE_REVIEWS: SA_SITE_REVIEWS,
    SHIPSTATION_ECM_ID: SHIPSTATION_ECM_ID,
    SHIPSTATION_TIPM_ID: SHIPSTATION_TIPM_ID,
    SHIPSTATION_BASE_URL: SHIPSTATION_BASE_URL,
    FEDEX_BASE_URL: FEDEX_BASE_URL,
    ECMURL: ECMURL,
    TIPMURL: TIPMURL
}