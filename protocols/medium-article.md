# Medium Article Writing Protocol

## Metadata
- **ID**: medium-article
- **Version**: 2.0.0
- **Tier**: 3 (Specialized)
- **Status**: active
- **Purpose**: When Mikey asks for a paper/article/post, it is going on Medium — so write PLAIN TEXT, never Markdown. Medium's editor is WYSIWYG: `##`, `**bold**`, `[links](url)`, tables, and LaTeX render as literal characters, not formatting. Getting the format wrong means a full rewrite before he can publish.
- **Created**: 2026-06-23 (ported from the legacy `src/protocols/foundation/medium-article.js`, v1.3.0; trimmed generic writing-craft filler, kept the Medium-specific format rules and the diagram/table workflows).
- **Source**: Mikey's standing rule — "When I ask you to write a paper, it will go on medium.com. That means do not use tables or markup, language or latex." Confirmed in practice by the 2026-06-21 "Memento Machine" article (plain prose, no tables/markup/latex).

## Purpose
Produce Medium-ready drafts in plain text, and know the exact workarounds for the things Medium can't do (tables, math, Mermaid diagrams) so a draft never has to be reformatted by hand. The format constraint is the load-bearing part; the writing-craft advice is secondary.

## Core Principle

**Medium is WYSIWYG, not Markdown. Write plain text; let the editor do the formatting.**

Headers are just standalone lines. Emphasis is described, not marked up. The moment a draft contains `##`, `**`, a pipe table, or `$...$`, it's wrong for Medium.

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: Mikey asks to write a paper, article, blog post, essay, or "write something up" — default assumption is Medium unless he says otherwise.
- **WHEN**: he mentions Medium, publishing, or a post for an external audience.
- **WHEN**: drafting technical content meant to be published (not internal docs/GitHub).
- **Trigger keywords**: medium, article, blog, blog post, paper, essay, post, publish, publication, write up, write-up, story, draft for medium, medium.com, plain text, no markdown.

## IMMUTABLE — The Format Rule
Before writing a paper/article, confirm the destination:
- **Medium / blog / publication** → PLAIN TEXT ONLY. Headers as standalone lines. No Markdown syntax. Mikey formats in the editor.
- **GitHub / internal docs** → Markdown is fine.
- **Unclear** → assume Medium (his default), or ask.

**Medium SUPPORTS** (via the editor, not via syntax): bold, italic, links, strikethrough; title + subtitle (first two lines); section headers and subheaders; bulleted and numbered lists (one level); block quotes and pull quotes; inline code and syntax-highlighted code blocks; images (JPG/PNG/GIF ≤25MB); Embedly embeds (YouTube, Vimeo, GitHub Gists, tweets); horizontal dividers (`---` then enter); `@mentions`; superscript for numbers (`6^7`); `:emoji:`.

**Medium does NOT support** (do not put these in a draft): Markdown syntax (`##`, `**bold**`, `[text](url)`); tables; LaTeX or math notation; custom HTML; footnotes; nested lists beyond one level; iframe embeds outside Embedly.

## Workarounds for the unsupported

### Tables → never a Markdown table. Use one of:
1. **Image** — build the table elsewhere, screenshot, upload. Simple; not searchable.
2. **GitHub Gist** — text table in a Gist, paste the URL (Embedly renders it). Searchable, updatable.
3. **Datawrapper** (datawrapper.de) — embed via URL. Interactive, professional.
4. **Bulleted list** — convert the table to a structured list. Native, less visual.

### Diagrams → Mermaid converted to PNG
Medium can't render Mermaid, so export to an image:
```bash
# 1. write the diagram to diagram.mmd, e.g.:
#    flowchart LR
#      A[Write] --> B[Export PNG] --> C[Upload to Medium]
# 2. convert (install once: npm install -g @mermaid-js/mermaid-cli)
mmdc -i diagram.mmd -o diagram.png
mmdc -i diagram.mmd -o diagram.png -t dark          # dark theme
mmdc -i diagram.mmd -o diagram.png -b transparent   # transparent bg
mmdc -i diagram.mmd -o diagram.png --width 800       # set width
```
In drafts, leave a placeholder where the image goes: `[DIAGRAM: auth flow — file auth-flow.mmd]`, then generate the PNG and insert.

### Math → no LaTeX. Render the expression to an image, or rephrase it in words/inline code.

## Writing notes (secondary — craft, not constraint)
- Headline 6–12 words; promise specific value, not clickbait.
- Hook in the first 2–3 sentences (problem, question, surprising fact, or short story).
- One idea per paragraph; paragraphs 1–4 sentences (Medium readers skim); subheader every ~300–500 words.
- Close with a takeaway, question, or next step — the reader should know what to do.
- Length: quick tip 500–800w; tutorial 1,000–1,500w; deep dive 1,500–2,500w; comprehensive 2,500–4,000w.

## Anti-Patterns to Avoid
- 🚫 **Markdown in a Medium draft** — `##`, `**bold**`, `[links](url)`. Renders as literal characters.
- 🚫 **A pipe table** — unsupported; use an image/Gist/Datawrapper/list instead.
- 🚫 **LaTeX / `$...$` math** — unsupported; image or words.
- 🚫 **Writing first, asking destination later** — wrong format means a full rewrite.
- 🚫 **Wall of text** — long paragraphs; break them up.

## Quality Checks
- ✅ Is the draft plain text with NO Markdown syntax?
- ✅ Zero tables, zero LaTeX, no nested lists beyond one level?
- ✅ Are diagrams referenced as PNG images (Mermaid converted), not inline code blocks?
- ✅ Headline 6–12 words, hook in the first lines, subheaders spaced through the body?

---

**Remember**: the one rule that costs a rewrite if missed — Medium is plain text. Everything Markdown does, Medium does in the editor or via an image.

**Status**: Active — Specialized Protocol

## Related Protocols
[[continuous-documentation]]
