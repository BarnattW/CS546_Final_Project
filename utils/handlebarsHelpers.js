const handlerBarsRegisterHelpers = (handlebars) => {
	handlebars.registerHelper("eq", function (a, b, options) {
		if (a === b) {
			return options.fn(this);
		}
		return options.inverse(this);
	});
};

export default handlerBarsRegisterHelpers;
