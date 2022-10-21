

const BASE_URL_API = 'https://database.tipmrebuilders.com/tipmecm-rest/';
const BASE_URL_API_MOBILE = 'https://tipmecmmobileapp.kinsta.cloud/rest/';
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
const STAMPS_COM_BASE_URL = 'https://database.tipmrebuilders.com/shipstation/stamps_com.rest.php?';
const SHIP_ENGINE_APIKEY = 'TEST_KCOIwElHX4I/oYEGXgGjeac9ROSMC5iCKmnI2cfvpdo';

const GOOGLE_API = 'AIzaSyDX_bIjjI3y6-CzvDu-p1XAJMeuXyXLxfY';
const YT_CHANNEL_ID = 'UCzlj19TjvKvJXATcLriv_Bg';
const GOOGLE_BASE_URL = 'https://youtube.googleapis.com/youtube/v3/';

const APP_DESCRIPTION = `<img src="https://tipmrebuilders.com/wp-content/uploads/2022/01/email_banner.png" class="w-100 mb-4"/>
<p>If you are interested in purchasing a rebuilt TIPM or ECM from us, or having one repaired, please contact us at 818-798-5558 or email us at
<a href="mailto:tipmrepair@gmail.com">tipmrepair@gmail.com</a></p>
<p>Visit our websites to shop for tipms, ecms and more info:<br/>
<a href="https://tipmrebuilders.com" target="_blank">https://tipmrebuilders.com</a> and <a href="https://ecmrebuilders.com" target="_blank">https://ecmrebuilders.com</a>.</p>
<p>We have rebuilt and repaired hundreds of tipm's and ecm's for our customers at a fraction of the cost of going to the dealers! Feel free to contact us with any questions! Have a great day :)</p>`;

const VIN_DECODE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/';
const VALID_MAKE = ['chrysler','dodge', 'ram', 'jeep', 'volkswagen', 'fiat', 'plymouth'];
//const BASIC_AUTH = 'Basic ZGFuaWxvQG1ha3NkdHMuY29tOmNob2NvUm9hc3QyMw==';
const ADDED_PRICE_OF_LID = 15;
const ADDED_PRICE_OF_VEHICLE_CONFIG = 75;
const ADDED_PRICE_OF_DEFAULT_COREFEE = 40;

export default {
    BASE_URL: BASE_URL_API,
    BASE_URL_API_MOBILE: BASE_URL_API_MOBILE,
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
    TIPMURL: TIPMURL,
    GOOGLE_API: GOOGLE_API,
    YT_CHANNEL_ID: YT_CHANNEL_ID,
    GOOGLE_BASE_URL: GOOGLE_BASE_URL,
    APP_DESCRIPTION: APP_DESCRIPTION,
    VIN_DECODE_URL: VIN_DECODE_URL,
    VALID_MAKE: VALID_MAKE,
    //BASIC_AUTH: BASIC_AUTH,
    ADDED_PRICE_OF_LID: ADDED_PRICE_OF_LID,
    ADDED_PRICE_OF_DEFAULT_COREFEE: ADDED_PRICE_OF_DEFAULT_COREFEE,
    SHIP_ENGINE_APIKEY: SHIP_ENGINE_APIKEY,
    STAMPS_COM_BASE_URL: STAMPS_COM_BASE_URL,
    ADDED_PRICE_OF_VEHICLE_CONFIG: ADDED_PRICE_OF_VEHICLE_CONFIG
}