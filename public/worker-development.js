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

eval(__webpack_require__.ts("/// <reference lib=\"webworker\" />\nconst _self = self;\n_self.addEventListener(\"push\", (event)=>{\n    if (event.data) {\n        try {\n            const data = event.data.json();\n            const options = {\n                body: data.body,\n                icon: data.icon || \"/icon.png\",\n                badge: data.badge || \"/icon.png\",\n                data: data.url || \"/dashboard\",\n                vibrate: [\n                    200,\n                    100,\n                    200\n                ],\n                requireInteraction: false,\n                silent: false,\n                tag: \"sgd-notification\",\n                renotify: true,\n                actions: [\n                    {\n                        action: \"open\",\n                        title: \"Buka →\"\n                    },\n                    {\n                        action: \"dismiss\",\n                        title: \"Tutup\"\n                    }\n                ]\n            };\n            event.waitUntil(_self.registration.showNotification(data.title || \"⚔ SGD Guild\", options));\n        } catch (e) {\n            // Fallback for non-JSON payload\n            const options = {\n                body: event.data.text(),\n                icon: \"/icon.png\",\n                vibrate: [\n                    200,\n                    100,\n                    200\n                ]\n            };\n            event.waitUntil(_self.registration.showNotification(\"SGD Guild Center\", options));\n        }\n    }\n});\n_self.addEventListener(\"notificationclick\", (event)=>{\n    event.notification.close();\n    if (event.action === \"dismiss\") return;\n    const urlToOpen = event.notification.data || \"/dashboard\";\n    event.waitUntil(_self.clients.matchAll({\n        type: \"window\",\n        includeUncontrolled: true\n    }).then((windowClients)=>{\n        for(let i = 0; i < windowClients.length; i++){\n            const client = windowClients[i];\n            if (\"focus\" in client) {\n                client.navigate(urlToOpen);\n                return client.focus();\n            }\n        }\n        if (_self.clients.openWindow) {\n            return _self.clients.openWindow(urlToOpen);\n        }\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXgudHMiLCJtYXBwaW5ncyI6IkFBQUEsaUNBQWlDO0FBRWpDLE1BQU1BLFFBQVFDO0FBRWRELE1BQU1FLGdCQUFnQixDQUFDLFFBQVEsQ0FBQ0M7SUFDOUIsSUFBSUEsTUFBTUMsSUFBSSxFQUFFO1FBQ2QsSUFBSTtZQUNGLE1BQU1BLE9BQU9ELE1BQU1DLElBQUksQ0FBQ0MsSUFBSTtZQUU1QixNQUFNQyxVQUFlO2dCQUNuQkMsTUFBTUgsS0FBS0csSUFBSTtnQkFDZkMsTUFBTUosS0FBS0ksSUFBSSxJQUFJO2dCQUNuQkMsT0FBT0wsS0FBS0ssS0FBSyxJQUFJO2dCQUNyQkwsTUFBTUEsS0FBS00sR0FBRyxJQUFJO2dCQUNsQkMsU0FBUztvQkFBQztvQkFBSztvQkFBSztpQkFBSTtnQkFDeEJDLG9CQUFvQjtnQkFDcEJDLFFBQVE7Z0JBQ1JDLEtBQUs7Z0JBQ0xDLFVBQVU7Z0JBQ1ZDLFNBQVM7b0JBQ1A7d0JBQ0VDLFFBQVE7d0JBQ1JDLE9BQU87b0JBQ1Q7b0JBQ0E7d0JBQ0VELFFBQVE7d0JBQ1JDLE9BQU87b0JBQ1Q7aUJBQ0Q7WUFDSDtZQUVBZixNQUFNZ0IsU0FBUyxDQUNibkIsTUFBTW9CLFlBQVksQ0FBQ0MsZ0JBQWdCLENBQUNqQixLQUFLYyxLQUFLLElBQUksZUFBZVo7UUFFckUsRUFBRSxPQUFPZ0IsR0FBRztZQUNWLGdDQUFnQztZQUNoQyxNQUFNaEIsVUFBZTtnQkFDbkJDLE1BQU1KLE1BQU1DLElBQUksQ0FBQ21CLElBQUk7Z0JBQ3JCZixNQUFNO2dCQUNORyxTQUFTO29CQUFDO29CQUFLO29CQUFLO2lCQUFJO1lBQzFCO1lBQ0FSLE1BQU1nQixTQUFTLENBQ2JuQixNQUFNb0IsWUFBWSxDQUFDQyxnQkFBZ0IsQ0FBQyxvQkFBb0JmO1FBRTVEO0lBQ0Y7QUFDRjtBQUVBTixNQUFNRSxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQ0M7SUFDM0NBLE1BQU1xQixZQUFZLENBQUNDLEtBQUs7SUFFeEIsSUFBSXRCLE1BQU1jLE1BQU0sS0FBSyxXQUFXO0lBRWhDLE1BQU1TLFlBQVl2QixNQUFNcUIsWUFBWSxDQUFDcEIsSUFBSSxJQUFJO0lBRTdDRCxNQUFNZ0IsU0FBUyxDQUNibkIsTUFBTTJCLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDO1FBQUVDLE1BQU07UUFBVUMscUJBQXFCO0lBQUssR0FBR0MsSUFBSSxDQUFDLENBQUNDO1FBQzFFLElBQUssSUFBSUMsSUFBSSxHQUFHQSxJQUFJRCxjQUFjRSxNQUFNLEVBQUVELElBQUs7WUFDN0MsTUFBTUUsU0FBU0gsYUFBYSxDQUFDQyxFQUFFO1lBQy9CLElBQUksV0FBV0UsUUFBUTtnQkFDckJBLE9BQU9DLFFBQVEsQ0FBQ1Y7Z0JBQ2hCLE9BQU9TLE9BQU9FLEtBQUs7WUFDckI7UUFDRjtRQUNBLElBQUlyQyxNQUFNMkIsT0FBTyxDQUFDVyxVQUFVLEVBQUU7WUFDNUIsT0FBT3RDLE1BQU0yQixPQUFPLENBQUNXLFVBQVUsQ0FBQ1o7UUFDbEM7SUFDRjtBQUVKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3dvcmtlci9pbmRleC50cz9lY2JlIl0sInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIGxpYj1cIndlYndvcmtlclwiIC8+XG5cbmNvbnN0IF9zZWxmID0gc2VsZiBhcyB1bmtub3duIGFzIFNlcnZpY2VXb3JrZXJHbG9iYWxTY29wZTtcblxuX3NlbGYuYWRkRXZlbnRMaXN0ZW5lcihcInB1c2hcIiwgKGV2ZW50KSA9PiB7XG4gIGlmIChldmVudC5kYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhLmpzb24oKTtcblxuICAgICAgY29uc3Qgb3B0aW9uczogYW55ID0ge1xuICAgICAgICBib2R5OiBkYXRhLmJvZHksXG4gICAgICAgIGljb246IGRhdGEuaWNvbiB8fCBcIi9pY29uLnBuZ1wiLFxuICAgICAgICBiYWRnZTogZGF0YS5iYWRnZSB8fCBcIi9pY29uLnBuZ1wiLFxuICAgICAgICBkYXRhOiBkYXRhLnVybCB8fCBcIi9kYXNoYm9hcmRcIixcbiAgICAgICAgdmlicmF0ZTogWzIwMCwgMTAwLCAyMDBdLFxuICAgICAgICByZXF1aXJlSW50ZXJhY3Rpb246IGZhbHNlLFxuICAgICAgICBzaWxlbnQ6IGZhbHNlLFxuICAgICAgICB0YWc6IFwic2dkLW5vdGlmaWNhdGlvblwiLFxuICAgICAgICByZW5vdGlmeTogdHJ1ZSxcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFjdGlvbjogXCJvcGVuXCIsXG4gICAgICAgICAgICB0aXRsZTogXCJCdWthIOKGklwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uOiBcImRpc21pc3NcIixcbiAgICAgICAgICAgIHRpdGxlOiBcIlR1dHVwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG5cbiAgICAgIGV2ZW50LndhaXRVbnRpbChcbiAgICAgICAgX3NlbGYucmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24oZGF0YS50aXRsZSB8fCBcIuKalCBTR0QgR3VpbGRcIiwgb3B0aW9ucylcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gRmFsbGJhY2sgZm9yIG5vbi1KU09OIHBheWxvYWRcbiAgICAgIGNvbnN0IG9wdGlvbnM6IGFueSA9IHtcbiAgICAgICAgYm9keTogZXZlbnQuZGF0YS50ZXh0KCksXG4gICAgICAgIGljb246IFwiL2ljb24ucG5nXCIsXG4gICAgICAgIHZpYnJhdGU6IFsyMDAsIDEwMCwgMjAwXSxcbiAgICAgIH07XG4gICAgICBldmVudC53YWl0VW50aWwoXG4gICAgICAgIF9zZWxmLnJlZ2lzdHJhdGlvbi5zaG93Tm90aWZpY2F0aW9uKFwiU0dEIEd1aWxkIENlbnRlclwiLCBvcHRpb25zKVxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5fc2VsZi5hZGRFdmVudExpc3RlbmVyKFwibm90aWZpY2F0aW9uY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gIGV2ZW50Lm5vdGlmaWNhdGlvbi5jbG9zZSgpO1xuXG4gIGlmIChldmVudC5hY3Rpb24gPT09IFwiZGlzbWlzc1wiKSByZXR1cm47XG5cbiAgY29uc3QgdXJsVG9PcGVuID0gZXZlbnQubm90aWZpY2F0aW9uLmRhdGEgfHwgXCIvZGFzaGJvYXJkXCI7XG5cbiAgZXZlbnQud2FpdFVudGlsKFxuICAgIF9zZWxmLmNsaWVudHMubWF0Y2hBbGwoeyB0eXBlOiBcIndpbmRvd1wiLCBpbmNsdWRlVW5jb250cm9sbGVkOiB0cnVlIH0pLnRoZW4oKHdpbmRvd0NsaWVudHMpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93Q2xpZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjbGllbnQgPSB3aW5kb3dDbGllbnRzW2ldO1xuICAgICAgICBpZiAoXCJmb2N1c1wiIGluIGNsaWVudCkge1xuICAgICAgICAgIGNsaWVudC5uYXZpZ2F0ZSh1cmxUb09wZW4pO1xuICAgICAgICAgIHJldHVybiBjbGllbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKF9zZWxmLmNsaWVudHMub3BlbldpbmRvdykge1xuICAgICAgICByZXR1cm4gX3NlbGYuY2xpZW50cy5vcGVuV2luZG93KHVybFRvT3Blbik7XG4gICAgICB9XG4gICAgfSlcbiAgKTtcbn0pO1xuIl0sIm5hbWVzIjpbIl9zZWxmIiwic2VsZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImRhdGEiLCJqc29uIiwib3B0aW9ucyIsImJvZHkiLCJpY29uIiwiYmFkZ2UiLCJ1cmwiLCJ2aWJyYXRlIiwicmVxdWlyZUludGVyYWN0aW9uIiwic2lsZW50IiwidGFnIiwicmVub3RpZnkiLCJhY3Rpb25zIiwiYWN0aW9uIiwidGl0bGUiLCJ3YWl0VW50aWwiLCJyZWdpc3RyYXRpb24iLCJzaG93Tm90aWZpY2F0aW9uIiwiZSIsInRleHQiLCJub3RpZmljYXRpb24iLCJjbG9zZSIsInVybFRvT3BlbiIsImNsaWVudHMiLCJtYXRjaEFsbCIsInR5cGUiLCJpbmNsdWRlVW5jb250cm9sbGVkIiwidGhlbiIsIndpbmRvd0NsaWVudHMiLCJpIiwibGVuZ3RoIiwiY2xpZW50IiwibmF2aWdhdGUiLCJmb2N1cyIsIm9wZW5XaW5kb3ciXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./worker/index.ts\n"));

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