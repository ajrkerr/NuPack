
module.exports = {
  // Flat Markup of 5% on all jobs
  base: {
    baseMarkup: 0.05
  },

  add_ons: {
    // 0.2% per person required
    people: function (options) {
      // We don't pay halflings
      var people = Math.floor(+options.people);

      if(typeof(people) !== "number" || isNaN(people) || people < 0) {
        people = 0;
      }
      
      return 0.012 * people;
    },

    // 13% for food
    food: function (options) {
      return (options.food === true) ? 0.13 : 0;
    },

    // 2% for electronics
    electronics: function (options) {
      return (options.electronics === true) ? 0.02 : 0;
    },

    // 7.5% for drugs
    drugs: function (options) {
      return (options.drugs === true) ? 0.075 : 0;
    }
  }
}
