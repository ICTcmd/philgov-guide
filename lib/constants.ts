export const AGENCY_LINKS: Record<string, { homepage?: string; locator?: string; appointment?: string }> = {
  'DFA (Passport)': { homepage: 'https://dfa.gov.ph/', locator: 'https://consular.dfa.gov.ph/consular-offices/', appointment: 'https://www.passport.gov.ph/' },
  "LTO (Driver’s License/Car)": { homepage: 'https://lto.gov.ph/', locator: 'https://lto.gov.ph/directory-of-offices.html', appointment: 'https://portal.lto.gov.ph/' },
  'BIR (TIN/Tax)': { homepage: 'https://www.bir.gov.ph/', locator: 'https://www.bir.gov.ph/index.php/directory/regional.html' },
  'PSA (Birth Cert)': { homepage: 'https://psa.gov.ph/', locator: 'https://psa.gov.ph/psa-regional-offices', appointment: 'https://www.psahelpline.ph/' },
  'PSA (National ID)': { homepage: 'https://philsys.gov.ph/', locator: 'https://philsys.gov.ph/registration-center/' },
  'SSS': { homepage: 'https://www.sss.gov.ph/', appointment: 'https://member.sss.gov.ph/' },
  'PhilHealth': { homepage: 'https://www.philhealth.gov.ph/', locator: 'https://www.philhealth.gov.ph/about_us/map/' },
  'PAG-IBIG': { homepage: 'https://www.pagibigfund.gov.ph/', locator: 'https://www.pagibigfund.gov.ph/directory.html', appointment: 'https://www.pagibigfund.gov.ph/virtualpagibig/' },
  'NBI (Clearance)': { homepage: 'https://nbi.gov.ph/', appointment: 'https://clearance.nbi.gov.ph/' },
  'PhilPost': { homepage: 'https://www.postalidph.com/', locator: 'https://www.postalidph.com/captured-sites.html' },
  'COMELEC': { homepage: 'https://comelec.gov.ph/', locator: 'https://comelec.gov.ph/?r=ContactInformation/FieldOffices' },
  'PNP': { homepage: 'https://pnp.gov.ph/', appointment: 'https://pnpclearance.ph/' },
  'PRC': { homepage: 'https://www.prc.gov.ph/', appointment: 'https://online.prc.gov.ph/' },
  'DSWD': { homepage: 'https://www.dswd.gov.ph/', locator: 'https://www.dswd.gov.ph/directory-of-officials/' },
  'Barangay': { homepage: '', locator: '' },
  'DOLE': { homepage: 'https://www.dole.gov.ph/', locator: 'https://www.dole.gov.ph/regional-offices/' },
  'TESDA': { homepage: 'https://www.tesda.gov.ph/', locator: 'https://www.tesda.gov.ph/Directory/Regions' },
  'CSC': { homepage: 'https://csc.gov.ph/', locator: 'https://csc.gov.ph/contact-us/regional-offices' },
  'DTI': { homepage: 'https://www.dti.gov.ph/', locator: 'https://www.dti.gov.ph/contact/' },
  'Bureau of Immigration': { homepage: 'https://immigration.gov.ph/', appointment: 'https://e-services.immigration.gov.ph/' },
  'OWWA': { homepage: 'https://owwa.gov.ph/', locator: 'https://owwa.gov.ph/contact-us/' },
  'DENR': { homepage: 'https://www.denr.gov.ph/', locator: 'https://www.denr.gov.ph/index.php/contact-us/regional-offices' },
  'GSIS': { homepage: 'https://www.gsis.gov.ph/', locator: 'https://www.gsis.gov.ph/contact-us/branch-offices/', appointment: 'https://www.gsis.gov.ph/ginhawa-for-all/' },
  'DOH': { homepage: 'https://doh.gov.ph/', locator: 'https://doh.gov.ph/contact/' }
};

export const AGENCY_ACTIONS: Record<string, string[]> = {
  'DFA (Passport)': [
    'New Passport Application',
    'Renew Passport',
    'Lost Passport',
    'Passport for Minors',
    'Travel Document',
    'Authentication (Apostille)'
  ],
  'LTO (Driver’s License/Car)': [
    'Student Permit',
    'Non-Professional Driver’s License',
    'Professional Driver’s License',
    'Renew Driver’s License',
    'Vehicle Registration Renewal',
    'Transfer of Ownership'
  ],
  'BIR (TIN/Tax)': [
    'Apply for TIN (Employee)',
    'Apply for TIN (Self-Employed)',
    'File Income Tax Return',
    'Register Books of Accounts',
    'Closure of Business'
  ],
  'PSA (Birth Cert)': [
    'Get Birth Certificate',
    'Get Marriage Certificate',
    'Get CENOMAR',
    'Get Death Certificate',
    'Correct Entry in Certificate'
  ],
  'PSA (National ID)': [
    'Apply for National ID',
    'Track National ID Delivery',
    'ePhilID Generation',
    'Update Personal Information'
  ],
  'SSS': [
    'Apply for SSS Number',
    'Salary Loan',
    'Maternity Benefit',
    'Sickness Benefit',
    'Unemployment Benefit',
    'Retirement Benefit',
    'Funeral Benefit'
  ],
  'PhilHealth': [
    'Register as Member',
    'MDR Request',
    'Update Member Information',
    'Check Contributions',
    'Claim Benefits'
  ],
  'PAG-IBIG': [
    'Apply for Housing Loan',
    'Multi-Purpose Loan (MPL)',
    'Calamity Loan',
    'MP2 Savings',
    'Loyalty Card Plus',
    'Membership Registration'
  ],
  'NBI (Clearance)': [
    'New NBI Clearance',
    'Renew NBI Clearance',
    'NBI Clearance for Abroad',
    'Hit Status Inquiry'
  ],
  'DSWD': [
    'Educational Assistance',
    'Medical Assistance',
    'Burial Assistance',
    'Transportation Assistance',
    '4Ps Application',
    'Solo Parent ID'
  ],
  'PhilPost': [
    'Apply for Postal ID',
    'Renew Postal ID',
    'Rush Postal ID',
    'Track Parcel'
  ],
  'COMELEC': [
    'Voter Registration',
    'Transfer Registration',
    'Reactivation',
    'Voter Certification'
  ],
  'PNP': [
    'Police Clearance',
    'Gun License (Ltopf)',
    'Report a Crime'
  ],
  'PRC': [
    'Board Exam Application',
    'Initial Registration',
    'Renew Professional ID',
    'Certifications'
  ],
  'Barangay': [
    'Barangay Clearance',
    'Certificate of Indigency',
    'Certificate of Residency',
    'Blotter Report',
    'Community Tax Cert (Cedula)'
  ],
  'DOLE': [
    'DOLE 174 Registration',
    'Alien Employment Permit',
    'Labor Complaint',
    'TUPAD Application',
    'SPES Application'
  ],
  'TESDA': [
    'Assessment & Certification',
    'Scholarship Application',
    'NCII Assessment',
    'TVET Enrollment'
  ],
  'CSC': [
    'Civil Service Exam',
    'Career Service Eligibility',
    'File Administrative Case',
    'Honor Graduate Eligibility'
  ],
  'DTI': [
    'Business Name Registration',
    'DTI Renewal',
    'Consumer Complaint',
    'Import Commodity Clearance'
  ],
  'Bureau of Immigration': [
    'Visa Extension',
    'ACR I-Card',
    'Exit Clearance',
    'Dual Citizenship',
    'Student Visa'
  ],
  'OWWA': [
    'OWWA Membership',
    'OEC Application',
    'Balik Pinas Program',
    'Scholarship Application'
  ],
  'DENR': [
    'Environmental Compliance (ECC)',
    'Tree Cutting Permit',
    'Land Titling',
    'Chainsaw Registration'
  ],
  'GSIS': [
    'Apply for GSIS Loan',
    'Retirement Benefit',
    'UMID Card (GSIS)',
    'Life Insurance Claim',
    'Pension Loan'
  ],
  'DOH': [
    'Medical Assistance',
    'FDA License to Operate',
    'Health Facility License',
    'Doctor to the Barrios'
  ]
};

export const LOADING_MESSAGES = [
  "Consulting the bureaucracy...",
  "Finding the shortest line...",
  "Decoding government speak...",
  "Looking for the rubber stamp...",
  "Asking the guard on duty...",
  "Checking the latest memo...",
  "Computing the processing time...",
  "Reviewing the checklist...",
];

