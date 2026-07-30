#include "config.h"
#include "uid_map.h"
#include "wifi_manager.h"
#include "rfid.h"
#include "api.h"
#include "indicators.h"

Patient patient;

String getMedicalId(String uid)
{
    for (int i = 0; i < TOTAL_CARDS; i++)
    {
        if (cards[i].uid == uid)
        {
            return cards[i].medicalId;
        }
    }

    return "";
}

void printPatient(Patient patient)
{
    Serial.println();
    Serial.println("==============================");
    Serial.println("PATIENT FOUND");
    Serial.println("==============================");

    Serial.print("Name          : ");
    Serial.println(patient.fullName);

    Serial.print("Medical ID    : ");
    Serial.println(patient.medicalId);

    Serial.print("Blood Group   : ");
    Serial.println(patient.bloodGroup);

    Serial.print("Gender        : ");
    Serial.println(patient.gender);

    Serial.print("DOB           : ");
    Serial.println(patient.dob);

    Serial.print("Allergies     : ");
    Serial.println(patient.allergies);

    Serial.print("Conditions    : ");
    Serial.println(patient.conditions);

    Serial.print("Medications   : ");
    Serial.println(patient.medications);

    Serial.println("==============================");
}

void waitForResetButton()
{
    Serial.println();
    Serial.println("Press Button To Scan Again");

    pinMode(BUTTON, INPUT_PULLUP);

    while (digitalRead(BUTTON) == HIGH)
    {
        delay(20);
    }

    clearIndicators();

    delay(500);
}

void setup()
{
    Serial.begin(115200);

    delay(1000);

    Serial.println();
    Serial.println("===================================");
    Serial.println(" LifeTag ESP32");
    Serial.println("===================================");

    initIndicators();

    connectWiFi();

    initRFID();

    pinMode(BUTTON, INPUT_PULLUP);

    Serial.println();
    Serial.println("System Ready");
    Serial.println("Tap RFID Card...");
}

void loop()
{
    if (!isWiFiConnected())
    {
        connectWiFi();
    }

    if (!cardAvailable())
    {
        delay(100);
        return;
    }

    String uid = getCardUID();

    Serial.println();
    Serial.print("UID : ");
    Serial.println(uid);

    String medicalId = getMedicalId(uid);

    if (medicalId == "")
    {
        Serial.println("Card Not Registered");

        errorSignal();

        waitForResetButton();

        return;
    }

    Serial.print("Medical ID : ");
    Serial.println(medicalId);

    bool success = fetchPatient(medicalId, patient);

    if (!success)
    {
        Serial.println("Patient Fetch Failed");

        errorSignal();

        waitForResetButton();

        return;
    }

    printPatient(patient);

    successSignal();

    waitForResetButton();

    Serial.println();
    Serial.println("Ready For Next Card...");
}