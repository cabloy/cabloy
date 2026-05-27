import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { K as cast, j as BeanBase, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { a as Command, i as BeanCommandBulkBase, r as BeanCommandRowBase, t as init_src$3 } from "./a-command-DLmoG0nx.js";
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.alert.tsx
var _dec$8, _dec2$8, _class$8, CommandAlert;
var init_command_alert = __esmMin((() => {
	init_src$1();
	init_src$3();
	CommandAlert = (_dec$8 = Command({ wait: true }), _dec2$8 = BeanInfo({ module: "basic-commands" }), _dec$8(_class$8 = _dec2$8(_class$8 = class CommandAlert extends BeanBase {
		execute(options, _renderContext, next) {
			if (options.wait) window.alert(options.message);
			else setTimeout(() => {
				window.alert(options.message);
			}, 0);
			return next();
		}
	}) || _class$8) || _class$8);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.confirm.tsx
var _dec$7, _dec2$7, _class$7, CommandConfirm;
var init_command_confirm = __esmMin((() => {
	init_src$1();
	init_src$3();
	CommandConfirm = (_dec$7 = Command(), _dec2$7 = BeanInfo({ module: "basic-commands" }), _dec$7(_class$7 = _dec2$7(_class$7 = class CommandConfirm extends BeanBase {
		execute(options, _renderContext, next) {
			return next(window.confirm(options.message));
		}
	}) || _class$7) || _class$7);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.copy.tsx
var _dec$6, _dec2$6, _class$6, CommandCopy;
var init_command_copy = __esmMin((() => {
	init_src$1();
	init_src$3();
	CommandCopy = (_dec$6 = Command(), _dec2$6 = BeanInfo({ module: "basic-commands" }), _dec$6(_class$6 = _dec2$6(_class$6 = class CommandCopy extends BeanBase {
		execute(options, _renderContext, next) {
			return next(navigator.clipboard.writeText(options.text));
		}
	}) || _class$6) || _class$6);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.create.tsx
var _dec$5, _dec2$5, _class$5, CommandCreate;
var init_command_create = __esmMin((() => {
	init_src$1();
	init_src$3();
	CommandCreate = (_dec$5 = Command(), _dec2$5 = BeanInfo({ module: "basic-commands" }), _dec$5(_class$5 = _dec2$5(_class$5 = class CommandCreate extends BeanCommandBulkBase {
		execute(options, renderContext, next) {
			const { resource } = this.getResource(options, renderContext);
			const { $host } = renderContext;
			const url = $host.$router.getPagePath("/rest/resource/:resource/create", { params: { resource } });
			if (options.replace) $host.$router.replace(url);
			else $host.$router.push(url);
			return next();
		}
	}) || _class$5) || _class$5);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.delete.tsx
var _dec$4, _dec2$4, _class$4, CommandDelete;
var init_command_delete = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	CommandDelete = (_dec$4 = Command(), _dec2$4 = BeanInfo({ module: "basic-commands" }), _dec$4(_class$4 = _dec2$4(_class$4 = class CommandDelete extends BeanCommandRowBase {
		execute(options, renderContext, next) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const { resource, id } = _this.getResourceAndId(options, renderContext);
				const { ctx } = renderContext;
				yield (yield ctx.bean._getBeanSelector("rest-resource.model.resource", true, resource)).delete(id).mutateAsync();
				return next();
			})();
		}
	}) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.edit.tsx
var _dec$3, _dec2$3, _class$3, CommandEdit;
var init_command_edit = __esmMin((() => {
	init_src$1();
	init_src$3();
	CommandEdit = (_dec$3 = Command(), _dec2$3 = BeanInfo({ module: "basic-commands" }), _dec$3(_class$3 = _dec2$3(_class$3 = class CommandEdit extends BeanCommandRowBase {
		execute(options, renderContext, next) {
			const { resource, id } = this.getResourceAndId(options, renderContext);
			const { $host } = renderContext;
			const url = $host.$router.getPagePath("/rest/resource/:resource/:id/:formScene?", { params: {
				resource,
				id: id.toString(),
				formScene: "edit"
			} });
			if (options.replace) $host.$router.replace(url);
			else $host.$router.push(url);
			return next();
		}
	}) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.setValue.tsx
var _dec$2, _dec2$2, _class$2, CommandSetValue;
var init_command_setValue = __esmMin((() => {
	init_src$1();
	init_src$3();
	CommandSetValue = (_dec$2 = Command(), _dec2$2 = BeanInfo({ module: "basic-commands" }), _dec$2(_class$2 = _dec2$2(_class$2 = class CommandSetValue extends BeanBase {
		execute(options, renderContext, next) {
			if (renderContext.$scene === "formField") {
				var _options$name, _cast, _$jsx$event;
				const { $celScope, $jsx, $$form } = renderContext;
				const name = (_options$name = options.name) !== null && _options$name !== void 0 ? _options$name : $celScope.name;
				const value = options.value !== void 0 ? options.value : (_cast = cast((_$jsx$event = $jsx.event) === null || _$jsx$event === void 0 ? void 0 : _$jsx$event.target)) === null || _cast === void 0 ? void 0 : _cast.value;
				$$form.setFieldValue(name, value, options.disableNotifyChanged);
			}
			return next();
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.view.tsx
var _dec$1, _dec2$1, _class$1, CommandView;
var init_command_view = __esmMin((() => {
	init_src$1();
	init_src$3();
	CommandView = (_dec$1 = Command(), _dec2$1 = BeanInfo({ module: "basic-commands" }), _dec$1(_class$1 = _dec2$1(_class$1 = class CommandView extends BeanCommandRowBase {
		execute(options, renderContext, next) {
			const { resource, id } = this.getResourceAndId(options, renderContext);
			const { $host } = renderContext;
			const url = $host.$router.getPagePath("/rest/resource/:resource/:id/:formScene?", { params: {
				resource,
				id: id.toString()
			} });
			if (options.replace) $host.$router.replace(url);
			else $host.$router.push(url);
			return next();
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/.metadata/index.ts
/** command: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleBasicCommands;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_command_alert();
	init_command_confirm();
	init_command_copy();
	init_command_create();
	init_command_delete();
	init_command_edit();
	init_command_setValue();
	init_command_view();
	init_src$3();
	init_src$2();
	ScopeModuleBasicCommands = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-commands" }), _dec(_class = _dec2(_class = class ScopeModuleBasicCommands extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	CommandAlert: () => CommandAlert,
	CommandConfirm: () => CommandConfirm,
	CommandCopy: () => CommandCopy,
	CommandCreate: () => CommandCreate,
	CommandDelete: () => CommandDelete,
	CommandEdit: () => CommandEdit,
	CommandSetValue: () => CommandSetValue,
	CommandView: () => CommandView,
	ScopeModuleBasicCommands: () => ScopeModuleBasicCommands
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };
