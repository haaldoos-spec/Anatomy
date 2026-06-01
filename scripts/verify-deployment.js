const fs = require('fs');
const path = require('path');

function validatePackageJson(filePath) {
  console.log(`Validating ${filePath}...`);
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    
    if (!pkg.scripts) {
      throw new Error('Missing "scripts" section');
    }
    
    if (filePath.includes('backend')) {
      // Production must have build and start
      if (!pkg.scripts.build) throw new Error('Missing "build" script in backend');
      if (!pkg.scripts.start) throw new Error('Missing "start" script in backend');
      // dev is nice but not strictly required for production deploy, but we use it in dev
    }
    
    console.log(`✅ ${filePath} is valid JSON and has required production scripts.`);
  } catch (error) {
    console.error(`❌ Error in ${filePath}: ${error.message}`);
    process.exit(1);
  }
}

// Adjust paths relative to the script location (scripts/)
const rootPkg = path.resolve(__dirname, '../package.json');
const backendPkg = path.resolve(__dirname, '../backend/package.json');

validatePackageJson(rootPkg);
validatePackageJson(backendPkg);
