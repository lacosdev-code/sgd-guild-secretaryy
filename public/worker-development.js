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

eval(__webpack_require__.ts("/// <reference lib=\"webworker\" />\nconst _self = self;\n_self.addEventListener(\"push\", (event)=>{\n    if (event.data) {\n        try {\n            const data = event.data.json();\n            const options = {\n                body: data.body,\n                icon: data.icon || \"/icon.png\",\n                badge: data.badge || \"/icon.png\",\n                data: data.url || \"/\",\n                vibrate: [\n                    100,\n                    50,\n                    100\n                ],\n                requireInteraction: true\n            };\n            event.waitUntil(_self.registration.showNotification(data.title || \"SGD Notification\", options));\n        } catch (e) {\n            // Fallback for non-JSON payload\n            const options = {\n                body: event.data.text(),\n                icon: \"/icon.png\",\n                vibrate: [\n                    100,\n                    50,\n                    100\n                ]\n            };\n            event.waitUntil(_self.registration.showNotification(\"SGD Guild Center\", options));\n        }\n    }\n});\n_self.addEventListener(\"notificationclick\", (event)=>{\n    event.notification.close();\n    const urlToOpen = event.notification.data || \"/\";\n    event.waitUntil(_self.clients.matchAll({\n        type: \"window\",\n        includeUncontrolled: true\n    }).then((windowClients)=>{\n        for(let i = 0; i < windowClients.length; i++){\n            const client = windowClients[i];\n            if (client.url === urlToOpen && \"focus\" in client) {\n                return client.focus();\n            }\n        }\n        if (_self.clients.openWindow) {\n            return _self.clients.openWindow(urlToOpen);\n        }\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXgudHMiLCJtYXBwaW5ncyI6IkFBQUEsaUNBQWlDO0FBRWpDLE1BQU1BLFFBQVFDO0FBRWRELE1BQU1FLGdCQUFnQixDQUFDLFFBQVEsQ0FBQ0M7SUFDOUIsSUFBSUEsTUFBTUMsSUFBSSxFQUFFO1FBQ2QsSUFBSTtZQUNGLE1BQU1BLE9BQU9ELE1BQU1DLElBQUksQ0FBQ0MsSUFBSTtZQUU1QixNQUFNQyxVQUErQjtnQkFDbkNDLE1BQU1ILEtBQUtHLElBQUk7Z0JBQ2ZDLE1BQU1KLEtBQUtJLElBQUksSUFBSTtnQkFDbkJDLE9BQU9MLEtBQUtLLEtBQUssSUFBSTtnQkFDckJMLE1BQU1BLEtBQUtNLEdBQUcsSUFBSTtnQkFDbEJDLFNBQVM7b0JBQUM7b0JBQUs7b0JBQUk7aUJBQUk7Z0JBQ3ZCQyxvQkFBb0I7WUFDdEI7WUFFQVQsTUFBTVUsU0FBUyxDQUNiYixNQUFNYyxZQUFZLENBQUNDLGdCQUFnQixDQUFDWCxLQUFLWSxLQUFLLElBQUksb0JBQW9CVjtRQUUxRSxFQUFFLE9BQU9XLEdBQUc7WUFDVixnQ0FBZ0M7WUFDaEMsTUFBTVgsVUFBK0I7Z0JBQ25DQyxNQUFNSixNQUFNQyxJQUFJLENBQUNjLElBQUk7Z0JBQ3JCVixNQUFNO2dCQUNORyxTQUFTO29CQUFDO29CQUFLO29CQUFJO2lCQUFJO1lBQ3pCO1lBQ0FSLE1BQU1VLFNBQVMsQ0FDYmIsTUFBTWMsWUFBWSxDQUFDQyxnQkFBZ0IsQ0FBQyxvQkFBb0JUO1FBRTVEO0lBQ0Y7QUFDRjtBQUVBTixNQUFNRSxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQ0M7SUFDM0NBLE1BQU1nQixZQUFZLENBQUNDLEtBQUs7SUFFeEIsTUFBTUMsWUFBWWxCLE1BQU1nQixZQUFZLENBQUNmLElBQUksSUFBSTtJQUU3Q0QsTUFBTVUsU0FBUyxDQUNiYixNQUFNc0IsT0FBTyxDQUFDQyxRQUFRLENBQUM7UUFBRUMsTUFBTTtRQUFVQyxxQkFBcUI7SUFBSyxHQUFHQyxJQUFJLENBQUMsQ0FBQ0M7UUFDMUUsSUFBSyxJQUFJQyxJQUFJLEdBQUdBLElBQUlELGNBQWNFLE1BQU0sRUFBRUQsSUFBSztZQUM3QyxNQUFNRSxTQUFTSCxhQUFhLENBQUNDLEVBQUU7WUFDL0IsSUFBSUUsT0FBT3BCLEdBQUcsS0FBS1csYUFBYSxXQUFXUyxRQUFRO2dCQUNqRCxPQUFPQSxPQUFPQyxLQUFLO1lBQ3JCO1FBQ0Y7UUFDQSxJQUFJL0IsTUFBTXNCLE9BQU8sQ0FBQ1UsVUFBVSxFQUFFO1lBQzVCLE9BQU9oQyxNQUFNc0IsT0FBTyxDQUFDVSxVQUFVLENBQUNYO1FBQ2xDO0lBQ0Y7QUFFSiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi93b3JrZXIvaW5kZXgudHM/ZWNiZSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBsaWI9XCJ3ZWJ3b3JrZXJcIiAvPlxuXG5jb25zdCBfc2VsZiA9IHNlbGYgYXMgdW5rbm93biBhcyBTZXJ2aWNlV29ya2VyR2xvYmFsU2NvcGU7XG5cbl9zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJwdXNoXCIsIChldmVudCkgPT4ge1xuICBpZiAoZXZlbnQuZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhID0gZXZlbnQuZGF0YS5qc29uKCk7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnM6IE5vdGlmaWNhdGlvbk9wdGlvbnMgPSB7XG4gICAgICAgIGJvZHk6IGRhdGEuYm9keSxcbiAgICAgICAgaWNvbjogZGF0YS5pY29uIHx8IFwiL2ljb24ucG5nXCIsXG4gICAgICAgIGJhZGdlOiBkYXRhLmJhZGdlIHx8IFwiL2ljb24ucG5nXCIsXG4gICAgICAgIGRhdGE6IGRhdGEudXJsIHx8IFwiL1wiLFxuICAgICAgICB2aWJyYXRlOiBbMTAwLCA1MCwgMTAwXSxcbiAgICAgICAgcmVxdWlyZUludGVyYWN0aW9uOiB0cnVlLFxuICAgICAgfTtcblxuICAgICAgZXZlbnQud2FpdFVudGlsKFxuICAgICAgICBfc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbihkYXRhLnRpdGxlIHx8IFwiU0dEIE5vdGlmaWNhdGlvblwiLCBvcHRpb25zKVxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBGYWxsYmFjayBmb3Igbm9uLUpTT04gcGF5bG9hZFxuICAgICAgY29uc3Qgb3B0aW9uczogTm90aWZpY2F0aW9uT3B0aW9ucyA9IHtcbiAgICAgICAgYm9keTogZXZlbnQuZGF0YS50ZXh0KCksXG4gICAgICAgIGljb246IFwiL2ljb24ucG5nXCIsXG4gICAgICAgIHZpYnJhdGU6IFsxMDAsIDUwLCAxMDBdLFxuICAgICAgfTtcbiAgICAgIGV2ZW50LndhaXRVbnRpbChcbiAgICAgICAgX3NlbGYucmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24oXCJTR0QgR3VpbGQgQ2VudGVyXCIsIG9wdGlvbnMpXG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG5cbl9zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJub3RpZmljYXRpb25jbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgZXZlbnQubm90aWZpY2F0aW9uLmNsb3NlKCk7XG5cbiAgY29uc3QgdXJsVG9PcGVuID0gZXZlbnQubm90aWZpY2F0aW9uLmRhdGEgfHwgXCIvXCI7XG5cbiAgZXZlbnQud2FpdFVudGlsKFxuICAgIF9zZWxmLmNsaWVudHMubWF0Y2hBbGwoeyB0eXBlOiBcIndpbmRvd1wiLCBpbmNsdWRlVW5jb250cm9sbGVkOiB0cnVlIH0pLnRoZW4oKHdpbmRvd0NsaWVudHMpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93Q2xpZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjbGllbnQgPSB3aW5kb3dDbGllbnRzW2ldO1xuICAgICAgICBpZiAoY2xpZW50LnVybCA9PT0gdXJsVG9PcGVuICYmIFwiZm9jdXNcIiBpbiBjbGllbnQpIHtcbiAgICAgICAgICByZXR1cm4gY2xpZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChfc2VsZi5jbGllbnRzLm9wZW5XaW5kb3cpIHtcbiAgICAgICAgcmV0dXJuIF9zZWxmLmNsaWVudHMub3BlbldpbmRvdyh1cmxUb09wZW4pO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG59KTtcbiJdLCJuYW1lcyI6WyJfc2VsZiIsInNlbGYiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJkYXRhIiwianNvbiIsIm9wdGlvbnMiLCJib2R5IiwiaWNvbiIsImJhZGdlIiwidXJsIiwidmlicmF0ZSIsInJlcXVpcmVJbnRlcmFjdGlvbiIsIndhaXRVbnRpbCIsInJlZ2lzdHJhdGlvbiIsInNob3dOb3RpZmljYXRpb24iLCJ0aXRsZSIsImUiLCJ0ZXh0Iiwibm90aWZpY2F0aW9uIiwiY2xvc2UiLCJ1cmxUb09wZW4iLCJjbGllbnRzIiwibWF0Y2hBbGwiLCJ0eXBlIiwiaW5jbHVkZVVuY29udHJvbGxlZCIsInRoZW4iLCJ3aW5kb3dDbGllbnRzIiwiaSIsImxlbmd0aCIsImNsaWVudCIsImZvY3VzIiwib3BlbldpbmRvdyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./worker/index.ts\n"));

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