#ifndef UID_MAP_H
#define UID_MAP_H

struct UIDMap
{
    String uid;
    String medicalId;
};

UIDMap cards[] =
{
    {"8358EDE1", "LT-2026-0001"},

    {"998FF604", "LT-2026-0002"},

    {"DF86C7C4", "LT-2026-0003"}
};

const int TOTAL_CARDS = sizeof(cards) / sizeof(cards[0]);

#endif