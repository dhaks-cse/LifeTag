#include "api.h"
#include "config.h"

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

bool fetchPatient(String medicalId, Patient &patient)
{
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("WiFi Not Connected");
        return false;
    }

    String url = String(API_BASE_URL) + "/api/patients/" + medicalId;

    Serial.println();
    Serial.println("==================================");
    Serial.println("Sending Request");
    Serial.println(url);
    Serial.println("==================================");

    Serial.print("Free Heap : ");
    Serial.println(ESP.getFreeHeap());

    WiFiClientSecure client;
    client.setInsecure();    // Skip SSL certificate verification

    HTTPClient http;

    if (!http.begin(client, url))
    {
        Serial.println("Unable to start HTTP connection");
        return false;
    }

    http.setTimeout(15000);

    int responseCode = http.GET();

    if (responseCode <= 0)
    {
        Serial.print("HTTP Error : ");
        Serial.println(http.errorToString(responseCode));
        http.end();
        return false;
    }

    Serial.print("HTTP Response Code : ");
    Serial.println(responseCode);

    if (responseCode != 200)
    {
        Serial.println(http.getString());
        http.end();
        return false;
    }

    String payload = http.getString();

    Serial.println("Response Received:");
    Serial.println(payload);

    DynamicJsonDocument doc(8192);

    DeserializationError error = deserializeJson(doc, payload);

    if (error)
    {
        Serial.print("JSON Parse Error : ");
        Serial.println(error.c_str());
        http.end();
        return false;
    }

    patient.success = doc["success"];

    if (!patient.success)
    {
        Serial.println("API returned success = false");
        http.end();
        return false;
    }

    JsonObject data = doc["data"];

    patient.fullName = data["fullName"] | "";
    patient.bloodGroup = data["bloodGroup"] | "";
    patient.medicalId = data["medicalId"] | "";
    patient.gender = data["gender"] | "";
    patient.dob = data["dateOfBirth"] | "";

    patient.allergies = "";
    JsonArray allergies = data["allergies"];

    for (JsonVariant item : allergies)
    {
        if (patient.allergies.length() > 0)
            patient.allergies += ", ";

        patient.allergies += item.as<String>();
    }

    patient.conditions = "";
    JsonArray conditions = data["chronicConditions"];

    for (JsonVariant item : conditions)
    {
        if (patient.conditions.length() > 0)
            patient.conditions += ", ";

        patient.conditions += item.as<String>();
    }

    patient.medications = "";
    JsonArray meds = data["currentMedications"];

    for (JsonVariant item : meds)
    {
        if (patient.medications.length() > 0)
            patient.medications += ", ";

        patient.medications += item.as<String>();
    }

    http.end();

    Serial.println();
    Serial.println("Patient Loaded Successfully");
    Serial.println("--------------------------------");
    Serial.print("Name        : ");
    Serial.println(patient.fullName);
    Serial.print("Blood Group : ");
    Serial.println(patient.bloodGroup);
    Serial.print("Gender      : ");
    Serial.println(patient.gender);
    Serial.print("DOB         : ");
    Serial.println(patient.dob);
    Serial.print("Allergies   : ");
    Serial.println(patient.allergies);
    Serial.print("Conditions  : ");
    Serial.println(patient.conditions);
    Serial.print("Medications : ");
    Serial.println(patient.medications);
    Serial.println("--------------------------------");

    return true;
}