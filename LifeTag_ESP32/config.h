#ifndef CONFIG_H
#define CONFIG_H

// ==========================
// WiFi
// ==========================
#define WIFI_SSID       "Hermione"
#define WIFI_PASSWORD   "        "

// ==========================
// Backend
// ==========================
#define API_BASE_URL "https://lifetag-nm6r.onrender.com"

// ==========================
// RC522
// ==========================
#define SS_PIN      5
#define RST_PIN     22

#define SCK_PIN     18
#define MOSI_PIN    23
#define MISO_PIN    19

// ==========================
// Outputs
// ==========================
#define GREEN_LED   26
#define RED_LED     27
#define BUZZER      25
#define BUTTON      14

#endif