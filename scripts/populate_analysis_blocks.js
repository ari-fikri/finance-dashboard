const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'public', 'msp.json');
const backupPath = filePath + '.bak2';

function clampDelta(v){
  // clamp to [-0.01, 0.01]
  if (v > 0.01) return 0.01;
  if (v < -0.01) return -0.01;
  return v;
}

try{
  const raw = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(backupPath, raw, 'utf8');
  const data = JSON.parse(raw);

  const blocks = ['volume','inflation','CR','material_price_impact','gentan_i_impact','material_change'];
  const keys = ['std_cost','foh_var','foh_fixed','tooling_oh','raw_material','labor','depre_common','depre_exclusive','mh_cost','total_cost'];

  (data.items || []).forEach((item, itemIdx) => {
    const months = item.months || {};
    // source values = adj_values if present for the part (prefer 2025-02 adj_values if months keyed by dates)
    const adj = months.adj_values || {};

    blocks.forEach((blk, bIdx) => {
      months[blk] = months[blk] || {};
      keys.forEach((kIdxKey, kIdx) => {
        const adjVal = Number(adj[keys[kIdx]] || adj[kIdxKey] || 0) || 0;
        // deterministic delta based on indices, scaled into [-0.01,0.01]
        const raw = ((bIdx * 7 + kIdx * 13 + itemIdx * 3) % 201) - 100; // -100..100
        const delta = clampDelta(raw / 10000); // -0.01 .. 0.01
        const newVal = Math.round(adjVal * (1 + delta));
        months[blk][keys[kIdx]] = newVal;
      });
    });

    item.months = months;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Updated', filePath, 'and saved backup to', backupPath);
}catch(err){
  console.error('Failed to update', err);
  process.exit(1);
}
