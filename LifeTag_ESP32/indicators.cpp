#include <Arduino.h>
#include "config.h"
#include "indicators.h"

void initIndicators()
{
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(BUZZER, OUTPUT);

    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, LOW);
    digitalWrite(BUZZER, LOW);
}

void successSignal()
{
    digitalWrite(GREEN_LED, HIGH);

    tone(BUZZER, 2000);

    delay(250);

    noTone(BUZZER);

    delay(100);

    digitalWrite(GREEN_LED, LOW);
}

void errorSignal()
{
    digitalWrite(RED_LED, HIGH);

    tone(BUZZER, 800);

    delay(800);

    noTone(BUZZER);

    digitalWrite(RED_LED, LOW);
}

void clearIndicators()
{
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, LOW);
    noTone(BUZZER);
}