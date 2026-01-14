// Protocol Error Correction Protocol
module.exports = {
  id: 'protocol-error-correction',
  name: 'Protocol Error Correction Protocol',
  version: '1.0.0',
  tier: 1,
  purpose: 'Guide updating protocols when they fail or produce wrong results',
  triggers: [
    'Protocol execution produced wrong result',
    'Protocol was missing a step',
    'Protocol had incorrect information',
    'User corrected AI behavior',
    'Discovered gap in existing protocol'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols/src/protocols/foundation/protocol-error-correction.js',
  content: `# Protocol Error Correction Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: A protocol was followed but produced wrong results
- **WHEN**: User corrects behavior that a protocol should have guided
- **WHEN**: A gap or missing step is discovered in a protocol
- **WHEN**: Protocol contains incorrect or outdated information
- **PRIORITY**: Critical (Tier 1) - Protocols must stay accurate

## Core Principle
"Fail once, fix permanently." When a protocol fails, update it immediately
so the same error doesn't happen again.

---

## IMMUTABLE - Error Correction Process

### Step 1: Identify the Failure
What went wrong?
- Wrong output format?
- Missing step?
- Incorrect assumption?
- Outdated information?
- Unclear instruction?

### Step 2: Determine Root Cause
Why did it fail?
- Protocol didn't cover this case
- Protocol instruction was ambiguous
- Protocol had wrong information
- I didn't follow the protocol correctly

### Step 3: Design the Fix
What should change?
- Add missing step/check
- Clarify ambiguous instruction
- Update incorrect information
- Add to IMMUTABLE section if critical

### Step 4: Make the Edit
- Read the protocol file
- Make the edit directly
- Bump version number (patch for fixes, minor for additions)
- User approves the file change

### Step 5: Verify
- Does the fix address the root cause?
- Could this error happen another way?
- Are there related protocols that need updating?

---

## IMMUTABLE - What to Update

### IMMUTABLE Sections
Add to IMMUTABLE when:
- The rule must ALWAYS be followed
- Violating it causes significant problems
- It's a critical pre-check or validation

### EDITABLE Sections
Keep in EDITABLE when:
- The guidance is helpful but not mandatory
- There are legitimate exceptions
- Details may evolve over time

---

## EDITABLE - Common Error Patterns

### Format Errors
**Example**: Wrote markdown for Medium
**Fix**: Add pre-writing destination check to IMMUTABLE section

### Missing Pre-Checks
**Example**: Started task without verifying prerequisites
**Fix**: Add IMMUTABLE pre-check section

### Assumption Errors
**Example**: Assumed user preference instead of asking
**Fix**: Add explicit "ask user" step

### Sequence Errors
**Example**: Did steps out of order causing failure
**Fix**: Clarify step dependencies or add warnings

### Scope Errors
**Example**: Protocol was too narrow or too broad
**Fix**: Adjust triggers or split/merge protocols

---

## EDITABLE - Version Numbering

When fixing protocols:
- **Patch (0.0.X)**: Typos, clarifications, minor fixes
- **Minor (0.X.0)**: New steps, new sections, significant additions
- **Major (X.0.0)**: Restructure, breaking changes, fundamental shifts

Always update version in THREE places:
1. \`version\` field in module.exports
2. Title in content (\`# Protocol Name vX.X.X\`)
3. Status line at end (\`**Status**: Active - vX.X.X\`)

---

## EDITABLE - No Proposal System Needed

File edits in Claude Code already show for approval.
- DON'T use formal proposal mechanisms
- DO edit the file directly
- DO provide a summary of changes
- User sees diff and approves

The approval mechanism is built into the editing workflow.

---

## After Correction

Once a protocol is fixed:
1. The fix takes effect for future sessions immediately
2. No need to notify other systems
3. Protocol server will serve updated content after restart
4. Consider: Are there related protocols that need similar fixes?

---

## Related Protocols
- active-inference - Reflects on task outcomes
- protocol-writing - Creates new protocols
- protocol-graduation - Promotes protocols to tools

---
**Status**: Active - v1.0.0`
};
