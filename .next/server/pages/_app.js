/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./src/context/CurrentUserContext.js":
/*!*******************************************!*\
  !*** ./src/context/CurrentUserContext.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CurrentUserProvider: () => (/* binding */ CurrentUserProvider),\n/* harmony export */   useCurrentUser: () => (/* binding */ useCurrentUser)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst CurrentUserContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\n// Provider component\nfunction CurrentUserProvider({ children }) {\n    const [userID, setUserID] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);\n    const [roomID, setRoomID] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    function changeRoomID(newRoomID) {\n        setRoomID(newRoomID);\n    }\n    function changeUser(newUser) {\n        setUser(newUser);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CurrentUserContext.Provider, {\n        value: {\n            userID,\n            roomID,\n            user,\n            changeRoomID,\n            changeUser\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\context\\\\CurrentUserContext.js\",\n        lineNumber: 20,\n        columnNumber: 7\n    }, this);\n}\n// Hook to use the context in components\nfunction useCurrentUser() {\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CurrentUserContext);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jb250ZXh0L0N1cnJlbnRVc2VyQ29udGV4dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQW1FO0FBRW5FLE1BQU1JLG1DQUFxQkgsb0RBQWFBO0FBRXhDLHFCQUFxQjtBQUNkLFNBQVNJLG9CQUFvQixFQUFFQyxRQUFRLEVBQUU7SUFDNUMsTUFBTSxDQUFDQyxRQUFRQyxVQUFVLEdBQUdMLCtDQUFRQSxDQUFDO0lBQ3JDLE1BQU0sQ0FBQ00sUUFBUUMsVUFBVSxHQUFHUCwrQ0FBUUEsQ0FBQztJQUNyQyxNQUFNLENBQUNRLE1BQU1DLFFBQVEsR0FBR1QsK0NBQVFBLENBQUM7SUFFakMsU0FBU1UsYUFBYUMsU0FBUztRQUM3QkosVUFBVUk7SUFDWjtJQUVBLFNBQVNDLFdBQVdDLE9BQU87UUFDekJKLFFBQVFJO0lBQ1Y7SUFFQSxxQkFDRSw4REFBQ1osbUJBQW1CYSxRQUFRO1FBQUNDLE9BQU87WUFBRVg7WUFBUUU7WUFBUUU7WUFBTUU7WUFBY0U7UUFBVztrQkFDbEZUOzs7Ozs7QUFHUDtBQUVBLHdDQUF3QztBQUNqQyxTQUFTYTtJQUNkLE9BQU9qQixpREFBVUEsQ0FBQ0U7QUFDcEIiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcdXNlclxcY2xhbnNjaGF0XFxzcmNcXGNvbnRleHRcXEN1cnJlbnRVc2VyQ29udGV4dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IEN1cnJlbnRVc2VyQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbi8vIFByb3ZpZGVyIGNvbXBvbmVudFxyXG5leHBvcnQgZnVuY3Rpb24gQ3VycmVudFVzZXJQcm92aWRlcih7IGNoaWxkcmVuIH0pIHtcclxuICAgIGNvbnN0IFt1c2VySUQsIHNldFVzZXJJRF0gPSB1c2VTdGF0ZSgxKTtcclxuICAgIGNvbnN0IFtyb29tSUQsIHNldFJvb21JRF0gPSB1c2VTdGF0ZSgxKTtcclxuICAgIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG4gIFxyXG4gICAgZnVuY3Rpb24gY2hhbmdlUm9vbUlEKG5ld1Jvb21JRCkge1xyXG4gICAgICBzZXRSb29tSUQobmV3Um9vbUlEKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGFuZ2VVc2VyKG5ld1VzZXIpIHtcclxuICAgICAgc2V0VXNlcihuZXdVc2VyKTtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxDdXJyZW50VXNlckNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgdXNlcklELCByb29tSUQsIHVzZXIsIGNoYW5nZVJvb21JRCwgY2hhbmdlVXNlciB9fT5cclxuICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgIDwvQ3VycmVudFVzZXJDb250ZXh0LlByb3ZpZGVyPlxyXG4gICAgKTtcclxuICB9XHJcbiAgXHJcbiAgLy8gSG9vayB0byB1c2UgdGhlIGNvbnRleHQgaW4gY29tcG9uZW50c1xyXG4gIGV4cG9ydCBmdW5jdGlvbiB1c2VDdXJyZW50VXNlcigpIHtcclxuICAgIHJldHVybiB1c2VDb250ZXh0KEN1cnJlbnRVc2VyQ29udGV4dCk7XHJcbiAgfSJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJDdXJyZW50VXNlckNvbnRleHQiLCJDdXJyZW50VXNlclByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ1c2VySUQiLCJzZXRVc2VySUQiLCJyb29tSUQiLCJzZXRSb29tSUQiLCJ1c2VyIiwic2V0VXNlciIsImNoYW5nZVJvb21JRCIsIm5ld1Jvb21JRCIsImNoYW5nZVVzZXIiLCJuZXdVc2VyIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZUN1cnJlbnRVc2VyIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/context/CurrentUserContext.js\n");

/***/ }),

/***/ "(pages-dir-node)/./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _context_CurrentUserContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/CurrentUserContext */ \"(pages-dir-node)/./src/context/CurrentUserContext.js\");\n/* harmony import */ var _styles_Globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/Globals.css */ \"(pages-dir-node)/./src/styles/Globals.css\");\n/* harmony import */ var _styles_Globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_Globals_css__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_CurrentUserContext__WEBPACK_IMPORTED_MODULE_1__.CurrentUserProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\pages\\\\_app.js\",\n            lineNumber: 7,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\pages\\\\_app.js\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBcUU7QUFDdEM7QUFFaEIsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxxQkFDRSw4REFBQ0gsNEVBQW1CQTtrQkFDbEIsNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcdXNlclxcY2xhbnNjaGF0XFxzcmNcXHBhZ2VzXFxfYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEN1cnJlbnRVc2VyUHJvdmlkZXIgfSBmcm9tICBcIi4uL2NvbnRleHQvQ3VycmVudFVzZXJDb250ZXh0XCI7XG5pbXBvcnQgXCIuLi9zdHlsZXMvR2xvYmFscy5jc3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuICByZXR1cm4gKFxuICAgIDxDdXJyZW50VXNlclByb3ZpZGVyID5cbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICA8L0N1cnJlbnRVc2VyUHJvdmlkZXIgPlxuICApO1xufSJdLCJuYW1lcyI6WyJDdXJyZW50VXNlclByb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./src/styles/Globals.css":
/*!********************************!*\
  !*** ./src/styles/Globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./src/pages/_app.js"));
module.exports = __webpack_exports__;

})();