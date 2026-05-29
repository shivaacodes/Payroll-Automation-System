const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/\brounded-(sm|md|lg|xl|2xl|3xl|full)\b/g, 'rounded-none');
      content = content.replace(/\brounded\b/g, 'rounded-none');

      content = content.replace(/\bshadow-(sm|md|lg|xl|2xl)\b/g, 'shadow-none');
      content = content.replace(/\bshadow\b/g, 'shadow-none');
      
      content = content.replace(/PayFlow\. Employee Salary Slip Automation System\./g, 'Employee Salary Slip Automation System.');
      content = content.replace(/PayFlow/g, 'Employee Salary Slip Automation System');
      
      fs.writeFileSync(fullPath, content);
      console.log('Processed', fullPath);
    }
  }
}

processDir(path.join(__dirname, 'app'));
