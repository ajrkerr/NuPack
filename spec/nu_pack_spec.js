var NuPack       = require('../nu_pack');
var NuPackConfig = require('../config/nu_pack');

describe("The NuPack Markup System", function () {

  // Provided tests //
  it("should pass the test provided in our instructions", function () {
    expect(NuPack.calculateTotal(1299.99, {
      people: 3,
      food:   true
    })).toBe(1591.58);

    expect(NuPack.calculateTotal(5432.00, {
      people: 1,
      drugs:  true
    })).toBe(6199.81);

    expect(NuPack.calculateTotal(12456.95, {
      people: 4,
      books:  true
    })).toBe(13707.63);
  });

  /*
    More extensive testing of how the engine operates and the edge cases
    are handled in the MarkupMan tests.

    Tests of the individual markup instructions are handled below.
  */
});

describe("The NuPack Config", function () {
  it("should have a basemarkup of 5%", function () {
    expect(NuPackConfig.base.baseMarkup).toBe(0.05);
  });

  describe("people", function () {
    var calcPeople = NuPackConfig.add_ons.people;

    it("should markup 1.2% per person invovled", function () {
      for(var i = 0; i < 10; i++) {
        expect(calcPeople({people: i})).toBe(i * 0.012);
      }
    });

    it("should round down on the number of people", function () {
      expect(calcPeople({people: 3.1})).toBe(3 * 0.012);
      expect(calcPeople({people: 3.4})).toBe(3 * 0.012);
      expect(calcPeople({people: 3.9})).toBe(3 * 0.012);
      expect(calcPeople({people: 0.5})).toBe(0);
    });

    it("should treat strings which are purely numerical as a number", function () {
      expect(calcPeople({people: "1234"})).toBe(14.808);
      expect(calcPeople({people: "122" })).toBe(1.464);

      expect(calcPeople({people: "Markov"   })).toBe(0);
      expect(calcPeople({people: "34 Markov"})).toBe(0);
    })

    it("should treat any non-positive integer input as 0 people", function () {
      expect(calcPeople({people: NaN       })).toBe(0);
      expect(calcPeople({people: undefined })).toBe(0);
      expect(calcPeople({people: null      })).toBe(0);
      expect(calcPeople({})).toBe(0);

      expect(calcPeople({people: "-12" })).toBe(0);
      expect(calcPeople({people: -12   })).toBe(0);
    });
  });

  describe("food", function () {
    it("should markup 13% if present, 0 if not", function () {
      expect(NuPackConfig.add_ons.food({food: true})).toBe(0.13);
      expect(NuPackConfig.add_ons.food({})).toBe(0);
    });
  });

  describe("electronics", function () {
    it("should markup 2% if present, 0 if not", function () {
      expect(NuPackConfig.add_ons.electronics({electronics: true})).toBe(0.02);
      expect(NuPackConfig.add_ons.electronics({})).toBe(0);
    });
  });

  describe("drugs", function () {
    it("should markup 075% if present, 0 if not", function () {
      expect(NuPackConfig.add_ons.drugs({drugs: true})).toBe(0.075);
      expect(NuPackConfig.add_ons.drugs({})).toBe(0);
    });
  });
});
