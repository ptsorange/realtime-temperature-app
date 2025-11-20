# Realtime Temperature App

ESP32 (DHT11センサー) で取得した温度・湿度データを、Node.jsサーバー経由でNext.jsフロントエンドにリアルタイム表示するアプリケーションです。

## ディレクトリ構成

- `client/`: Next.js フロントエンドアプリケーション
- `server/`: Node.js バックエンドサーバー (Express + Socket.IO)
- `ESP32/`: ESP32 ファームウェア (PlatformIO プロジェクト)

## セットアップ手順

### 1. ESP32 (ファームウェア)

**⚠️ 重要: WiFi設定の変更が必要です ⚠️**

ESP32をWiFiに接続するために、ソースコード内のSSIDとパスワードをあなたの環境に合わせて変更する必要があります。

1. `ESP32/src/main.cpp` を開きます。
2. 以下の行を探し、あなたのWiFiのSSIDとパスワードに書き換えてください。

```cpp
const char *ssid = "Your-WiFi-SSID";      // ここをあなたのSSIDに変更
const char *password = "Your-WiFi-PASSWORD"; // ここをあなたのパスワードに変更
```

3. また、`serverName` のIPアドレスも、Node.jsサーバーを実行するPCのローカルIPアドレスに変更してください。

```cpp
// 例: PCのIPアドレスが 192.168.1.10 の場合
const char *serverName = "http://192.168.1.10:4000";
```

4. PlatformIOを使用して、ESP32にファームウェアをビルド・書き込みを行ってください。

### 2. Server (バックエンド)

Node.jsサーバーを起動します。

```bash
cd server
npm install
node server.js
```

サーバーはポート `4000` で起動します。

**設定の変更:**
保持するデータの最大数を変更したい場合は、`server/server.js` 内の `maxDataData` 変数の値を変更してください。

```javascript
const maxDataData = 200; // 保持するデータ数を変更
```

### 3. Client (フロントエンド)

Next.jsアプリケーションを起動します。

```bash
cd client
npm install
npm run dev
```

アプリケーションは `http://localhost:3000` で起動します。

## 実行方法

1. ServerとClientを起動します。
2. ESP32に電源を入れ、WiFiに接続されるのを待ちます（シリアルモニタで確認できます）。
3. ブラウザで `http://localhost:3000` にアクセスすると、リアルタイムの温度・湿度グラフが表示されます。