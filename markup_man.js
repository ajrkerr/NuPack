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
      MarkupType1: function (options) {
        //Return the % expressed as a decimal
        return 0.05; // eg. For 5%
      },
      MarkupType2: 0.05; // May also be a static number
    }
  }

  eg.
  var config = {
    base: {
      basePercent: { 0.05 }
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
  }

  markup = new MarkupMan(config);

  markup.calculateTotal(1000); // 1000 * 1.05 = 1050
  markup.calculateTotal(1000, {books: true}); // 1000 * (1.05 * 1.13) = 1186.50
 */


// TODO: Refactor for floating point precision (eg. to use integers instead of floats)
function MarkupMan (config) {
  this.config = config;

  // Validate
  this.calculateMarkup();
}

MarkupMan.prototype.calculateMarkupGroup = function (markupGroup, options) {
  var markupList = [];

  for(var markupName in markupGroup) {
    if(markupGroup.hasOwnProperty(markupName)) {
      var markup = markupGroup[markupName];
      var markupResult;

      // Obtain markup %
      if(typeof(markup) === 'function') {

        // If options aren't set pass in an empty
        if(options === undefined) {
          options = {};
        }

        markupResult = markup(options);
      } else {
        markupResult = markup;
      }

      // Validate our markup is a number
      if(typeof(markupResult) !== 'number' || isNaN(markupResult)) {
        throw {
          message: "Invalid Markup",
          value:   markupResult,
          name:    markupName,
          group:   markupGroup
        };
      }

      // Add to our arry of results
      markupList.push(markupResult);
    }
  }

  // Reduce to the final percentage for this group
  var groupResult = markupList.reduce(function (previous, current) {
    return previous + current;
  });

  return groupResult;
}

// Calculates the markup groups for a given option set
MarkupMan.prototype.calculateMarkupGroups = function (options) {
  var result = [];

  for(var markupGroupName in this.config) {
    if(this.config.hasOwnProperty(markupGroupName)) {
      var markupGroup       = this.config[markupGroupName];
      var markupGroupResult = this.calculateMarkupGroup(markupGroup, options);

      result.push(markupGroupResult);
    }
  }

  return result;
}



// Calculates the tax for a given option set
MarkupMan.prototype.calculateMarkup = function (options) {
  // Add 1 to all of our markups so we can multiply them
  // Then Multliply all of our markups together
  var result = this.calculateMarkupGroups(options).map(function (markup) {
    return markup + 1;
  }).reduce(function (previous, current) {
    return previous * current;
  });

  // Remove the 1 so we are returning the proper %
  return result - 1;
}

MarkupMan.prototype.calculateTotal = function (baseCost, options) {
  // Attempt to convert to a number
  baseCost = (+baseCost);

  if(typeof(baseCost) !== "number" || isNaN(baseCost)) {
    return 0;
  }

  // Calculate the total cost and round to two decimal places
  var result = baseCost + baseCost * this.calculateMarkup(options)
  result = Math.round(result * 100) / 100;

  return result;
}

module.exports = MarkupMan;
