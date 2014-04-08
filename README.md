NuPack
======

This package provides two things:
1. A simple markup engine called MarkupMan
2. A specific configuration of this engine called NuPack.  It contains the NuPack specific rules

Rationale
============
The decision to design a seperate markup engine was made because:

- It seperates the testing into smaller/simpler pieces:
  - Engine testing to handle how the markups combine and are calculated
  - Configuration specific testing for the provided rules
  - Integration tests for the system as a whole
- The time to abstract the engine was relatively small compared to the time required to code the intial solution (or at least close enough to warrant the added complexity)

The decision to use Javascript was made primarilly because Javascript objects allow painless assignment of functions to an attribute, thus simplifying the implementation of MarkupMan

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
