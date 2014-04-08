// Markup Man

/*
  This class calculates the markup for a given configuration.
  Allows you to define two levels of markup.
  - Markup groups are multiplied together
  - Markups within a group are added together

  This allows you to configure complex markup chains with relative ease

  Configuration should be in the format of:
  {
    MarkupGroup1: {
      MarkupType1: {
        percent: function (options) {
          //Return the % expressed as a decimal
          return 0.05; // eg. For 5%
        }
      },
      MarkupType2: {
        percent: 0.05; // May also be a static number
      }
    }
  }

  eg.
  var config = {
    base: {
      percent: 0.05
    },
    add_ons: {
      percent: function (options) {
        if(options.food == true) {
          return 0.13;
        } else {
          return 0;
        }
      }
    }
  }

  markup = new MarkupMan(config);

  markup.calculateTotal(1000); // 1000 * 1.05 = 1050
  markup.calculateTotal(1000, {books: true}); // 1000 * (1.05 * 1.13) = 1186.50
 */

function MarkupMan (config) {

}

MarkupMan.prototype.calculateTotal = function (baseCost, options) {

  return baseCost;
}

module.exports = MarkupMan;
