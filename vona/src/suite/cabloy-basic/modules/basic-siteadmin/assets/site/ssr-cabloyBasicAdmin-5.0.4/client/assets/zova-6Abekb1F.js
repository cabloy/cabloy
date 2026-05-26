import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
//#region packages-utils/word-utils/src/index.ts
function _parseLastWord(str) {
	if (!str) return str;
	for (let i = str.length - 1; i >= 0; i--) {
		const ch = str.charAt(i);
		if (ch >= "A" && ch <= "Z") return str.substring(i);
	}
	return str;
}
function toLowerCaseFirstChar(str) {
	return str.charAt(0).toLowerCase() + str.substring(1);
}
function toUpperCaseFirstChar(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}
function parseLastWord(str, toLowerCase) {
	const word = _parseLastWord(str);
	if (!word) return word;
	return toLowerCase ? toLowerCaseFirstChar(word) : word;
}
function skipPrefix(str, prefix, toLowerCase) {
	if (!str) return str;
	let word;
	if (!prefix) word = str;
	else {
		const prefix2 = prefix.replace(/\./g, "");
		if (str.toLowerCase().startsWith(prefix2.toLowerCase())) word = str.substring(prefix2.length);
		else word = str;
	}
	return toLowerCase ? toLowerCaseFirstChar(word) : word;
}
function skipLastWord(str, lastWord, toLowerCase) {
	if (!str) return str;
	if (!lastWord) lastWord = parseLastWord(str);
	let word;
	if (str.toLowerCase().endsWith(lastWord.toLowerCase())) word = str.substring(0, str.length - lastWord.length);
	else word = str;
	return toLowerCase ? toLowerCaseFirstChar(word) : word;
}
function splitWords(str, toLowerCase, separator = " ") {
	if (!str) return str;
	let parts = [];
	let pos = str.length;
	for (let i = str.length - 1; i >= 0; i--) {
		const ch = str.charAt(i);
		if (ch >= "A" && ch <= "Z") {
			parts.unshift(str.substring(i, pos));
			pos = i;
		}
	}
	if (pos > 0) parts.unshift(str.substring(0, pos));
	if (toLowerCase) parts = parts.map((item) => toLowerCaseFirstChar(item));
	return parts.join(separator);
}
function replaceTemplate(content, scope) {
	if (!content) return content;
	if (!scope) return content;
	return content.toString().replace(/(\\)?\{\{ *([\w.]+) *\}\}/g, (block, skip, key) => {
		if (skip) return block.substring(skip.length);
		const value = getProperty(scope, key);
		return value !== void 0 ? value : "";
	});
}
function getProperty(obj, name, sep) {
	return _getProperty(obj, name, sep, false);
}
function _getProperty(obj, name, sep, forceObject) {
	if (!obj) return void 0;
	const names = name.split(sep || ".");
	for (const name of names) {
		if (obj[name] === void 0 || obj[name] === null) if (forceObject) obj[name] = {};
		else {
			obj = obj[name];
			break;
		}
		obj = obj[name];
	}
	return obj;
}
var init_src = __esmMin((() => {}));
//#endregion
export { skipPrefix as a, skipLastWord as i, parseLastWord as n, splitWords as o, replaceTemplate as r, toUpperCaseFirstChar as s, init_src as t };
