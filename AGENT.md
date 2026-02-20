# AGENT.md — APIsetu Transport CLI for AI Agents

This document explains how to use the APIsetu Transport CLI as an AI agent.

## Overview

The `apisetu` CLI provides access to Kerala Motor Vehicle Department data via APIsetu. Use it for verifying driving licenses and vehicle registration certificates.

## Prerequisites

```bash
apisetu config set --api-key <key> --client-id <id>
```

## All Commands

### Config

```bash
apisetu config set --api-key <key> --client-id <id>
apisetu config show
```

### Driving License Verification

```bash
# Verify by DL number
apisetu dl verify --dlno KL1234567890123

# Verify by multiple parameters
apisetu dl verify --uid 123456789012 --name "Full Name" --dob 01-01-1990

# Get PDF certificate
apisetu dl verify --dlno KL1234567890123 --format pdf --json

# XML format (default)
apisetu dl verify --dlno KL1234567890123 --json
```

**Available options:**
- `--dlno <number>` - Driving License Number
- `--uid <aadhaar>` - Aadhaar number (12 digits)
- `--name <fullname>` - Full name of license holder
- `--dob <date>` - Date of birth in DD-MM-YYYY format
- `--format <format>` - Response format: `xml` (default) or `pdf`
- `--json` - Output as JSON

### Vehicle Registration Verification

```bash
# Verify by registration number
apisetu rc verify --reg-no KL01AB1234

# Verify by chassis number
apisetu rc verify --chasis-no ABC123XYZ456

# Verify by owner details
apisetu rc verify --reg-no KL01AB1234 --name "Owner Name"

# Get PDF certificate
apisetu rc verify --reg-no KL01AB1234 --format pdf --json

# XML format (default)
apisetu rc verify --reg-no KL01AB1234 --json
```

**Available options:**
- `--reg-no <number>` - Vehicle Registration Number
- `--chasis-no <number>` - Chassis Number
- `--uid <aadhaar>` - Aadhaar number (12 digits)
- `--name <fullname>` - Owner full name
- `--format <format>` - Response format: `xml` (default) or `pdf`
- `--json` - Output as JSON

## Tips for Agents

1. Always use `--json` when parsing results programmatically
2. At least one parameter is required for verification commands
3. Use `--format pdf` with `--json` to get PDF certificate data
4. XML format provides structured certificate data (default)
5. Check exit codes: 0 = success, 1 = error
6. Error messages include specific HTTP status codes and descriptions

## Common Workflows

### Verify Driving License
```bash
# Simple verification
apisetu dl verify --dlno KL1234567890123 --json

# With date of birth validation
apisetu dl verify --dlno KL1234567890123 --dob 01-01-1990 --json
```

### Verify Vehicle Registration
```bash
# Simple verification
apisetu rc verify --reg-no KL01AB1234 --json

# With owner name validation
apisetu rc verify --reg-no KL01AB1234 --name "Owner Name" --json
```

### Get PDF Certificate
```bash
# Driving License PDF
apisetu dl verify --dlno KL1234567890123 --format pdf --json > dl.json

# Vehicle Registration PDF
apisetu rc verify --reg-no KL01AB1234 --format pdf --json > rc.json
```

## Authentication

Both API key and Client ID are required. Set them using:

```bash
apisetu config set --api-key YOUR_KEY --client-id YOUR_CLIENT_ID
```

Credentials are stored securely in your system's config directory.

## Data Sources

All data comes from:
- Kerala Motor Vehicle Department
- DigiLocker integration
- Official government records
