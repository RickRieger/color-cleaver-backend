# Color Cleaver — Back End: Mixing and Splitting Colors

[![Tests](https://github.com/RickRieger/color-cleaver-backend/actions/workflows/tests.yml/badge.svg)](https://github.com/RickRieger/color-cleaver-backend/actions/workflows/tests.yml)

A JavaScript exercise from the **Code Immersives** web development bootcamp in New York City (February 2021). It's the "back end" of a two-part project: four small functions about the **color wheel**, each in its own file. They check whether a color is primary or secondary, mix two primaries into a secondary, and split a secondary back into its two primaries. The front end ([color-cleaver-front-end](https://github.com/RickRieger/color-cleaver-front-end)) uses them. [Jest](https://jestjs.io/) tests check each one. This repo is my fork of the assignment.

**Skills practiced:** one function per file with `module.exports`, comparisons combined with `||` and `&&`, handling arguments in either order, and returning a condition directly.

**Built with:** JavaScript (Node.js) and Jest 24. There's no web page; the badge above shows whether the tests currently pass on GitHub.

---

## Contents

- [The functions](#the-functions)
- [My solution](#my-solution)
- [Run the tests](#run-the-tests)
- [How it's verified](#how-its-verified)
- [Cleanup log (November 2026)](#cleanup-log-november-2026)
- [Original assignment (from the instructor)](#original-assignment-from-the-instructor)

---

## The functions

| File | Function | Example |
|---|---|---|
| [`is-valid-primary.js`](is-valid-primary.js) | `isValidPrimary(color)` | `'red'` → `true`, `'orange'` → `false` |
| [`is-valid-secondary.js`](is-valid-secondary.js) | `isValidSecondary(color)` | `'green'` → `true`, `'black'` → `false` |
| [`color-combinator.js`](color-combinator.js) | `colorCombinator(color1, color2)` | `('red', 'yellow')` → `'orange'`, and `('yellow', 'red')` → `'orange'` too |
| [`color-deconstructor.js`](color-deconstructor.js) | `colorDeconstructor(color)` | `'purple'` → `'red and blue'` |

```
   red + yellow = orange
   red + blue   = purple
   blue + yellow = green
```

## My solution

Written on **2021-02-25** (commit *"Colors of a rainbow"*). All 4 test groups passed. *(Shown as it is after the 2026 cleanup; see the log below.)*

```js
function isValidPrimary(color) {
  return color === 'red' || color === 'blue' || color === 'yellow';
}

function isValidSecondary(color) {
  return color === 'orange' || color === 'purple' || color === 'green';
}

// Mix two primary colors, in either order. Other combinations return undefined.
function colorCombinator(color1, color2) {
  if ((color1 === 'red' && color2 === 'blue') || (color1 === 'blue' && color2 === 'red')) {
    return 'purple';
  } else if ((color1 === 'red' && color2 === 'yellow') || (color1 === 'yellow' && color2 === 'red')) {
    return 'orange';
  } else if ((color1 === 'yellow' && color2 === 'blue') || (color1 === 'blue' && color2 === 'yellow')) {
    return 'green';
  }
}

// The two primary colors that make a secondary color. Other colors return undefined.
function colorDeconstructor(color) {
  if (color === 'orange') {
    return 'red and yellow';
  } else if (color === 'purple') {
    return 'red and blue';
  } else if (color === 'green') {
    return 'blue and yellow';
  }
}
```

**Either order.** The tests call `colorCombinator('red', 'yellow')` *and* `colorCombinator('yellow', 'red')`, so each mix checks both orders: `(red AND yellow) OR (yellow AND red)`.

**Colors it doesn't know** (like `'red' + 'red'`, `'red' + 'green'` or `colorDeconstructor('red')`) return `undefined`, because the function finishes without hitting a `return`. The assignment only defines the three primary mixes, so there's no right answer to invent for the others.

## Run the tests

You need [Node.js](https://nodejs.org/).

```bash
git clone https://github.com/RickRieger/color-cleaver-backend.git
cd color-cleaver-backend
npm ci
npm run test:ci   # runs all tests once and exits
npm test          # watch mode, as in the original assignment: re-runs on every save
```

Expected result: `Tests: 4 passed, 4 total`.

## How it's verified

[`.github/workflows/tests.yml`](.github/workflows/tests.yml) runs `npm run test:ci` on GitHub Actions after every push, and the badge at the top shows the result. This repo has no web page, so instead of a live site, a passing test run is how it shows it works.

---

## Cleanup log (November 2026)

All changes below were made on **2026-11-24** on the branch `cleanup-and-ci`, checked by running the tests, and merged into `master`. Each is its own commit. The instructor's "Our setup code here. Don't touch!" section is byte-for-byte unchanged in all four files, and the tests are unchanged.

### 1. Removed an unreachable, wrong branch from `colorCombinator`

**Why:** the function checked red + blue **twice**. The first time it returned `'purple'` (correct). The third branch repeated the exact same check but returned `'orange'`, most likely copy-pasted from the red + yellow branch and not fully edited. It could never run, because red + blue always matched the first branch, so the tests didn't notice. But anyone reading the code would see "red + blue = orange" and be confused, and if the branches were ever reordered, it would give the wrong color.

```js
// Before
  if (color1 === 'red' && color2 === 'blue' ||
    color1 === 'blue' && color2 === 'red'){
      return 'purple';
    }
  else if (color1 === 'red' && color2 === 'yellow' ||
    color1 === 'yellow' && color2 === 'red'){
      return 'orange';
    }
  else  if (color1 === 'red' && color2 === 'blue' ||     // ← same check as the first branch…
    color1 === 'blue' && color2 === 'red'){
      return 'orange';                                     // ← …with the wrong answer
    }
   else  if (color1 === 'yellow' && color2 === 'blue' ||
    ...

// After: the duplicate branch is gone
```

### 2. Removed leftover manual-test lines

**Why:** `is-valid-primary.js` ended with two lines used to try the function in the Quokka editor plugin, which shows values next to the code. Outside Quokka they do nothing except call the function once whenever the file is loaded.

```js
// Before (after the function)
 let color = isValidPrimary('red');
 color

// After: removed
```

### 3. Tidied the four functions

**Why:**
- **Return the condition directly.** `if (x) { return true; } else { return false; }` is the same as `return x;`.
- **Parentheses in `colorCombinator`.** `a && b || c && d` works because `&&` binds tighter than `||`, but you have to know that rule to read it. `(a && b) || (c && d)` shows the grouping.
- **Names.** `color1` became `color` in the functions that take only one color.
- **Formatting.** Indentation was inconsistent: closing braces were indented as if inside the `if`, and there were stray blank lines.

```js
// Before
function isValidPrimary(color1){
  if (color1 === 'red' || color1 === 'blue' || color1 === 'yellow'){
    return true;
  }
  else{
    return false;
  }
  }

// After
function isValidPrimary(color) {
  return color === 'red' || color === 'blue' || color === 'yellow';
}
```

**Checked:** I ran the original 2021 functions and the tidied ones side by side on 154 calls (every pair from 11 test colors, including `'Red'` with a capital, an empty string and `undefined`). They give **identical results** for all of them.

### 4. Automatic test runs on GitHub

**Why:** `npm test` runs Jest in *watch mode*, which never exits, so an automated check couldn't use it. I added a run-once command and a GitHub Actions workflow.

```jsonc
// Before (package.json)
"scripts": { "test": "jest --watch-all" }

// After
"scripts": {
  "test": "jest --watch-all",   // unchanged: watch mode while working
  "test:ci": "jest --ci"        // new: run once and exit
}
```

### 5. Rewrote this README

The original README was only the title.

---

## Original assignment (from the instructor)

*The instructor's README was a single line, kept here unchanged:*

> # Color Cleaver - Backend

The tasks came from the tests in [`main.test.js`](main.test.js) and the starter files.
