// Document Writing Protocol - General writing workflow
module.exports = {
  id: 'document-writing',
  name: 'Document Writing Protocol',
  version: '1.0.0',
  tier: 2,
  purpose: 'Guide creation of documents, papers, and articles with proper planning',
  triggers: [
    'User asks to write a document or paper',
    'Creating technical documentation',
    'Writing explanatory content',
    'Drafting any substantial text',
    'User says "write", "draft", "document"'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols/src/protocols/foundation/document-writing.js',
  content: `# Document Writing Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: User asks to write a document, paper, or article
- **WHEN**: Creating technical documentation
- **WHEN**: Drafting substantial explanatory content
- **WHEN**: User says "write", "draft", "document", "paper"
- **PRIORITY**: Foundation (Tier 2)

## Core Principle
"Ask before assuming." Clarify destination and format before writing.

---

## IMMUTABLE - Pre-Writing Check

BEFORE writing ANY document, you MUST ask:

1. **Publication destination**: "Where will this be published?"
   - Medium/blog → Use plain text (see medium-article protocol)
   - GitHub/README → Markdown is fine
   - Internal docs → Markdown is fine
   - Academic/formal → Check specific requirements
   - Unclear → Ask before proceeding

2. **Audience**: "Who is the target reader?"
   - Technical experts → Can use jargon, assume knowledge
   - General audience → Explain concepts, avoid jargon
   - Mixed → Layer information (summary first, details later)

3. **Length expectations**: "How long should this be?"
   - Quick overview → 500-800 words
   - Standard article → 1000-1500 words
   - Deep dive → 2000-3000 words
   - Comprehensive → 3000+ words

---

## IMMUTABLE - Output Format Rules

Based on destination:

| Destination | Format | Syntax |
|-------------|--------|--------|
| Medium | Plain text | No markdown, headers as lines |
| Blog platforms | Plain text | Usually WYSIWYG |
| GitHub | Markdown | Full markdown syntax |
| README files | Markdown | Full markdown syntax |
| Technical docs | Markdown | Full markdown syntax |
| Obsidian | Markdown | Full markdown + wiki links |
| Academic | LaTeX or Word | Platform-specific |

---

## EDITABLE - Writing Process

### Step 1: Clarify Requirements
- Ask the three pre-writing questions
- Confirm understanding before proceeding
- Note any specific constraints

### Step 2: Create Outline
Structure the document:
- Title/headline
- Introduction/hook
- Main sections (3-5 typically)
- Conclusion/call to action

### Step 3: Write First Draft
- Follow the outline
- Don't over-edit while drafting
- Get ideas down first

### Step 4: Refine
- Check flow between sections
- Ensure consistent tone
- Verify technical accuracy
- Remove redundancy

### Step 5: Format for Destination
- Apply appropriate formatting
- If Medium: strip all markdown
- If GitHub: ensure proper syntax
- Add any required metadata

---

## EDITABLE - Document Types

### Technical Documentation
- Focus on accuracy and completeness
- Include code examples where relevant
- Structure for scanning (headers, lists)
- Link to related resources

### Explanatory Articles
- Start with the "why"
- Build from simple to complex
- Use analogies for difficult concepts
- End with practical takeaways

### Case Studies
- Context: What was the situation?
- Challenge: What problem needed solving?
- Solution: What was done?
- Results: What happened?
- Lessons: What was learned?

### Tutorials
- Clear prerequisites
- Step-by-step instructions
- Expected outcomes at each step
- Troubleshooting common issues

---

## Specialized Protocols

For specific destinations, defer to specialized protocols:
- **Medium articles**: Use medium-article protocol
- **Protocol documentation**: Use protocol-writing protocol
- **Architecture docs**: Use architecture-update protocol

---

## Anti-Patterns

1. **Writing before clarifying** - Always ask destination first
2. **Wrong format for platform** - Markdown on Medium shows as literal text
3. **Assuming audience** - Different readers need different approaches
4. **Skipping outline** - Structure prevents rambling
5. **Over-editing while drafting** - Separate creation from refinement

---

## Related Protocols
- medium-article - Specialized for Medium platform
- protocol-writing - For creating protocols
- user-communication - For tone and clarity

---
**Status**: Active - v1.0.0`
};
