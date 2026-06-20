---
name: get-current-time
version: 2.0
author: Claude (Anthropic) — written in collaboration with Mikey Bonsignore
date: 2026-03-22
reason: Original trigger conditions were too narrow (reactive only). This version adds proactive triggers to prevent time-dependent assumptions without checking. Inspired by Mikey pointing out that when someone gives you a wristwatch, you shouldn't keep asking what time it is.
---

# Get Current Time

## Purpose
Get and use the current local time/date so no time-of-day assumption is ever made without checking.

## Trigger Conditions
- **WHEN**: starting a session, or before any statement about time of day, day of week, or how long something has run.
- **WHEN**: before any time-tied suggestion (sleep, bed, break, late, early, morning, night, good morning).
- **Trigger keywords**: time, date, clock, what time, now, today, day, when, hours, minutes, timezone, late, early, morning, night, evening, sleep, bed, break, elapsed, how long.

## User Context

- Mikey is in Hartford, Arkansas
- Central Time Zone (America/Chicago)
- UTC-6 (standard) / UTC-5 (daylight saving)

## Method

Use bash_tool to get current time:

```bash
TZ="America/Chicago" date
```

## When to Check (Proactive — don't wait to be asked)

- At the start of every session (first response)
- Before any statement about time of day
- Before any assumption about what the user is currently doing (sleeping, eating, working, resting)
- Before any suggestion tied to time (go to bed, take a break, it's getting late, good morning, sleep well)
- Before estimating how long something has been running or how long until it finishes
- When more than roughly an hour has passed since the last check
- When time is explicitly mentioned in conversation

## Never

- Assume it's still the same time of day as when the conversation started
- Assume the user's location or activity based on earlier context
- Say "sleep well," "good morning," or similar without checking first
- Ask the user what time it is — you have a wristwatch, use it

## Why This Version Exists

The original skill only fired reactively when time was mentioned. This caused repeated errors:
- Telling the user to sleep well when they had just woken up
- Asking what time it was repeatedly instead of checking
- Assuming the user was in their chair when they were in bed
- Losing track of the day entirely across a long conversation (Friday night became Saturday morning without noticing)

The fix is proactive triggers — check before making any time-dependent statement, not just when time is mentioned.

## What Not To Do

Don't just check the time when asked. Check it before you need it.
Don't ask the user what time it is. That's what the tool is for.
Don't assume a long conversation is still happening at the same time of day it started.
