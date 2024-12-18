const handlerBarsRegisterHelpers = (handlebars) => {
  handlebars.registerHelper('eq', function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  handlebars.registerHelper('multiply', function (a, b) {
    return (a * b).toFixed(2);
  });
};

export default handlerBarsRegisterHelpers;
