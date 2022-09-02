// Auter : @EldLicht

/** -----------
 * Constants
 ----------- */

//Generate Authorization Instance
const twitter = TwitterWebService.getInstance(
    '',//API Key
    ''//API secret key
);
const END_POINT_URL = 'https://api.twitter.com/1.1/statuses/update.json';
const BAERER_ID = ""

// Twitter IDs
const AUTHER_ID = "";
const TARGET_ID = "";

// Target user name
const USER_MYSELF = "";
const USER_TARGET = "";

// DeepL
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate?auth_key=';
const DEEPL_API_KEY = '';

/** -----------
 * Functions
 ----------- */

function postTweet(data, mentionUser) {
    /**
     * post to reply field
     *
     * args :
     *  data : JSON for tweet's ID, and text
     */

    // Check for duplecates
    if(isNotReplyed(data.id) == false){
        Logger.log("replyed.");

        return;
    }

    var service  = twitter.getService();
    var id = data.id; // target tweet id
    var texts = transDeepL(data.text);  // Translated texts(array)
    var text = ""; // post text
    var mentionUser = mentionUser;

    for(i=0; i<texts.length; i++){
        if(mentionUser.length + text.length + texts[i].length > 280){d
            // Request
            var response = JSON.parse(service.fetch(END_POINT_URL, {
            method: 'post',
            payload: {
                status: mentionUser + text,
                in_reply_to_status_id: id
            }
            }));
            id = response.id_str;
            mentionUser = USER_MYSELF;
            text = "";
        }
        text = text + texts[i];
    }

    // Last post
    var response = service.fetch(END_POINT_URL, {
    method: 'post',
        payload: {
            status: mentionUser + text,
            in_reply_to_status_id: id
        }
    });

    Logger.log("succeed.")

    return;
}

function transDeepL(text) {
    /**
     * Translate target text with DeepL
     *
     * args :
     *  text : target text
     *
     * return :
     *  result : translated text
     */

    //Translate from
    var sourceLang = 'JA'; // Translate from
    var targetLang = 'ES'; // Translate to

    var texts = text.split(/\n/);
    var result = [];

    // Multi line support
    for(i=0; i<texts.length; i++){
        let txt = fix_text(texts[i]);

        // Create request URL
        let url = `${DEEPL_API_URL}${DEEPL_API_KEY}&text=${fixedText}&source_lang=${sourceLang}&target_lang=${targetLang}`;

        // Request
        let response =  JSON.parse(UrlFetchApp.fetch(url).getContentText());
        result[result.length] = response.translations[0].text + "\n";
    }

    return result;
}

function fix_text(sourceText){
    /**
     * Modify to only include characters that can be included in the request
     *
     * args :
     *  sourceText : raw text
     *
     * return :
     *  txt : fixed text
     */

    var txt = sourceText;

    txt = txt.replace("\"", "\'");
    txt = txt.replace("#", "");
    txt = txt.replace("|", "｜");
    txt = txt.replace("%", "％");
    txt = txt.replace("\\", "/");
    txt = txt.replace("+", "＋");
    txt = txt.replace("{", "｛");
    txt = txt.replace("}", "｝");
    txt = txt.replace("^", "＾");
    txt = txt.replace("`", "｀");
    txt = txt.replace(" ", "");
    txt = txt.replace("　", "");

    return txt;
}

function getUserTweet(userId) {
    /**
     * Retrieve the user's latest tweets
     *
     * args :
     *  userId : User's specific ID
     *
     * return :
     *  response.data[i] : JSON for tweet's ID, and text
     */

    var url = `https://api.twitter.com/2/users/${userId}/tweets`;
    var options = {
        "method": "get",
        "headers": {
            "authorization": `Bearer ${BAERER_ID}`
        },
    };

    // Request
    var response = JSON.parse(UrlFetchApp.fetch(url, options));

    // Target is only normal tweet and quote tweet
    for(i=0; i<response.data.length; i++){
        if(response.data[i].text[0] == "@"){
            continue;
        }else if(response.data[i].text.substr(0,4) == "RT @"){
            continue;
        }else{
            return response.data[i];
        }
    }
}

function isNotReplyed(tweetId) {
    /**
     * Check to see if you have already made a reply
     *
     * args :
     *  tweetId : Tweet's unique ID(response.data[x].id)
     */

    var url = `https://api.twitter.com/2/tweets/search/recent?query=conversation_id:${tweetId}&tweet.fields=in_reply_to_user_id,author_id,created_at,conversation_id`;
    var options = {
        "method": "get",
        "headers": {
        "authorization": `Bearer ${BAERER_ID}`
    },
};

    // Request
    var response = JSON.parse(UrlFetchApp.fetch(url, options));

        if(response.meta.result_count == 0.0){
       return true; // There are no replys
    }

    for(i=0; i < response.data.length; i++){
        if (response.data[i].author_id == AUTHER_ID){

          return false; // exist
        }
    }

    return true;
}

function main (){
    try{
        var data = getUserTweet(SAKU_ID);
    }catch(e){
        console.error(`【ERROR】 ${e.message}`);
        return;
    }
    console.log(`【RAW TEXT】 ${data.text}`);

    try{
        postTweet(data, USER_SAKU);
    }catch(e){
        console.error(`【ERROR】 ${e.message}`);
        return;
    }
}

// ----------------------------------------------------------------

// ----------
// Not used
// ----------

function authorize() {
    /**
     * Authent cate apps in conjunction
     */

    twitter.authorize();
}

function reset() {
    /**
     * Deauthenticate
     */

    twitter.reset();
}

function authCallback(request) {
    /**
     * Callback after authentication
     */

    return twitter.authCallback(request);
}
