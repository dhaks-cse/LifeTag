#ifndef API_H
#define API_H

#include <Arduino.h>

struct Patient
{
    bool success;

    String fullName;
    String bloodGroup;
    String medicalId;
    String gender;
    String dob;

    String allergies;
    String conditions;
    String medications;
};

bool fetchPatient(String medicalId, Patient &patient);

#endif