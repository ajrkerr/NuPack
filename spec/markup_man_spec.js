var MarkupMan = require('../markup_man');


describe("Markup Man", function () {

  describe("when instantiating", function () {

    // Helper function for testing instantiation
    function constructMarkupMan (percent) {
      return function () {
        new MarkupMan({
          base: percent
        });
      };
    }

    it("should require a configuration", function () {
       expect(constructMarkupMan()).toThrow();
    });

    it("should require at least one markup", function () {
      var config = {
          baseGroup:   {}, // Empty groups
          secondGroup: {}
      };

      var construct = function () { new MarkupMan(config); }

      expect(construct).toThrow();
    });

    it("should require the configuration to be numeric", function () {
      expect(construct(0.05)).not.toThrow();
      expect(construct(  12)).not.toThrow();

      // Strange Objects
      expect(construct(NaN      )).toThrow();
      expect(construct(null     )).toThrow();
      expect(construct(undefined)).toThrow();
      expect(construct({}       )).toThrow();

      // Strings
      expect(construct("as")).toThrow();
      expect(construct("12")).toThrow();
    })

    it("should ignore extra functions/attributes on the configuration", function () {
      var config = {
        baseGroup: {
          first: {
            percent: 0.15,
            extraAttribute: "OogaBooga"
          }
        },
      }

      var construct = function () { new MarkupMan(config); }

      expect(construct).not.toThrow();
    });

    it("should work with the basecase provided in the docs", function () {
      var config = {
        base: {
          basePercent: 0.05
        },
        add_ons: {
          books: function (options) {
            if(options.food == true) {
              return 0.13;
            } else {
              return 0;
            }
          }
        }
      };

      var markup = new MarkupMan(config);

      expect(markup.calculateTotal(1000)).toBe(1050);
      expect(markup.calculateTotal(1000, { books: true} )).toBe(1186.50);
    });
  });


  describe("when interperting configurations", function () {
    it("should work with static floats as the percent", function () {
      var config = {
        base: { basePercent: 0.05 }
      };

      var markup = new MarkupMan(config);
      expect(markup.calculateTotal(1000)).toBe(1050);
      expect(markup.calculateTotal(1000, { books: true} )).toBe(1186.50);
    });

    it("should work with the percent defined as a function", function () {
      var config = {
        add_ons: {
          books: function (options) {
            return 0.13;
          }
        }
      };

      var markup = new MarkupMan(config);
      expect(markup.calculateTotal(1000)).toBe(1050);
      expect(markup.calculateTotal(1000, { books: true} )).toBe(1186.50);
    });

    it("should multiply markup groups together", function () {
      var config = {
        base:     { basePercent: 0.05 },
        horseFee: { oatTax:      0.10 },
        add_ons: {
          books: function () { return 0.20; }
        }
      };

      var markup = new MarkupMan(config);
      expect(markup.calculateTotal(1000)).toBe(1386);
      expect(markup.calculateTotal(1000, { books: true} )).toBe(1186.50);
    })

    it("should return as decimal places/floats", function () {
      var config = {
        base:     { basePercent: 0.05 },
        horseFee: { oatTax:      0.10 },
        add_ons:  { books: function () { return 0.20; } }
      };;

      var markup = new MarkupMan(config);
      expect(markup.calculateTotal(1)).toBe(1.386);
    });

    it("should add markups within a group together", function () {
      var config = {
        horseMarkup: {
          extraOats:  0.05,
          stableFees: 0.15
        }
      };

      var markup = new MarkupMan(config);
      expect(markup.calculateTotal(1000)).toBe(1200);
    });

    it("should accept negative markups (discounts)", function () {
      var config = {
        horseMarkup: {
          extraOats:        0.05,
          stableFees:       0.15,
          unicornDiscount: -0.50
        }
      };

      var markup = new MarkupMan(config);
      expect(markup.calculateTotal(1000)).toBe(700);
    });

    it("should accept 0% markups", function () {
      var config = {
        horseMarkup: {
          hypotheticalZerCase: function () { return 0; }
        }
      };

      var markup = new MarkupMan(config);
      expect(markup.calculateTotal(1000)).toBe(1000);
    });
  });


  describe("when calculating the total", function () {

    var config = {
      base: { baseCost: 0.10 }
    };

    var markup = new MarkupMan(config);

    it("should provide the total ", function () {
      expect(markup.calculateTotal(1000)).toBe(1010);
    });

    it("should accept 0 as the baseCost", function () {
      expect(markup.calculateTotal(0)).toBe(0);
    });

    it("should gracefully handle null, undefined, and NaN as the input", function () {
      expect(markup.calculateTotal(NaN)).toBe(0);
      expect(markup.calculateTotal(undefined)).toBe(0);
      expect(markup.calculateTotal("Marko")).toBe(0);
      expect(markup.calculateTotal({})).toBe(0);
    });

    it("should attempt to parse a string which is provided as the input", function () {
      expect(markup.calculateTotal("12345")).toBe(13579.50);
      expect(markup.calculateTotal("1111.11")).toBe(1222.22);
    });

    /////
    // Sure, why not calculate it on a credit...?
    // We haven't been told otherwise!
    it("should calculate the markup on a negative number", function () {
      expect(markup.calculateTotal(-1000)).toBe(-1100);
    });
  });
});
