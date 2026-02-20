import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, setConfig, isConfigured } from './config.js';
import { verifyDrivingLicense, verifyVehicleRegistration } from './api.js';

const program = new Command();

// ============================================================
// Helpers
// ============================================================

function printSuccess(message) {
  console.log(chalk.green('✓') + ' ' + message);
}

function printError(message) {
  console.error(chalk.red('✗') + ' ' + message);
}

function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

async function withSpinner(message, fn) {
  const spinner = ora(message).start();
  try {
    const result = await fn();
    spinner.stop();
    return result;
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

function requireAuth() {
  if (!isConfigured()) {
    printError('API credentials not configured.');
    console.log('\nRun the following to configure:');
    console.log(chalk.cyan('  apisetu config set --api-key YOUR_API_KEY --client-id YOUR_CLIENT_ID'));
    console.log('\nGet credentials at: https://apisetu.gov.in/');
    process.exit(1);
  }
}

// ============================================================
// Program metadata
// ============================================================

program
  .name('apisetu')
  .description(chalk.bold('APIsetu Transport CLI') + ' - Kerala Motor Vehicle Department from your terminal')
  .version('1.0.0');

// ============================================================
// CONFIG
// ============================================================

const configCmd = program.command('config').description('Manage CLI configuration');

configCmd
  .command('set')
  .description('Set configuration values')
  .option('--api-key <key>', 'APIsetu API key')
  .option('--client-id <id>', 'APIsetu Client ID')
  .action((options) => {
    let updated = false;

    if (options.apiKey) {
      setConfig('apiKey', options.apiKey);
      printSuccess('API key set');
      updated = true;
    }

    if (options.clientId) {
      setConfig('clientId', options.clientId);
      printSuccess('Client ID set');
      updated = true;
    }

    if (!updated) {
      printError('No options provided. Use --api-key and/or --client-id');
    }
  });

configCmd
  .command('show')
  .description('Show current configuration')
  .action(() => {
    const apiKey = getConfig('apiKey');
    const clientId = getConfig('clientId');

    console.log(chalk.bold('\nAPIsetu CLI Configuration\n'));
    console.log('API Key:   ', apiKey ? chalk.green(apiKey.substring(0, 6) + '...' + apiKey.slice(-4)) : chalk.red('not set'));
    console.log('Client ID: ', clientId ? chalk.green(clientId.substring(0, 6) + '...' + clientId.slice(-4)) : chalk.red('not set'));
    console.log('');
  });

// ============================================================
// DRIVING LICENSE
// ============================================================

const dlCmd = program.command('dl').description('Driving License verification');

dlCmd
  .command('verify')
  .description('Verify driving license')
  .option('--dlno <number>', 'Driving License Number')
  .option('--uid <aadhaar>', 'Aadhaar number')
  .option('--name <fullname>', 'Full name')
  .option('--dob <date>', 'Date of birth (DD-MM-YYYY)')
  .option('--format <format>', 'Response format (xml or pdf)', 'xml')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    requireAuth();

    if (!options.dlno && !options.uid && !options.name && !options.dob) {
      printError('At least one parameter required: --dlno, --uid, --name, or --dob');
      process.exit(1);
    }

    try {
      const params = {
        format: options.format
      };

      if (options.dlno) params.dlno = options.dlno;
      if (options.uid) params.UID = options.uid;
      if (options.name) params.FullName = options.name;
      if (options.dob) params.DOB = options.dob;

      const data = await withSpinner('Verifying driving license...', () =>
        verifyDrivingLicense(params)
      );

      if (options.json) {
        printJson(data);
        return;
      }

      console.log(chalk.bold('\nDriving License Verification\n'));

      if (options.format === 'pdf') {
        console.log(chalk.yellow('PDF response received. Use --json to see raw data.'));
      } else {
        console.log(chalk.dim('Use --format pdf to get PDF certificate'));
        console.log('');
        printJson(data);
      }

      console.log('');
      printSuccess('Verification complete');
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

// ============================================================
// VEHICLE REGISTRATION
// ============================================================

const rcCmd = program.command('rc').description('Vehicle Registration Certificate verification');

rcCmd
  .command('verify')
  .description('Verify vehicle registration')
  .option('--reg-no <number>', 'Vehicle Registration Number')
  .option('--chasis-no <number>', 'Chassis Number')
  .option('--uid <aadhaar>', 'Aadhaar number')
  .option('--name <fullname>', 'Owner full name')
  .option('--format <format>', 'Response format (xml or pdf)', 'xml')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    requireAuth();

    if (!options.regNo && !options.chasisNo && !options.uid && !options.name) {
      printError('At least one parameter required: --reg-no, --chasis-no, --uid, or --name');
      process.exit(1);
    }

    try {
      const params = {
        format: options.format
      };

      if (options.regNo) params.reg_no = options.regNo;
      if (options.chasisNo) params.chasis_no = options.chasisNo;
      if (options.uid) params.UID = options.uid;
      if (options.name) params.FullName = options.name;

      const data = await withSpinner('Verifying vehicle registration...', () =>
        verifyVehicleRegistration(params)
      );

      if (options.json) {
        printJson(data);
        return;
      }

      console.log(chalk.bold('\nVehicle Registration Verification\n'));

      if (options.format === 'pdf') {
        console.log(chalk.yellow('PDF response received. Use --json to see raw data.'));
      } else {
        console.log(chalk.dim('Use --format pdf to get PDF certificate'));
        console.log('');
        printJson(data);
      }

      console.log('');
      printSuccess('Verification complete');
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

// ============================================================
// Parse
// ============================================================

program.parse(process.argv);

if (process.argv.length <= 2) {
  program.help();
}
