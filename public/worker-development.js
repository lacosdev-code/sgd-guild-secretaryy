/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./worker/index.ts":
/*!*************************!*\
  !*** ./worker/index.ts ***!
  \*************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval(__webpack_require__.ts("/// <reference lib=\"webworker\" />\nconst _self = self;\n_self.addEventListener(\"push\", (event)=>{\n    if (event.data) {\n        try {\n            const data = event.data.json();\n            const options = {\n                body: data.body,\n                icon: data.icon || \"/icon.png\",\n                badge: data.badge || \"/icon.png\",\n                data: data.url || \"/\",\n                vibrate: [\n                    100,\n                    50,\n                    100\n                ],\n                requireInteraction: true\n            };\n            event.waitUntil(_self.registration.showNotification(data.title || \"SGD Notification\", options));\n        } catch (e) {\n            // Fallback for non-JSON payload\n            const options = {\n                body: event.data.text(),\n                icon: \"/icon.png\",\n                vibrate: [\n                    100,\n                    50,\n                    100\n                ]\n            };\n            event.waitUntil(_self.registration.showNotification(\"SGD Guild Center\", options));\n        }\n    }\n});\n_self.addEventListener(\"notificationclick\", (event)=>{\n    event.notification.close();\n    const urlToOpen = event.notification.data || \"/\";\n    event.waitUntil(_self.clients.matchAll({\n        type: \"window\",\n        includeUncontrolled: true\n    }).then((windowClients)=>{\n        for(let i = 0; i < windowClients.length; i++){\n            const client = windowClients[i];\n            if (client.url === urlToOpen && \"focus\" in client) {\n                return client.focus();\n            }\n        }\n        if (_self.clients.openWindow) {\n            return _self.clients.openWindow(urlToOpen);\n        }\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXgudHMiLCJtYXBwaW5ncyI6IkFBQUEsaUNBQWlDO0FBRWpDLE1BQU1BLFFBQVFDO0FBRWRELE1BQU1FLGdCQUFnQixDQUFDLFFBQVEsQ0FBQ0M7SUFDOUIsSUFBSUEsTUFBTUMsSUFBSSxFQUFFO1FBQ2QsSUFBSTtZQUNGLE1BQU1BLE9BQU9ELE1BQU1DLElBQUksQ0FBQ0MsSUFBSTtZQUU1QixNQUFNQyxVQUFlO2dCQUNuQkMsTUFBTUgsS0FBS0csSUFBSTtnQkFDZkMsTUFBTUosS0FBS0ksSUFBSSxJQUFJO2dCQUNuQkMsT0FBT0wsS0FBS0ssS0FBSyxJQUFJO2dCQUNyQkwsTUFBTUEsS0FBS00sR0FBRyxJQUFJO2dCQUNsQkMsU0FBUztvQkFBQztvQkFBSztvQkFBSTtpQkFBSTtnQkFDdkJDLG9CQUFvQjtZQUN0QjtZQUVBVCxNQUFNVSxTQUFTLENBQ2JiLE1BQU1jLFlBQVksQ0FBQ0MsZ0JBQWdCLENBQUNYLEtBQUtZLEtBQUssSUFBSSxvQkFBb0JWO1FBRTFFLEVBQUUsT0FBT1csR0FBRztZQUNWLGdDQUFnQztZQUNoQyxNQUFNWCxVQUFlO2dCQUNuQkMsTUFBTUosTUFBTUMsSUFBSSxDQUFDYyxJQUFJO2dCQUNyQlYsTUFBTTtnQkFDTkcsU0FBUztvQkFBQztvQkFBSztvQkFBSTtpQkFBSTtZQUN6QjtZQUNBUixNQUFNVSxTQUFTLENBQ2JiLE1BQU1jLFlBQVksQ0FBQ0MsZ0JBQWdCLENBQUMsb0JBQW9CVDtRQUU1RDtJQUNGO0FBQ0Y7QUFFQU4sTUFBTUUsZ0JBQWdCLENBQUMscUJBQXFCLENBQUNDO0lBQzNDQSxNQUFNZ0IsWUFBWSxDQUFDQyxLQUFLO0lBRXhCLE1BQU1DLFlBQVlsQixNQUFNZ0IsWUFBWSxDQUFDZixJQUFJLElBQUk7SUFFN0NELE1BQU1VLFNBQVMsQ0FDYmIsTUFBTXNCLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDO1FBQUVDLE1BQU07UUFBVUMscUJBQXFCO0lBQUssR0FBR0MsSUFBSSxDQUFDLENBQUNDO1FBQzFFLElBQUssSUFBSUMsSUFBSSxHQUFHQSxJQUFJRCxjQUFjRSxNQUFNLEVBQUVELElBQUs7WUFDN0MsTUFBTUUsU0FBU0gsYUFBYSxDQUFDQyxFQUFFO1lBQy9CLElBQUlFLE9BQU9wQixHQUFHLEtBQUtXLGFBQWEsV0FBV1MsUUFBUTtnQkFDakQsT0FBT0EsT0FBT0MsS0FBSztZQUNyQjtRQUNGO1FBQ0EsSUFBSS9CLE1BQU1zQixPQUFPLENBQUNVLFVBQVUsRUFBRTtZQUM1QixPQUFPaEMsTUFBTXNCLE9BQU8sQ0FBQ1UsVUFBVSxDQUFDWDtRQUNsQztJQUNGO0FBRUoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vd29ya2VyL2luZGV4LnRzP2VjYmUiXSwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgbGliPVwid2Vid29ya2VyXCIgLz5cblxuY29uc3QgX3NlbGYgPSBzZWxmIGFzIHVua25vd24gYXMgU2VydmljZVdvcmtlckdsb2JhbFNjb3BlO1xuXG5fc2VsZi5hZGRFdmVudExpc3RlbmVyKFwicHVzaFwiLCAoZXZlbnQpID0+IHtcbiAgaWYgKGV2ZW50LmRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGF0YSA9IGV2ZW50LmRhdGEuanNvbigpO1xuXG4gICAgICBjb25zdCBvcHRpb25zOiBhbnkgPSB7XG4gICAgICAgIGJvZHk6IGRhdGEuYm9keSxcbiAgICAgICAgaWNvbjogZGF0YS5pY29uIHx8IFwiL2ljb24ucG5nXCIsXG4gICAgICAgIGJhZGdlOiBkYXRhLmJhZGdlIHx8IFwiL2ljb24ucG5nXCIsXG4gICAgICAgIGRhdGE6IGRhdGEudXJsIHx8IFwiL1wiLFxuICAgICAgICB2aWJyYXRlOiBbMTAwLCA1MCwgMTAwXSxcbiAgICAgICAgcmVxdWlyZUludGVyYWN0aW9uOiB0cnVlLFxuICAgICAgfTtcblxuICAgICAgZXZlbnQud2FpdFVudGlsKFxuICAgICAgICBfc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbihkYXRhLnRpdGxlIHx8IFwiU0dEIE5vdGlmaWNhdGlvblwiLCBvcHRpb25zKVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBGYWxsYmFjayBmb3Igbm9uLUpTT04gcGF5bG9hZFxuICAgICAgY29uc3Qgb3B0aW9uczogYW55ID0ge1xuICAgICAgICBib2R5OiBldmVudC5kYXRhLnRleHQoKSxcbiAgICAgICAgaWNvbjogXCIvaWNvbi5wbmdcIixcbiAgICAgICAgdmlicmF0ZTogWzEwMCwgNTAsIDEwMF0sXG4gICAgICB9O1xuICAgICAgZXZlbnQud2FpdFVudGlsKFxuICAgICAgICBfc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbihcIlNHRCBHdWlsZCBDZW50ZXJcIiwgb3B0aW9ucylcbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxuX3NlbGYuYWRkRXZlbnRMaXN0ZW5lcihcIm5vdGlmaWNhdGlvbmNsaWNrXCIsIChldmVudCkgPT4ge1xuICBldmVudC5ub3RpZmljYXRpb24uY2xvc2UoKTtcblxuICBjb25zdCB1cmxUb09wZW4gPSBldmVudC5ub3RpZmljYXRpb24uZGF0YSB8fCBcIi9cIjtcblxuICBldmVudC53YWl0VW50aWwoXG4gICAgX3NlbGYuY2xpZW50cy5tYXRjaEFsbCh7IHR5cGU6IFwid2luZG93XCIsIGluY2x1ZGVVbmNvbnRyb2xsZWQ6IHRydWUgfSkudGhlbigod2luZG93Q2xpZW50cykgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dDbGllbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IHdpbmRvd0NsaWVudHNbaV07XG4gICAgICAgIGlmIChjbGllbnQudXJsID09PSB1cmxUb09wZW4gJiYgXCJmb2N1c1wiIGluIGNsaWVudCkge1xuICAgICAgICAgIHJldHVybiBjbGllbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF9zZWxmLmNsaWVudHMub3BlbldpbmRvdykge1xuICAgICAgICByZXR1cm4gX3NlbGYuY2xpZW50cy5vcGVuV2luZG93KHVybFRvT3Blbik7XG4gICAgICB9XG4gICAgfSlcbiAgKTtcbn0pO1xuIl0sIm5hbWVzIjpbIl9zZWxmIiwic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImRhdGEiLCJqc29uIiwib3B0aW9ucyIsImJvZHkiLCJpY29uIiwiYmFkZ2UiLCJ1cmwiLCJ2aWJyYXRlIiwicmVxdWlyZUludGVyYWN0aW9uIiwid2FpdFVudGlsIiwicmVnaXN0cmF0aW9uIiwic2hvd05vdGlmaWNhdGlvbiIsInRpdGxlIiwiZSIsInRleHQiLCJub3RpZmljYXRpb24iLCJjbG9zZSIsInVybFRvT3BlbiIsImNsaWVudHMiLCJtYXRjaEFsbCIsInR5cGUiLCJpbmNsdWRlVW5jb250cm9sbGVkIiwidGhlbiIsIndpbmRvd0NsaWVudHMiLCJpIiwibGVuZ3RoIiwiY2xpZW50IiwiZm9jdXMiLCJvcGVuV2luZG93Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./worker/index.ts\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: function(script) { return script; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	!function() {
/******/ 		__webpack_require__.ts = function(script) { return __webpack_require__.tt().createScript(script); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	!function() {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push(function(options) {
/******/ 			var originalFactory = options.factory;
/******/ 			options.factory = function(moduleObject, moduleExports, webpackRequire) {
/******/ 				var hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				var cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : function() {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./worker/index.ts");
/******/ 	
/******/ })()
;