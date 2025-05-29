/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./src/layouts/Header.js":
/*!*******************************!*\
  !*** ./src/layouts/Header.js ***!
  \*******************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports on update so we can compare the boundary
                // signatures.
                module.hot.dispose(function (data) {
                    data.prevExports = currentExports;
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevExports !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevExports !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "./src/layouts/Layout.js":
/*!*******************************!*\
  !*** ./src/layouts/Layout.js ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! aos */ \"./node_modules/aos/dist/aos.js\");\n/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_nice_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-nice-select */ \"./node_modules/react-nice-select/index.js\");\n/* harmony import */ var react_nice_select__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_nice_select__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_VideoPopup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/VideoPopup */ \"./src/components/VideoPopup.js\");\n/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Footer */ \"./src/layouts/Footer.js\");\n/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Header */ \"./src/layouts/Header.js\");\n/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_Header__WEBPACK_IMPORTED_MODULE_6__);\n\nvar _s = $RefreshSig$();\n\n\n\n\n\n\nconst Layout = (param)=>{\n    let { children, headerExtaClass } = param;\n    _s();\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        aos__WEBPACK_IMPORTED_MODULE_1___default().init();\n        react_nice_select__WEBPACK_IMPORTED_MODULE_3___default()();\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_VideoPopup__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {}, void 0, false, {\n                fileName: \"/Users/rohitganguly/Desktop/blindFoodOrder/src/layouts/Layout.js\",\n                lineNumber: 14,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_Header__WEBPACK_IMPORTED_MODULE_6___default()), {\n                extraClass: headerExtaClass\n            }, void 0, false, {\n                fileName: \"/Users/rohitganguly/Desktop/blindFoodOrder/src/layouts/Layout.js\",\n                lineNumber: 15,\n                columnNumber: 7\n            }, undefined),\n            children,\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Footer__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {}, void 0, false, {\n                fileName: \"/Users/rohitganguly/Desktop/blindFoodOrder/src/layouts/Layout.js\",\n                lineNumber: 17,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/rohitganguly/Desktop/blindFoodOrder/src/layouts/Layout.js\",\n        lineNumber: 13,\n        columnNumber: 5\n    }, undefined);\n};\n_s(Layout, \"OD7bBpZva5O2jO+Puf00hKivP7c=\");\n_c = Layout;\n/* harmony default export */ __webpack_exports__[\"default\"] = (Layout);\nvar _c;\n$RefreshReg$(_c, \"Layout\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGF5b3V0cy9MYXlvdXQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNCO0FBQ3NCO0FBQ0Q7QUFDTztBQUNwQjtBQUNBO0FBQzlCLE1BQU1PLFNBQVM7UUFBQyxFQUFFQyxRQUFRLEVBQUVDLGVBQWUsRUFBRTs7SUFDM0NQLGdEQUFTQSxDQUFDO1FBQ1JGLCtDQUFRO1FBQ1JHLHdEQUFVQTtJQUNaLEdBQUcsRUFBRTtJQUNMLHFCQUNFLDhEQUFDRiwyQ0FBUUE7OzBCQUNQLDhEQUFDRyw4REFBVUE7Ozs7OzBCQUNYLDhEQUFDRSxnREFBTUE7Z0JBQUNLLFlBQVlGOzs7Ozs7WUFDbkJEOzBCQUNELDhEQUFDSCwrQ0FBTUE7Ozs7Ozs7Ozs7O0FBR2I7R0FiTUU7S0FBQUE7QUFjTiwrREFBZUEsTUFBTUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvbGF5b3V0cy9MYXlvdXQuanM/YmZkZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW9zIGZyb20gXCJhb3NcIjtcclxuaW1wb3J0IHsgRnJhZ21lbnQsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgbmljZVNlbGVjdCBmcm9tIFwicmVhY3QtbmljZS1zZWxlY3RcIjtcclxuaW1wb3J0IFZpZGVvUG9wdXAgZnJvbSBcIi4uL2NvbXBvbmVudHMvVmlkZW9Qb3B1cFwiO1xyXG5pbXBvcnQgRm9vdGVyIGZyb20gXCIuL0Zvb3RlclwiO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gXCIuL0hlYWRlclwiO1xyXG5jb25zdCBMYXlvdXQgPSAoeyBjaGlsZHJlbiwgaGVhZGVyRXh0YUNsYXNzIH0pID0+IHtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgQW9zLmluaXQoKTtcclxuICAgIG5pY2VTZWxlY3QoKTtcclxuICB9LCBbXSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxGcmFnbWVudD5cclxuICAgICAgPFZpZGVvUG9wdXAgLz5cclxuICAgICAgPEhlYWRlciBleHRyYUNsYXNzPXtoZWFkZXJFeHRhQ2xhc3N9IC8+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgPEZvb3RlciAvPlxyXG4gICAgPC9GcmFnbWVudD5cclxuICApO1xyXG59O1xyXG5leHBvcnQgZGVmYXVsdCBMYXlvdXQ7XHJcbiJdLCJuYW1lcyI6WyJBb3MiLCJGcmFnbWVudCIsInVzZUVmZmVjdCIsIm5pY2VTZWxlY3QiLCJWaWRlb1BvcHVwIiwiRm9vdGVyIiwiSGVhZGVyIiwiTGF5b3V0IiwiY2hpbGRyZW4iLCJoZWFkZXJFeHRhQ2xhc3MiLCJpbml0IiwiZXh0cmFDbGFzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/layouts/Layout.js\n"));

/***/ })

});