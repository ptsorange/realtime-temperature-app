#include <Arduino.h>
#include <DHT.h>
#include <HTTPClient.h>
#include <WiFi.h>

// DHTセンサーの初期化
#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// WiFi設定
const char *ssid = "Your-WiFi-SSID";
const char *password = "Your-WiFi-PASSWORD";

// サーバーURL
const char *serverName = "http://192.168.11.7:4000";

void setup() {
  Serial.begin(115200);
  delay(1000);
  // DHTセンサーを初期化
  dht.begin();
  Serial.println("DHT11 ready");
  // WiFiに接続
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // DHT11から温度と湿度を取得
  float h = NAN, t = NAN;
  for (int i = 0; i < 3; ++i) {
    h = dht.readHumidity();
    t = dht.readTemperature();
    if (!isnan(h) && !isnan(t))
      break;
    delay(500);
  }

  // 結果をシリアルモニタに表示
  if (isnan(h) || isnan(t)) {
    Serial.println(
        "Read failed — check wiring, pull-up resistor, and pin number.");
  } else {
    Serial.printf("Temp: %.1f °C  |  Humidity: %.1f %%\n", t, h);
  }

  // データをサーバーに送信
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverName) + "/sendData");
    http.addHeader("Content-Type", "application/json");
    String payload = "{\"temperature\":" + String(t, 1) +
                     ",\"humidity\":" + String(h, 1) + "}";
    int httpResponseCode = http.POST(payload);
    String response = http.getString();
    Serial.printf("HTTP Response code: %d\n", httpResponseCode);
    Serial.println("Server response: " + response);
    http.end();
  }

  delay(5000);
}