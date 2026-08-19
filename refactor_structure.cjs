const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const featuresDir = path.join(srcDir, 'features');

const transportDir = path.join(srcDir, 'transport_company');
const authDir = path.join(srcDir, 'auth');
const adminDir = path.join(srcDir, 'admin');
const petrolDir = path.join(srcDir, 'petrol_company');

// Ensure new directories exist
[transportDir, adminDir, petrolDir, authDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Remove the empty nested transport_company if it exists inside features
const nestedTransport = path.join(featuresDir, 'transport_company');
if (fs.existsSync(nestedTransport)) {
    fs.rmSync(nestedTransport, { recursive: true, force: true });
}

// Copy instead of rename to avoid EPERM on Windows
const oldAuth = path.join(featuresDir, 'auth');
if (fs.existsSync(oldAuth)) {
    fs.cpSync(oldAuth, authDir, { recursive: true });
    fs.rmSync(oldAuth, { recursive: true, force: true });
}

// Copy the rest to transport_company
if (fs.existsSync(featuresDir)) {
    const items = fs.readdirSync(featuresDir);
    for (const item of items) {
        const oldPath = path.join(featuresDir, item);
        const newPath = path.join(transportDir, item);
        fs.cpSync(oldPath, newPath, { recursive: true });
    }
    // Delete the now empty features directory
    try {
        fs.rmSync(featuresDir, { recursive: true, force: true });
    } catch (e) {
        console.log("Could not delete original features dir, but files are copied.");
    }
}

// Update imports
function updateImports(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            updateImports(fullPath);
        } else if (/\.(tsx|ts|jsx|js)$/.test(item)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            // Replace @/features/auth with @/auth
            if (content.includes('@/features/auth')) {
                content = content.replace(/@\/features\/auth/g, '@/auth');
                updated = true;
            }
            
            // Replace @/features/ with @/transport_company/
            if (content.includes('@/features/')) {
                content = content.replace(/@\/features\//g, '@/transport_company/');
                updated = true;
            }
            
            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated imports in ${fullPath}`);
            }
        }
    }
}

updateImports(srcDir);
console.log('Restructure complete.');
