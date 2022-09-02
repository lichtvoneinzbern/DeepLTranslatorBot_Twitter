# DeepLTranslatorBot_Twitter

## 概要

DeepL APIとGoogle Apps Scriptを使用した自動翻訳Botです。 
対象ユーザーのツイート・引用ツイートに反応して翻訳したリプライを返します。

このREADMEでは最低限の手順のみを記載します。
細かいやり方などはググると情報が出てきます。

以下使用までの簡単な手引きです。


# 使用までの手引き
このソースコードを使用するには、以下の手順が必要です。

## 1. Twitterアカウントを作成し、開発者向けサイトから必要なキーを発行 
- API key 
- API secret key
- Baerer ID
	
開発者向けサイトは[コチラ](https://developer.twitter.com/en)

## 2. 以下のサイトからDeepLアカウントを作成し、API Keyを発行する


[DeepL](https://www.deepl.com/pro-api?cta=header-pro-api)


## 3. Googleアカウントを作成し、GASの開発環境を整える

このリポジトリにあるソースコードを新規プロジェクトを作成してコピペします。

以下2つの必要なライブラリが必要になるので導入。

OAuth1
```
1CXDCY5sqT9ph64fFwSzVtXnbjpSfWdRymafDrtIZ7Z_hwysTY7IIhi7s
```

TwitterWebService
```
1rgo8rXsxi1DxI_5Xgo_t3irTw1Y5cxl2mGSkbozKsSXf2E_KBBPC3xTF
```

先ほど取得したキーを定数に代入します。

```
/** -----------
 * Constants
 ----------- */
//Generate Authorization Instance
const twitter = TwitterWebService.getInstance(
  '',//API Key
  ''//API secret key
);
const END_POINT_URL = 'https://api.twitter.com/1.1/statuses/update.json';
const BAERER_ID = ''; // Baerer ID

〜〜〜省略〜〜〜

// DeepL
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate?auth_key=';
const DEEPL_API_KEY = ''; // DeepL API key
```

Twitter翻訳対象にしたいユーザーのIDとユーザー名を取得し、定数に代入します。

```
// Twitter IDs
const AUTHER_ID = ""; // Bot user's ID
const TARGET_ID = ""; // target user's ID

// Target user name
const USER_MYSELF = ""; // Bot user's name
const USER_TARGET = ""; // Target user's name
```

ここまで設定できたら、**Debug**あるいは**Run**を押下しテスト実行を行ってみてください。
問題がなさそうであれば、Time Triggerを追加、よしなに間隔を設定すると自動化が完了します。


開発者：リヒト
[Twitter](https://twitter.com/EldLicht) 
