#include <SPI.h>
#include <MFRC522.h>

#include "config.h"
#include "rfid.h"

MFRC522 mfrc522(SS_PIN, RST_PIN);

void initRFID()
{
    SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);

    mfrc522.PCD_Init();

    Serial.println("RC522 Ready");
}

bool cardAvailable()
{
    if (!mfrc522.PICC_IsNewCardPresent())
        return false;

    if (!mfrc522.PICC_ReadCardSerial())
        return false;

    return true;
}

String getCardUID()
{
    String uid = "";

    for (byte i = 0; i < mfrc522.uid.size; i++)
    {
        if (mfrc522.uid.uidByte[i] < 0x10)
            uid += "0";

        uid += String(mfrc522.uid.uidByte[i], HEX);
    }

    uid.toUpperCase();

    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();

    return uid;
}