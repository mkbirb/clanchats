"use strict";
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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CurrentUserProvider: () => (/* binding */ CurrentUserProvider),\n/* harmony export */   useCurrentUser: () => (/* binding */ useCurrentUser)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst CurrentUserContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\n// Provider component\nfunction CurrentUserProvider({ children }) {\n    const [userID, setUserID] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);\n    const [roomID, setRoomID] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);\n    function changeRoomID(newRoomID) {\n        setRoomID(newRoomID);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CurrentUserContext.Provider, {\n        value: {\n            userID,\n            roomID,\n            changeRoomID\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\context\\\\CurrentUserContext.js\",\n        lineNumber: 15,\n        columnNumber: 7\n    }, this);\n}\n// Hook to use the context in components\nfunction useCurrentUser() {\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CurrentUserContext);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jb250ZXh0L0N1cnJlbnRVc2VyQ29udGV4dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQW1FO0FBRW5FLE1BQU1JLG1DQUFxQkgsb0RBQWFBO0FBRXhDLHFCQUFxQjtBQUNkLFNBQVNJLG9CQUFvQixFQUFFQyxRQUFRLEVBQUU7SUFDNUMsTUFBTSxDQUFDQyxRQUFRQyxVQUFVLEdBQUdMLCtDQUFRQSxDQUFDO0lBQ3JDLE1BQU0sQ0FBQ00sUUFBUUMsVUFBVSxHQUFHUCwrQ0FBUUEsQ0FBQztJQUVyQyxTQUFTUSxhQUFhQyxTQUFTO1FBQzdCRixVQUFVRTtJQUNaO0lBRUEscUJBQ0UsOERBQUNSLG1CQUFtQlMsUUFBUTtRQUFDQyxPQUFPO1lBQUVQO1lBQVFFO1lBQVFFO1FBQWE7a0JBQ2hFTDs7Ozs7O0FBR1A7QUFFQSx3Q0FBd0M7QUFDakMsU0FBU1M7SUFDZCxPQUFPYixpREFBVUEsQ0FBQ0U7QUFDcEIiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcdXNlclxcY2xhbnNjaGF0XFxzcmNcXGNvbnRleHRcXEN1cnJlbnRVc2VyQ29udGV4dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IEN1cnJlbnRVc2VyQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbi8vIFByb3ZpZGVyIGNvbXBvbmVudFxyXG5leHBvcnQgZnVuY3Rpb24gQ3VycmVudFVzZXJQcm92aWRlcih7IGNoaWxkcmVuIH0pIHtcclxuICAgIGNvbnN0IFt1c2VySUQsIHNldFVzZXJJRF0gPSB1c2VTdGF0ZSgxKTtcclxuICAgIGNvbnN0IFtyb29tSUQsIHNldFJvb21JRF0gPSB1c2VTdGF0ZSgxKTtcclxuICBcclxuICAgIGZ1bmN0aW9uIGNoYW5nZVJvb21JRChuZXdSb29tSUQpIHtcclxuICAgICAgc2V0Um9vbUlEKG5ld1Jvb21JRCk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8Q3VycmVudFVzZXJDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHVzZXJJRCwgcm9vbUlELCBjaGFuZ2VSb29tSUQgfX0+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgICA8L0N1cnJlbnRVc2VyQ29udGV4dC5Qcm92aWRlcj5cclxuICAgICk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIEhvb2sgdG8gdXNlIHRoZSBjb250ZXh0IGluIGNvbXBvbmVudHNcclxuICBleHBvcnQgZnVuY3Rpb24gdXNlQ3VycmVudFVzZXIoKSB7XHJcbiAgICByZXR1cm4gdXNlQ29udGV4dChDdXJyZW50VXNlckNvbnRleHQpO1xyXG4gIH0iXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZVN0YXRlIiwiQ3VycmVudFVzZXJDb250ZXh0IiwiQ3VycmVudFVzZXJQcm92aWRlciIsImNoaWxkcmVuIiwidXNlcklEIiwic2V0VXNlcklEIiwicm9vbUlEIiwic2V0Um9vbUlEIiwiY2hhbmdlUm9vbUlEIiwibmV3Um9vbUlEIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZUN1cnJlbnRVc2VyIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/context/CurrentUserContext.js\n");

/***/ }),

/***/ "(pages-dir-node)/./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _context_CurrentUserContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/CurrentUserContext */ \"(pages-dir-node)/./src/context/CurrentUserContext.js\");\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_CurrentUserContext__WEBPACK_IMPORTED_MODULE_1__.CurrentUserProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\pages\\\\_app.js\",\n            lineNumber: 6,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\pages\\\\_app.js\",\n        lineNumber: 5,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXFFO0FBRXRELFNBQVNDLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDbEQscUJBQ0UsOERBQUNILDRFQUFtQkE7a0JBQ2xCLDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHVzZXJcXGNsYW5zY2hhdFxcc3JjXFxwYWdlc1xcX2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDdXJyZW50VXNlclByb3ZpZGVyIH0gZnJvbSAgXCIuLi9jb250ZXh0L0N1cnJlbnRVc2VyQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPEN1cnJlbnRVc2VyUHJvdmlkZXIgPlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgIDwvQ3VycmVudFVzZXJQcm92aWRlciA+XG4gICk7XG59Il0sIm5hbWVzIjpbIkN1cnJlbnRVc2VyUHJvdmlkZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_app.js\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

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