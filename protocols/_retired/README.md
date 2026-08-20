# Retired protocols

Retired 2026-08-19 during step 2 of PROTOCOL_SYSTEM_PLAN.md — deciding the
protocol/skill boundary. Files kept, removed from the matcher (triggers.json).

## decision-box

CONTRADICTS a current standing preference. Its 2026-06-23 origin was Mikey saying "put up one of those decision boxes". He has since reversed that: selection menus truncate the response and he cannot scroll back to read it. The protocol was teaching every future session to do the banned thing. Superseded, not merged.

## reflect

Genuine duplicate of the reflect SKILL (~/.claude/skills/reflect/). Same six steps, same section names, same signal/confidence model. The skill has MORE (auto-reflect mode, section targeting) and auto-loads its content, which the protocol only does on a high-confidence match. Skill wins; skill updated to also target protocol files.

## get-current-time

Superseded by a merged SKILL. NOTE the merge direction: the PROTOCOL (v2.0) was the better version - it uses `TZ=America/Chicago date` where the skill used a web_fetch to time.is, and it added proactive triggers the skill lacked. The skill was the stale copy. Merged content delivered to Mikey as a SKILL.md to save; also absorbs the separate time-aware-recommendations skill, which was a third copy of the same idea.

