const capitialize = (str) => {
	if (str === undefined || str === null) return "";
	if (typeof str !== "string") return String(str);
	if (str.length === 0) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export { capitialize };