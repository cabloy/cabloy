

















































//#endregion
//#region .zova-rest/utils.ts
function ZovaCssBase(name) {
	return `cssBase:${name}`;
}
function ZovaCssMerge(...classes) {
	return classes;
}
function ZovaIconName(name) {
	return name;
}
function ZovaComponent(options) {
	if (!options.name) throw new Error("should specify the component name");
	return options.name;
}
function ZovaCommand(options) {
	if (!options.name) throw new Error("should specify the command name");
	return options.name.replace(":", ".command.");
}
function ZovaEvent(_options) {
	return "ZovaEvent";
}
function ZovaCommands(_options) {
	return "ZovaCommands";
}
const OrderLevelBaseMap = {
	core: 100,
	business: 1e3,
	max: 1e5
};
function _generalSchemaRest(schema, options, scene) {
	return schema.openapi(scene ? { rest: { [scene]: options } } : { rest: options });
}
function _order(order, level) {
	return OrderLevelBaseMap[level ?? "business"] + order;
}
function _toLowerCaseFirstChar(str) {
	return str.charAt(0).toLowerCase() + str.substring(1);
}
//#endregion
//#region .zova-rest/component.ts
function schemaRenderField(render, options, scene) {
	return function(schema) {
		return _generalSchemaRest(schema, options !== void 0 ? {
			render,
			options
		} : { render }, scene ?? "form");
	};
}
function schemaRenderFieldJsx(renderComponentJsx, scene) {
	return function(schema) {
		return _generalSchemaRest(schema, { render: renderComponentJsx }, scene ?? "form");
	};
}
function schemaRenderCell(render, options) {
	return function(schema) {
		return _generalSchemaRest(schema, options !== void 0 ? {
			render,
			columnProps: options
		} : { render }, "table");
	};
}
function schemaRenderCellJsx(renderComponentJsx, options) {
	return function(schema) {
		return _generalSchemaRest(schema, options !== void 0 ? {
			render: renderComponentJsx,
			columnProps: options
		} : { render: renderComponentJsx }, "table");
	};
}
function schemaRenderTableActionRow(render, options) {
	const pos = render.toString().indexOf(":action");
	return {
		$$typeof: "zova-jsx:actionRow",
		name: pos > -1 ? _toLowerCaseFirstChar(render.toString().substring(pos + 7)) : void 0,
		render,
		options
	};
}
function schemaRenderTableActionRowJsx(renderComponentJsx, options) {
	return {
		render: renderComponentJsx,
		options
	};
}
function schemaRenderFormActionRow(render, options) {
	const pos = render.toString().indexOf(":action");
	return {
		$$typeof: "zova-jsx:actionRow",
		name: pos > -1 ? _toLowerCaseFirstChar(render.toString().substring(pos + 7)) : void 0,
		render,
		options
	};
}
function schemaRenderFormActionRowJsx(renderComponentJsx, options) {
	return {
		render: renderComponentJsx,
		options
	};
}
function schemaRenderTableActionBulk(render, options) {
	const pos = render.toString().indexOf(":action");
	return {
		$$typeof: "zova-jsx:actionBulk",
		name: pos > -1 ? _toLowerCaseFirstChar(render.toString().substring(pos + 7)) : void 0,
		render,
		options
	};
}
function schemaRenderTableActionBulkJsx(renderComponentJsx, options) {
	return {
		render: renderComponentJsx,
		options
	};
}
function schemaRenderBlock(render, options) {
	return {
		$$typeof: "zova-jsx:block",
		render,
		options
	};
}
function schemaRenderBlockJsx(renderComponentJsx) {
	return { render: renderComponentJsx };
}
//#endregion
//#region .zova-rest/rest.ts
function schemaRenderLayout(layoutOptions, scene) {
	return function(schema) {
		return _generalSchemaRest(schema, { layout: layoutOptions }, scene);
	};
}
function schemaRenderVisible(visible = true, scene) {
	return function(schema) {
		return _generalSchemaRest(schema, { visible }, scene);
	};
}
function schemaRenderReadonly(readonly = true, scene) {
	return function(schema) {
		return _generalSchemaRest(schema, { readonly }, scene);
	};
}
function schemaRenderDisableNotifyChanged(disableNotifyChanged = true, scene) {
	return function(schema) {
		return _generalSchemaRest(schema, { disableNotifyChanged }, scene);
	};
}
function schemaRenderFieldSource(fieldSource, scene) {
	return function(schema) {
		return _generalSchemaRest(schema, { fieldSource }, scene);
	};
}
function schemaRenderOrder(order, level, scene) {
	const orderReal = _order(order, level);
	return function(schema) {
		return _generalSchemaRest(schema, { order: orderReal }, scene);
	};
}
//#endregion
//#region .zova-rest/render.ts
const ZovaRender = {
	layout: schemaRenderLayout,
	visible: schemaRenderVisible,
	readonly: schemaRenderReadonly,
	order: schemaRenderOrder,
	disableNotifyChanged: schemaRenderDisableNotifyChanged,
	fieldSource: schemaRenderFieldSource,
	field: schemaRenderField,
	fieldJsx: schemaRenderFieldJsx,
	cell: schemaRenderCell,
	cellJsx: schemaRenderCellJsx,
	tableActionRow: schemaRenderTableActionRow,
	tableActionRowJsx: schemaRenderTableActionRowJsx,
	formActionRow: schemaRenderFormActionRow,
	formActionRowJsx: schemaRenderFormActionRowJsx,
	tableActionBulk: schemaRenderTableActionBulk,
	tableActionBulkJsx: schemaRenderTableActionBulkJsx,
	block: schemaRenderBlock,
	blockJsx: schemaRenderBlockJsx
};
//#endregion
export { ZovaCommand, ZovaCommands, ZovaComponent, ZovaCssBase, ZovaCssMerge, ZovaEvent, ZovaIconName, ZovaRender };
