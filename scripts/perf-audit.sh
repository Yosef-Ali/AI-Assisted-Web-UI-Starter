#!/bin/bash
# Performance Audit Script
# Runs comprehensive performance testing and generates reports

set -e

echo "🚀 Starting Performance Audit..."

# Ensure production server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Production server not running on localhost:3000"
    echo "Run: npm run build && npm start"
    exit 1
fi

echo "✅ Production server detected"

# Create reports directory
mkdir -p reports

# Bundle size analysis
echo "📊 Analyzing bundle size..."
node -e "
const fs = require('fs');
const path = require('path');

const buildDir = './.next/static/chunks';
let totalJS = 0;
let totalCSS = 0;
const files = [];

if (fs.existsSync(buildDir)) {
    fs.readdirSync(buildDir).forEach(file => {
        const filePath = path.join(buildDir, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;
        
        if (file.endsWith('.js')) {
            totalJS += size;
            files.push({ name: file, size, type: 'js' });
        } else if (file.endsWith('.css')) {
            totalCSS += size;
            files.push({ name: file, size, type: 'css' });
        }
    });
}

const report = {
    timestamp: new Date().toISOString(),
    bundleSize: {
        totalJS: totalJS,
        totalCSS: totalCSS,
        total: totalJS + totalCSS,
        files: files.sort((a, b) => b.size - a.size)
    },
    budgets: {
        maxTotal: 204800, // 200KB
        jsWithinBudget: totalJS <= 180000, // 180KB for JS
        totalWithinBudget: (totalJS + totalCSS) <= 204800
    }
};

fs.writeFileSync('./reports/bundle-analysis.json', JSON.stringify(report, null, 2));

console.log('Bundle Analysis:');
console.log(\`  Total JS: \${(totalJS/1024).toFixed(1)}KB\`);
console.log(\`  Total CSS: \${(totalCSS/1024).toFixed(1)}KB\`); 
console.log(\`  Total: \${((totalJS+totalCSS)/1024).toFixed(1)}KB\`);
console.log(\`  Budget: OK? \${report.budgets.totalWithinBudget ? '✅' : '❌'}\`);
"

# Lighthouse audits
echo "🔍 Running Lighthouse audits..."

# Install lighthouse if not present
if ! command -v lighthouse &> /dev/null; then
    echo "Installing Lighthouse..."
    npm install -g lighthouse
fi

# Desktop audit
echo "  📊 Desktop audit..."
lighthouse http://localhost:3000 \
    --preset=desktop \
    --output=json \
    --output=html \
    --output-path=./reports/lighthouse-desktop \
    --quiet \
    --chrome-flags="--headless --no-sandbox"

# Mobile audit  
echo "  📱 Mobile audit..."
lighthouse http://localhost:3000 \
    --preset=mobile \
    --output=json \
    --output=html \
    --output-path=./reports/lighthouse-mobile \
    --quiet \
    --chrome-flags="--headless --no-sandbox"

# Performance page audit
echo "  ⚡ Performance page audit..."
lighthouse http://localhost:3000/performance \
    --preset=desktop \
    --output=json \
    --output-path=./reports/lighthouse-performance-page \
    --quiet \
    --chrome-flags="--headless --no-sandbox"

# Generate summary report
echo "📋 Generating summary report..."
node -e "
const fs = require('fs');

try {
    const bundleReport = JSON.parse(fs.readFileSync('./reports/bundle-analysis.json', 'utf8'));
    const desktopReport = JSON.parse(fs.readFileSync('./reports/lighthouse-desktop.json', 'utf8'));
    const mobileReport = JSON.parse(fs.readFileSync('./reports/lighthouse-mobile.json', 'utf8'));
    
    const summary = {
        timestamp: new Date().toISOString(),
        bundle: {
            totalSize: bundleReport.bundleSize.total,
            withinBudget: bundleReport.budgets.totalWithinBudget
        },
        lighthouse: {
            desktop: {
                performance: desktopReport.categories.performance.score * 100,
                accessibility: desktopReport.categories.accessibility.score * 100,
                bestPractices: desktopReport.categories['best-practices'].score * 100,
                seo: desktopReport.categories.seo.score * 100
            },
            mobile: {
                performance: mobileReport.categories.performance.score * 100,
                accessibility: mobileReport.categories.accessibility.score * 100,
                bestPractices: mobileReport.categories['best-practices'].score * 100,
                seo: mobileReport.categories.seo.score * 100
            },
            coreWebVitals: {
                lcp: desktopReport.audits['largest-contentful-paint'].numericValue,
                cls: desktopReport.audits['cumulative-layout-shift'].numericValue,
                fid: desktopReport.audits['max-potential-fid'].numericValue
            }
        }
    };
    
    fs.writeFileSync('./reports/performance-summary.json', JSON.stringify(summary, null, 2));
    
    console.log('\\n📊 Performance Summary:');
    console.log(\`Bundle Size: \${(summary.bundle.totalSize/1024).toFixed(1)}KB \${summary.bundle.withinBudget ? '✅' : '❌'}\`);
    console.log('\\n🖥️  Desktop Scores:');
    console.log(\`  Performance: \${summary.lighthouse.desktop.performance.toFixed(0)} \${summary.lighthouse.desktop.performance >= 90 ? '✅' : '❌'}\`);
    console.log(\`  Accessibility: \${summary.lighthouse.desktop.accessibility.toFixed(0)} \${summary.lighthouse.desktop.accessibility >= 95 ? '✅' : '❌'}\`);
    console.log(\`  Best Practices: \${summary.lighthouse.desktop.bestPractices.toFixed(0)} \${summary.lighthouse.desktop.bestPractices >= 95 ? '✅' : '❌'}\`);
    console.log(\`  SEO: \${summary.lighthouse.desktop.seo.toFixed(0)} \${summary.lighthouse.desktop.seo >= 90 ? '✅' : '❌'}\`);
    console.log('\\n📱 Mobile Scores:');
    console.log(\`  Performance: \${summary.lighthouse.mobile.performance.toFixed(0)} \${summary.lighthouse.mobile.performance >= 90 ? '✅' : '❌'}\`);
    console.log(\`  Accessibility: \${summary.lighthouse.mobile.accessibility.toFixed(0)} \${summary.lighthouse.mobile.accessibility >= 95 ? '✅' : '❌'}\`);
    console.log('\\n⚡ Core Web Vitals:');
    console.log(\`  LCP: \${(summary.lighthouse.coreWebVitals.lcp/1000).toFixed(2)}s \${summary.lighthouse.coreWebVitals.lcp <= 2500 ? '✅' : '❌'}\`);
    console.log(\`  CLS: \${summary.lighthouse.coreWebVitals.cls.toFixed(3)} \${summary.lighthouse.coreWebVitals.cls <= 0.1 ? '✅' : '❌'}\`);
    console.log(\`  FID: \${summary.lighthouse.coreWebVitals.fid.toFixed(0)}ms \${summary.lighthouse.coreWebVitals.fid <= 100 ? '✅' : '❌'}\`);
    
} catch (error) {
    console.error('Error generating summary:', error.message);
}
"

echo "✅ Performance audit complete!"
echo "📁 Reports saved in ./reports/"
echo "🌐 View HTML reports:"
echo "   Desktop: ./reports/lighthouse-desktop.html"
echo "   Mobile: ./reports/lighthouse-mobile.html"