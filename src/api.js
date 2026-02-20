import axios from 'axios';
import { getConfig } from './config.js';
import { randomUUID } from 'crypto';

const BASE_URL = 'https://apisetu.gov.in/transportkl/v3';

function getHeaders() {
  const apiKey = getConfig('apiKey');
  const clientId = getConfig('clientId');

  if (!apiKey || !clientId) {
    throw new Error('API credentials not configured. Run: apisetu config set --api-key YOUR_KEY --client-id YOUR_CLIENT_ID');
  }

  return {
    'X-APISETU-APIKEY': apiKey,
    'X-APISETU-CLIENTID': clientId,
    'Content-Type': 'application/json'
  };
}

async function request(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: getHeaders()
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;

      switch (status) {
        case 400:
          throw new Error(`Bad Request: ${message}`);
        case 401:
          throw new Error(`Unauthorized: Invalid API credentials`);
        case 404:
          throw new Error(`Not Found: ${message}`);
        case 500:
          throw new Error(`Server Error: ${message}`);
        case 502:
          throw new Error(`Bad Gateway: Publisher service error`);
        case 503:
          throw new Error(`Service Unavailable: ${message}`);
        case 504:
          throw new Error(`Gateway Timeout: Service took too long to respond`);
        default:
          throw new Error(`API Error (${status}): ${message}`);
      }
    }
    throw new Error(`Request failed: ${error.message}`);
  }
}

// ============================================================
// Driving License
// ============================================================

/**
 * Verify and retrieve driving license information
 * @param {Object} params - License parameters
 * @param {string} params.format - Response format (xml or pdf)
 * @param {string} params.dlno - Driving License Number (optional)
 * @param {string} params.UID - Aadhaar number (optional)
 * @param {string} params.FullName - Full name (optional)
 * @param {string} params.DOB - Date of birth DD-MM-YYYY (optional)
 */
export async function verifyDrivingLicense(params) {
  const { format = 'xml', dlno, UID, FullName, DOB } = params;

  const payload = {
    txnId: randomUUID(),
    format: format.toLowerCase()
  };

  const certificateParameters = {};
  if (dlno) certificateParameters.dlno = dlno;
  if (UID) certificateParameters.UID = UID;
  if (FullName) certificateParameters.FullName = FullName;
  if (DOB) certificateParameters.DOB = DOB;

  if (Object.keys(certificateParameters).length > 0) {
    payload.certificateParameters = certificateParameters;
  }

  return await request('/drvlc/certificate', 'POST', payload);
}

// ============================================================
// Vehicle Registration
// ============================================================

/**
 * Verify vehicle registration certificate
 * @param {Object} params - Vehicle parameters
 * @param {string} params.format - Response format (xml or pdf)
 * @param {string} params.reg_no - Registration Number (optional)
 * @param {string} params.chasis_no - Chassis Number (optional)
 * @param {string} params.UID - Aadhaar number (optional)
 * @param {string} params.FullName - Owner name (optional)
 */
export async function verifyVehicleRegistration(params) {
  const { format = 'xml', reg_no, chasis_no, UID, FullName } = params;

  const payload = {
    txnId: randomUUID(),
    format: format.toLowerCase()
  };

  const certificateParameters = {};
  if (reg_no) certificateParameters.reg_no = reg_no;
  if (chasis_no) certificateParameters.chasis_no = chasis_no;
  if (UID) certificateParameters.UID = UID;
  if (FullName) certificateParameters.FullName = FullName;

  if (Object.keys(certificateParameters).length > 0) {
    payload.certificateParameters = certificateParameters;
  }

  return await request('/rvcer/certificate', 'POST', payload);
}
