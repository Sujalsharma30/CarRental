const fs = require('fs');
let c = fs.readFileSync('client/src/components/DailyHisab.jsx', 'utf8');

const startIdx = c.indexOf('const rawStyles = ');
const endIdx = c.indexOf(';\n\nexport default function DailyHisab');
let css = c.substring(startIdx, endIdx);

// ── Background replacements ──
css = css.split('background: #0f111a;').join('background: #f8f9fb;');
css = css.split('background: #1e293b;').join('background: #ffffff;');
css = css.split('background: #0f172a;').join('background: #f1f5f9;');
css = css.split('background: rgba(255,255,255,0.05)').join('background: #f1f5f9');
css = css.split('background: rgba(255, 255, 255, 0.05)').join('background: #f1f5f9');
css = css.split('background: rgba(255,255,255,0.03)').join('background: #f8f9fb');
css = css.split('background: rgba(255, 255, 255, 0.03)').join('background: #f8f9fb');
css = css.split('background: rgba(255,255,255,0.02)').join('background: #f8f9fb');
css = css.split('background: rgba(255, 255, 255, 0.02)').join('background: #f8f9fb');
css = css.split('background: rgba(255,255,255,0.01)').join('background: #f8f9fb');
css = css.split('background: rgba(255, 255, 255, 0.01)').join('background: #f8f9fb');

// ── Border replacements ──
css = css.split('border: 1px solid #334155;').join('border: 1px solid #e5e7eb;');
css = css.split('border-color: #334155;').join('border-color: #e5e7eb;');
css = css.split('border-color: #475569;').join('border-color: #cbd5e1;');
css = css.split('border-top: 1px solid #334155;').join('border-top: 1px solid #e5e7eb;');
css = css.split('border-bottom: 1px solid #334155;').join('border-bottom: 1px solid #e5e7eb;');
css = css.split('border-left: 2px solid #334155;').join('border-left: 2px solid #e5e7eb;');
css = css.split('border-bottom: 1px solid rgba(255, 255, 255, 0.03);').join('border-bottom: 1px solid #f1f5f9;');
css = css.split('border: 2px solid #0f172a;').join('border: 2px solid #f8f9fb;');
css = css.split('border: 1px dashed rgba(37, 99, 235, 0.2)').join('border: 1px dashed rgba(99,102,241,0.3)');

// ── Text color replacements ──
css = css.split('color: #f3f4f6;').join('color: #1e293b;');
css = css.split('color: #cbd5e1;').join('color: #475569;');
css = css.split('color: #9ca3af;').join('color: #64748b;');

// Targeted: replace color #ffffff only in text-color contexts (not in background declarations)
// Do it class by class to avoid touching badge/pill white text
css = css.split('  .hisab-filters-title {\n    font-size: 1rem;\n    font-weight: 600;\n    color: #ffffff;')
         .join('  .hisab-filters-title {\n    font-size: 1rem;\n    font-weight: 600;\n    color: #1e293b;');
css = css.split('  .hisab-item-title {\n    font-size: 1rem;\n    font-weight: 600;\n    color: #ffffff;')
         .join('  .hisab-item-title {\n    font-size: 1rem;\n    font-weight: 600;\n    color: #1e293b;');
css = css.split('  .hisab-detail-val {\n    font-weight: 600;\n    color: #ffffff;')
         .join('  .hisab-detail-val {\n    font-weight: 600;\n    color: #1e293b;');
css = css.split('  .hisab-footer-title {\n    font-size: 1rem;\n    font-weight: 700;\n    color: #ffffff;')
         .join('  .hisab-footer-title {\n    font-size: 1rem;\n    font-weight: 700;\n    color: #1e293b;');
css = css.split('    font-weight: 600;\n    color: #ffffff;\n    margin-bottom: 4px;\n  }')
         .join('    font-weight: 600;\n    color: #1e293b;\n    margin-bottom: 4px;\n  }');
css = css.split('    color: #ffffff;\n    margin-bottom: 4px;\n  }\n  .hisab-timeline-time')
         .join('    color: #1e293b;\n    margin-bottom: 4px;\n  }\n  .hisab-timeline-time');
css = css.split('    color: #ffffff;\n  }\n  .hisab-activity-summary-stats')
         .join('    color: #1e293b;\n  }\n  .hisab-activity-summary-stats');

// Date btn hover  
css = css.split('  .hisab-date-btn:hover {\n    color: #ffffff;').join('  .hisab-date-btn:hover {\n    color: #1e293b;');

fs.writeFileSync('client/src/components/DailyHisab.jsx',
  c.substring(0, startIdx) + css + c.substring(endIdx), 'utf8');

console.log('DailyHisab light theme conversion done.');
