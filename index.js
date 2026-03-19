#!/usr/bin/env node
'use strict';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length < 2) {
  console.log(`Usage: damerau-levenshtein <string1> <string2> [options]

Compute the Damerau-Levenshtein distance between two strings.

Options:
  --similarity   Print normalized similarity (0-1) instead of distance
  --both         Print both distance and similarity
  -h, --help     Show this help message
  -v, --version  Show version

Examples:
  damerau-levenshtein kitten sitting        # 3
  damerau-levenshtein abc acb               # 1 (transposition)
  damerau-levenshtein hello helo --both     # distance=1 similarity=0.8`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log(require('./package.json').version);
  process.exit(0);
}

const flagIdx = args.findIndex(a => a.startsWith('-'));
const positional = flagIdx === -1 ? args : args.slice(0, flagIdx);
const flags = new Set(flagIdx === -1 ? [] : args.slice(flagIdx));

if (positional.length < 2) {
  console.error('Error: two strings required');
  process.exit(1);
}

const [a, b] = positional;

function damerauLevenshtein(s, t) {
  const m = s.length;
  const n = t.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // Full Damerau-Levenshtein with transpositions
  const d = Array.from({ length: m + 2 }, () => new Array(n + 2).fill(0));
  const maxDist = m + n;
  d[0][0] = maxDist;

  for (let i = 0; i <= m; i++) {
    d[i + 1][0] = maxDist;
    d[i + 1][1] = i;
  }
  for (let j = 0; j <= n; j++) {
    d[0][j + 1] = maxDist;
    d[1][j + 1] = j;
  }

  const da = {};

  for (let i = 1; i <= m; i++) {
    let db = 0;
    for (let j = 1; j <= n; j++) {
      const i1 = da[t[j - 1]] || 0;
      const j1 = db;
      let cost = 1;
      if (s[i - 1] === t[j - 1]) {
        cost = 0;
        db = j;
      }
      d[i + 1][j + 1] = Math.min(
        d[i][j] + cost,          // substitution
        d[i + 1][j] + 1,        // insertion
        d[i][j + 1] + 1,        // deletion
        d[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1) // transposition
      );
    }
    da[s[i - 1]] = i;
  }

  return d[m + 1][n + 1];
}

const dist = damerauLevenshtein(a, b);
const maxLen = Math.max(a.length, b.length);
const sim = maxLen === 0 ? 1 : ((maxLen - dist) / maxLen);

if (flags.has('--both')) {
  console.log(`distance=${dist} similarity=${sim.toFixed(4)}`);
} else if (flags.has('--similarity')) {
  console.log(sim.toFixed(4));
} else {
  console.log(dist);
}
