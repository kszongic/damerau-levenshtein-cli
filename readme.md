# @kszongic/damerau-levenshtein-cli

[![npm version](https://img.shields.io/npm/v/@kszongic/damerau-levenshtein-cli)](https://www.npmjs.com/package/@kszongic/damerau-levenshtein-cli)
[![license](https://img.shields.io/npm/l/@kszongic/damerau-levenshtein-cli)](./LICENSE)

Compute the **Damerau-Levenshtein distance** between two strings from the command line. Zero dependencies.

Unlike plain Levenshtein distance, this accounts for **transpositions** (swapping two adjacent characters) as a single edit operation.

## Install

```bash
npm install -g @kszongic/damerau-levenshtein-cli
```

## Usage

```bash
# Basic distance
damerau-levenshtein kitten sitting
# 3

# Transposition counts as 1 edit (vs 2 in standard Levenshtein)
damerau-levenshtein abc acb
# 1

# Normalized similarity score (0-1)
damerau-levenshtein hello helo --similarity
# 0.8000

# Both distance and similarity
damerau-levenshtein "fuzzy wuzzy" "wuzzy fuzzy" --both
# distance=8 similarity=0.2727
```

## Options

| Flag | Description |
|------|-------------|
| `--similarity` | Print normalized similarity (0–1) instead of distance |
| `--both` | Print both distance and similarity |
| `-v, --version` | Show version |
| `-h, --help` | Show help |

## Use Cases

- **Spell checking** — rank correction candidates
- **Fuzzy matching** — find similar strings accounting for typos
- **Data deduplication** — detect near-duplicate entries
- **Search** — typo-tolerant string comparison

## License

MIT
