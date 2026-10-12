# Rooted iPhone web-app prototype v2

A free, local-first Progressive Web App prototype for iPhone 14. `plan.json` has 365 dated assignments from 2026-10-13 to 2027-10-12 with 1,189 total chapter references, each assigned exactly once. It uses broad book-level themes and a noncanonical shuffled order; the thematic connections require editorial review. It does **not** include the World English Bible text yet.

Features: today's chapters, checkbox completion by chapter, progress, editable local journal associated with the day's references, JSON export backup, and offline caching after initial loading. Journal data is in browser localStorage only, **not synced**, encrypted, or backed up automatically. Avoid sensitive journal entries until secure cloud storage is implemented.

**Not yet built:** real iPhone push notifications, randomized six-times-a-day scheduling, secure user accounts/cloud journal sync, production hosting, complete WEB Bible text, and notification reliability. A PWA alone cannot guarantee six background alerts; a hosted push service and notification permissions are required. Free tiers may change and cannot guarantee availability.

To run on Mac: `python3 -m http.server 8000` from this directory and open http://localhost:8000. To install on iPhone, host the directory on HTTPS, open in Safari, then Share > Add to Home Screen. This zip is source code, not an installable iPhone app by itself.
