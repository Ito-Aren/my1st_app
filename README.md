フロントエンドとバックエンドのサーバーは別々で立ち上げます。 my1st_app直下で以下のコマンドで立ち上げをしてください。

バックエンド
py -m uvicorn main:app --reload

フロントエンド
npm start
