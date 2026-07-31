#include <WiFi.h>
#include "config.h"
#include "wifi_manager.h"

void connectWiFi()
{
    if (WiFi.status() == WL_CONNECTED)
        return;

    WiFi.disconnect(true);
    delay(1000);

    WiFi.mode(WIFI_STA);

    Serial.println();
    Serial.println("Connecting to WiFi...");
    Serial.print("SSID: ");
    Serial.println(WIFI_SSID);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

bool isWiFiConnected()
{
    return WiFi.status() == WL_CONNECTED;
}