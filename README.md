# riotjs-webpack-template
## 概要
 [Riot.js](http://riotjs.com/)を使うために必要なモジュールやコマンドを用意してあります。鋭意作成中。

## 必要な環境
- node
- gulp

## デフォルトの環境
- CSS
  - SCSS
  - [Semantic UI](https://semantic-ui.com/)
- ES2015
- AWSのS3にホスティング

## コマンド
- `$ gulp build [--env prod]`
  - envで指定した環境用にコードをビルドします
- `$ gulp deploy [--env prod]`
  - - envで指定した環境用にコードをビルドし、指定した環境にデプロイします

## config
root/config/[env].jsonに環境変数を記述できます。
