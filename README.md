NuPack
======

This package provides two things:
1. A simple markup engine called *MarkupMan*.  As it's argument it takes a configuration object.
2. A specific configuration of this engine called *NuPack*.  It contains the NuPack specific rules.

The configuration object is comprised of *Markup Groups* containing individual *Markups*.  A markup group is a collection of markups which are applied individually to an order.  These markups are added together.

All of the *markup groups* are then multiplied together before being applied to the principle amount.  This is mathematically equivalent to applying each markup on top of each other like:
```javascript
markupGroups.reduce(function (runningSubtotal, currentMarkup) {
  return runningSubtotal + runningSubtotal * currentMarkup;
}, subtotal);
```

Rationale
============
The decision to design a separate markup engine was made because:

- It separates the testing into smaller/simpler pieces:
  - Engine testing to handle how the markups combine and are calculated
  - Configuration specific testing for the provided rules
  - Integration tests for the system as a whole
- The time to abstract the engine was relatively small compared to the time required to code the initial solution (or at least close enough to warrant the added complexity)

The decision to use Javascript was made primarily because Javascript objects allow painless assignment of functions to an attribute, thus simplifying the implementation and testing of MarkupMan.

Notes
============
If we were using this sytem in production we would want to make the following adjustments:
- Use "ints" and whole numbers as our percentages to avoid floating point arithmatic issues
- Add detection for numeric overflow for very large amounts. While this should never happen in practice, it is a good practice.
- Obtain business rules on credits and discounts (eg. negative %s or negative principle amounts)


Usage and Testing Instructions
============
To run the tests please install Jasmine first
```
npm install -g jasmine-node
```

Tests can be run with:
```
jasmine-node spec
```
or
```
npm test
```


Changelog
============

- Added NuPack specific config & tests
- Added implementation for MarkupMan class
- Added test suite for MarkupMan
- Bootstrapped project
