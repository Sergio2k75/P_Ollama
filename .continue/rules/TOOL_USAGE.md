# Tool Usage Rules

This project is developed on Windows with PowerShell.

## File operations

Prefer Continue file tools over terminal commands.

- To read files, use `read_file` with the exact parameter `filepath`.
- To create new files, use `create_new_file`.
- To modify existing files, use `edit_existing_file`.
- Do not use shell redirection to create or edit files.
- Do not use `cat`, `touch`, `type nul`, `sed`, `awk`, or Linux-only shell patterns.

## PowerShell commands

When terminal commands are necessary, use PowerShell syntax.

Correct examples:

```powershell
Get-ChildItem -Path v2
New-Item -ItemType Directory -Path "v2" -Force
Get-Content -Path "v2/app.py"
```


# Tool calling strictness

When calling tools, you MUST match the tool schema EXACTLY.

- read_file: { "filepath": "relative/or/absolute/path" }
- create_new_file: { "filepath": "...", "contents": "..." }
- edit_existing_file: { "filepath": "...", "changes": "..." }

Never use "filePath". Always use "filepath".
Never invent parameter names.