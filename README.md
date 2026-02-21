![Banner](https://raw.githubusercontent.com/ktmcp-cli/apisetu/main/banner.svg)

> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# APIsetu Transport CLI

> **⚠️ Unofficial CLI** - Not officially sponsored or affiliated with APIsetu or Kerala Motor Vehicle Department.

A production-ready command-line interface for [APIsetu Transport (Kerala Motor Vehicle Department)](https://apisetu.gov.in/) — verify driving licenses and vehicle registration certificates directly from your terminal.

## Features

- **Driving License Verification** — Verify DL by license number, Aadhaar, name, or DOB
- **Vehicle Registration Verification** — Verify RC by registration number, chassis number, Aadhaar, or owner name
- **Multiple Formats** — Get responses as XML or PDF
- **JSON Output** — All commands support `--json` for scripting
- **Colorized Output** — Clean terminal output with chalk
- **DigiLocker Integration** — Official government data from Kerala MVD

## Installation

```bash
npm install -g @ktmcp-cli/apisetu
```

## Quick Start

```bash
# Get API credentials at https://apisetu.gov.in/
apisetu config set --api-key YOUR_API_KEY --client-id YOUR_CLIENT_ID

# Verify driving license
apisetu dl verify --dlno KL1234567890123

# Verify vehicle registration
apisetu rc verify --reg-no KL01AB1234

# Get PDF certificate
apisetu dl verify --dlno KL1234567890123 --format pdf --json
```

## Commands

### Config

```bash
apisetu config set --api-key <key> --client-id <id>
apisetu config show
```

### Driving License (DL)

```bash
apisetu dl verify --dlno KL1234567890123
apisetu dl verify --uid 123456789012 --name "Full Name" --dob 01-01-1990
apisetu dl verify --dlno KL1234567890123 --format pdf --json
```

**Options:**
- `--dlno <number>` - Driving License Number
- `--uid <aadhaar>` - Aadhaar number
- `--name <fullname>` - Full name
- `--dob <date>` - Date of birth (DD-MM-YYYY)
- `--format <format>` - Response format: `xml` (default) or `pdf`
- `--json` - Output as JSON

### Vehicle Registration (RC)

```bash
apisetu rc verify --reg-no KL01AB1234
apisetu rc verify --chasis-no ABC123XYZ456 --name "Owner Name"
apisetu rc verify --reg-no KL01AB1234 --format pdf --json
```

**Options:**
- `--reg-no <number>` - Vehicle Registration Number
- `--chasis-no <number>` - Chassis Number
- `--uid <aadhaar>` - Aadhaar number
- `--name <fullname>` - Owner full name
- `--format <format>` - Response format: `xml` (default) or `pdf`
- `--json` - Output as JSON

## JSON Output

All commands support `--json` for structured output:

```bash
apisetu dl verify --dlno KL1234567890123 --json | jq '.'
apisetu rc verify --reg-no KL01AB1234 --json | jq '.certificateData'
```

## API Response Formats

### XML Format (Default)
Returns structured certificate data including personal information, issuance details, and document-specific data.

### PDF Format
Returns PDF certificate data. Use with `--json` flag to capture the response.

## Error Handling

The CLI provides clear error messages for common issues:

- **400 Bad Request** - Missing or invalid parameters
- **401 Unauthorized** - Invalid API credentials
- **404 Not Found** - Record not found
- **500 Server Error** - Internal server error
- **502 Bad Gateway** - Publisher service error
- **503 Service Unavailable** - Temporary service outage
- **504 Gateway Timeout** - Service timeout

## Why CLI > MCP?

No server to run. No protocol overhead. Just install and go.

- **Simpler** — Just a binary you call directly
- **Composable** — Pipe to `jq`, `grep`, `awk`
- **Scriptable** — Works in cron jobs, CI/CD, shell scripts

## Use Cases

- Verify vehicle ownership before purchase
- Validate driving license authenticity
- Integrate vehicle verification into applications
- Automate transport document checks
- Build compliance systems

## License

MIT — Part of the [Kill The MCP](https://killthemcp.com) project.


---

## Support KTMCP

If you find this CLI useful, we'd greatly appreciate your support! Share your experience on:
- Reddit
- Twitter/X
- Hacker News

**Incentive:** Users who can demonstrate that their support/advocacy helped advance KTMCP will have their feature requests and issues prioritized.

Just be mindful - these are real accounts and real communities. Authentic mentions and genuine recommendations go a long way!

## Support This Project

If you find this CLI useful, we'd appreciate support across Reddit, Twitter, Hacker News, or Moltbook. Please be mindful - these are real community accounts. Contributors who can demonstrate their support helped advance KTMCP will have their PRs and feature requests prioritized.
