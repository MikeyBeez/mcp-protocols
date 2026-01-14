// Create Project Protocol - Automated project creation workflow
module.exports = {
  id: 'create-project',
  name: 'Create Project Protocol',
  version: '1.0.0',
  tier: 3,  // Task-specific protocol
  purpose: 'Guide the creation of new software projects with proper structure, version control, and GitHub integration',
  triggers: [
    'User says "create a new project"',
    'User says "set up a new repo"',
    'User says "start a new project"',
    'User wants to begin a new codebase',
    'User says "make me a project called..."',
    'User wants to scaffold a new application'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols',
  implementedBy: 'mikey_create_project',  // Points to the tool
  content: `# Create Project Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: User requests a new project, repository, or codebase
- **WHEN**: User wants to scaffold a new application
- **KEYWORDS**: "create project", "new project", "set up repo", "start a new", "scaffold"
- **PRIORITY**: Standard (Tier 3 - Task Specific)

## Core Principle
"Ask before assuming" - Gather user preferences through conversation before invoking the tool.

## IMPORTANT: Tool Implementation

This protocol is implemented by the \`mikey_create_project\` tool.
The protocol describes WHAT to do; the tool executes HOW to do it.

**DO NOT** manually execute project creation steps.
**DO** use the tool after gathering required information.

---

## IMMUTABLE - Prerequisite Verification

### Before Any Project Creation
Verify these prerequisites are met:

1. **Git installed**: \`git --version\` must succeed
2. **GitHub CLI installed**: \`gh --version\` must succeed
3. **GitHub authenticated**: \`gh auth status\` must succeed
4. **Projects directory exists**: Default is ~/Code

If any prerequisite fails, guide the user to install/configure before proceeding.

### SSH vs HTTPS
- SSH is recommended for security and convenience
- Check for SSH keys: ~/.ssh/id_ed25519.pub or ~/.ssh/id_rsa.pub
- If no SSH keys, either:
  - Guide user to set up SSH keys, OR
  - Proceed with HTTPS (less secure, requires credential storage)

---

## IMMUTABLE - Information Gathering

### Required Information (Must Ask)
1. **Project Name**: What should the project be called?
   - Validate: lowercase, hyphens allowed, no spaces
   - Check: Does directory already exist? Does GitHub repo exist?

2. **Project Type**: What kind of project is this?
   - Options: mcp-tool, web-app, cli-tool, library, api, general
   - This determines the project structure and templates

### Optional Information (Ask If Not Specified)
3. **Visibility**: Should this be public or private?
   - Default: public

4. **License**: What license should be used?
   - Options: MIT (default), Apache-2.0, GPL-3.0, ISC, None
   - Briefly explain implications if user is unsure

5. **Description**: Brief description of the project
   - Used in README and GitHub repo description

6. **Language**: Primary programming language
   - Options: typescript (default), javascript
   - Note: Python/Rust/Go support coming in future versions

7. **Features**: Additional configuration
   - Testing (default: yes)
   - Linting (default: yes)
   - Docker (default: no)
   - CI/CD (default: yes)
   - VSCode config (default: yes)

---

## EDITABLE - Conversation Flow

### Example Interaction Pattern

\`\`\`
User: I want to create a new MCP tool

You: I'll help you create a new MCP tool project. I have a few questions:

1. What would you like to name the project?
   (Use lowercase with hyphens, e.g., "my-cool-tool")

2. Should this be a public or private repository?
   (Default: public)

3. Any specific description for the project?

User: Call it bookmark-manager, public, it manages browser bookmarks

You: Got it! I'll create "bookmark-manager" as a public MCP tool.

- Name: bookmark-manager
- Type: mcp-tool
- Visibility: public
- License: MIT (default)
- Description: "Manages browser bookmarks"

Creating your project...

[Invoke mikey_create_project with parameters]
\`\`\`

---

## EDITABLE - Tool Invocation

### Calling the Tool

After gathering information, invoke:

\`\`\`
mikey_create_project({
  projectName: "<gathered-name>",
  projectType: "<gathered-type>",
  description: "<gathered-description>",
  visibility: "<public|private>",
  license: "<gathered-license>",
  language: "<typescript|javascript>",
  features: {
    testing: true,
    linting: true,
    docker: false,
    cicd: true,
    vscode: true
  }
})
\`\`\`

### After Tool Execution

1. **Verify Success**: Check the tool's response for success/failure
2. **Report to User**: Provide the created paths and URLs
3. **Next Steps**: Suggest what to do next:
   - cd into the project
   - Open in editor
   - Start implementing
4. **CRITICAL - Update Architecture**: Run architecture-update protocol!
   - Update Master Architecture Index if significant project
   - Update system-paths in mcp-architecture if new MCP tool
   - Update mcp-tools-registry if adding tools
   - See: \`mikey_protocol_read architecture-update\`

---

## EDITABLE - Error Handling

### Common Issues

| Error | Cause | Resolution |
|-------|-------|------------|
| "Directory exists" | Project folder already present | Ask for different name or confirm overwrite |
| "GitHub repo exists" | Repo with same name on GitHub | Use different name or connect to existing |
| "Not authenticated" | gh auth not set up | Guide through \`gh auth login\` |
| "Permission denied" | SSH key or token issue | Debug authentication setup |
| "Command not found" | Missing git or gh | Install required tools |

### Recovery Steps
1. Identify the specific error from tool output
2. Apply the appropriate resolution
3. Re-invoke the tool if error is resolved
4. Escalate to user if manual intervention needed

---

## Integration Notes

### Related Protocols
- **architecture-update**: ALWAYS triggered after project creation - update docs!
- **naming-linter**: Applies when creating MCP tools (ensure mikey_ prefix)
- **progress-communication**: Use for long-running creation processes
- **active-inference**: Reflect after completion to improve the protocol

### Graduation History
This protocol graduated to a tool because:
- High frequency: Projects created weekly
- Consistent steps: Same workflow every time
- Automation value: 15+ manual steps reduced to one tool call
- Error prone manually: Easy to forget steps or make typos

### Future Enhancements
- Python project support (pyproject.toml, uv)
- Rust project support (Cargo.toml)
- Monorepo scaffolding
- Template customization
- Team/organization defaults

---

## Quick Reference

**Trigger**: "create/new/start project"
**Tool**: mikey_create_project
**Required**: projectName, projectType
**Defaults**: public, MIT, typescript, testing+linting+cicd

---
**Status**: Active - v1.0.0
**Implemented By**: mikey_create_project tool`
};
