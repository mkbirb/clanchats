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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CurrentUserProvider: () => (/* binding */ CurrentUserProvider),\n/* harmony export */   useCurrentUser: () => (/* binding */ useCurrentUser)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst CurrentUserContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\n// Provider component\nfunction CurrentUserProvider({ children }) {\n    const [userID, setUserID] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();\n    const [roomID, setRoomID] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    function changeRoomID(newRoomID) {\n        setRoomID(newRoomID);\n    }\n    function changeUser(newUser) {\n        setUser(newUser);\n        console.log(\"Head \", newUser.id);\n        setUserID(newUser.id);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CurrentUserContext.Provider, {\n        value: {\n            userID,\n            roomID,\n            user,\n            changeRoomID,\n            changeUser\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\context\\\\CurrentUserContext.js\",\n        lineNumber: 22,\n        columnNumber: 7\n    }, this);\n}\n// Hook to use the context in components\nfunction useCurrentUser() {\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CurrentUserContext);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jb250ZXh0L0N1cnJlbnRVc2VyQ29udGV4dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQW1FO0FBRW5FLE1BQU1JLG1DQUFxQkgsb0RBQWFBO0FBRXhDLHFCQUFxQjtBQUNkLFNBQVNJLG9CQUFvQixFQUFFQyxRQUFRLEVBQUU7SUFDNUMsTUFBTSxDQUFDQyxRQUFRQyxVQUFVLEdBQUdMLCtDQUFRQTtJQUNwQyxNQUFNLENBQUNNLFFBQVFDLFVBQVUsR0FBR1AsK0NBQVFBO0lBQ3BDLE1BQU0sQ0FBQ1EsTUFBTUMsUUFBUSxHQUFHVCwrQ0FBUUEsQ0FBQztJQUVqQyxTQUFTVSxhQUFhQyxTQUFTO1FBQzdCSixVQUFVSTtJQUNaO0lBRUEsU0FBU0MsV0FBV0MsT0FBTztRQUN6QkosUUFBUUk7UUFDUkMsUUFBUUMsR0FBRyxDQUFDLFNBQVNGLFFBQVFHLEVBQUU7UUFDL0JYLFVBQVVRLFFBQVFHLEVBQUU7SUFDdEI7SUFFQSxxQkFDRSw4REFBQ2YsbUJBQW1CZ0IsUUFBUTtRQUFDQyxPQUFPO1lBQUVkO1lBQVFFO1lBQVFFO1lBQU1FO1lBQWNFO1FBQVc7a0JBQ2xGVDs7Ozs7O0FBR1A7QUFFQSx3Q0FBd0M7QUFDakMsU0FBU2dCO0lBQ2QsT0FBT3BCLGlEQUFVQSxDQUFDRTtBQUNwQiIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFx1c2VyXFxjbGFuc2NoYXRcXHNyY1xcY29udGV4dFxcQ3VycmVudFVzZXJDb250ZXh0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgQ3VycmVudFVzZXJDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xyXG5cclxuLy8gUHJvdmlkZXIgY29tcG9uZW50XHJcbmV4cG9ydCBmdW5jdGlvbiBDdXJyZW50VXNlclByb3ZpZGVyKHsgY2hpbGRyZW4gfSkge1xyXG4gICAgY29uc3QgW3VzZXJJRCwgc2V0VXNlcklEXSA9IHVzZVN0YXRlKCk7XHJcbiAgICBjb25zdCBbcm9vbUlELCBzZXRSb29tSURdID0gdXNlU3RhdGUoKTtcclxuICAgIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG4gIFxyXG4gICAgZnVuY3Rpb24gY2hhbmdlUm9vbUlEKG5ld1Jvb21JRCkge1xyXG4gICAgICBzZXRSb29tSUQobmV3Um9vbUlEKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGFuZ2VVc2VyKG5ld1VzZXIpIHtcclxuICAgICAgc2V0VXNlcihuZXdVc2VyKTtcclxuICAgICAgY29uc29sZS5sb2coXCJIZWFkIFwiLCBuZXdVc2VyLmlkKTtcclxuICAgICAgc2V0VXNlcklEKG5ld1VzZXIuaWQpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEN1cnJlbnRVc2VyQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17eyB1c2VySUQsIHJvb21JRCwgdXNlciwgY2hhbmdlUm9vbUlELCBjaGFuZ2VVc2VyIH19PlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgPC9DdXJyZW50VXNlckNvbnRleHQuUHJvdmlkZXI+XHJcbiAgICApO1xyXG4gIH1cclxuICBcclxuICAvLyBIb29rIHRvIHVzZSB0aGUgY29udGV4dCBpbiBjb21wb25lbnRzXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIHVzZUN1cnJlbnRVc2VyKCkge1xyXG4gICAgcmV0dXJuIHVzZUNvbnRleHQoQ3VycmVudFVzZXJDb250ZXh0KTtcclxuICB9Il0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VTdGF0ZSIsIkN1cnJlbnRVc2VyQ29udGV4dCIsIkN1cnJlbnRVc2VyUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZXJJRCIsInNldFVzZXJJRCIsInJvb21JRCIsInNldFJvb21JRCIsInVzZXIiLCJzZXRVc2VyIiwiY2hhbmdlUm9vbUlEIiwibmV3Um9vbUlEIiwiY2hhbmdlVXNlciIsIm5ld1VzZXIiLCJjb25zb2xlIiwibG9nIiwiaWQiLCJQcm92aWRlciIsInZhbHVlIiwidXNlQ3VycmVudFVzZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/context/CurrentUserContext.js\n");

/***/ }),

/***/ "(pages-dir-node)/./src/context/ReplyContext.js":
/*!*************************************!*\
  !*** ./src/context/ReplyContext.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ReplyContext: () => (/* binding */ ReplyContext),\n/* harmony export */   ReplyProvider: () => (/* binding */ ReplyProvider)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n// Context, so the Reply States can be shared.\n\n\nconst ReplyContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst ReplyProvider = ({ children })=>{\n    const [replyTo, setReplyTo] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ReplyContext.Provider, {\n        value: {\n            replyTo,\n            setReplyTo\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\context\\\\ReplyContext.js\",\n        lineNumber: 11,\n        columnNumber: 9\n    }, undefined);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jb250ZXh0L1JlcGx5Q29udGV4dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw4Q0FBOEM7O0FBRUU7QUFFekMsTUFBTUUsNkJBQWVGLG9EQUFhQSxHQUFHO0FBRXJDLE1BQU1HLGdCQUFnQixDQUFDLEVBQUNDLFFBQVEsRUFBQztJQUNwQyxNQUFNLENBQUNDLFNBQVNDLFdBQVcsR0FBR0wsK0NBQVFBLENBQUM7SUFFdkMscUJBQ0ksOERBQUNDLGFBQWFLLFFBQVE7UUFBQ0MsT0FBTztZQUFDSDtZQUFTQztRQUFVO2tCQUM3Q0Y7Ozs7OztBQUdiLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcdXNlclxcY2xhbnNjaGF0XFxzcmNcXGNvbnRleHRcXFJlcGx5Q29udGV4dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb250ZXh0LCBzbyB0aGUgUmVwbHkgU3RhdGVzIGNhbiBiZSBzaGFyZWQuXHJcblxyXG5pbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJlcGx5Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBSZXBseVByb3ZpZGVyID0gKHtjaGlsZHJlbn0pID0+IHtcclxuICAgIGNvbnN0IFtyZXBseVRvLCBzZXRSZXBseVRvXSA9IHVzZVN0YXRlKG51bGwpO1xyXG5cclxuICAgIHJldHVybihcclxuICAgICAgICA8UmVwbHlDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7cmVwbHlUbywgc2V0UmVwbHlUb319PlxyXG4gICAgICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgPC9SZXBseUNvbnRleHQuUHJvdmlkZXI+XHJcbiAgICApXHJcbn0iXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZVN0YXRlIiwiUmVwbHlDb250ZXh0IiwiUmVwbHlQcm92aWRlciIsImNoaWxkcmVuIiwicmVwbHlUbyIsInNldFJlcGx5VG8iLCJQcm92aWRlciIsInZhbHVlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/context/ReplyContext.js\n");

/***/ }),

/***/ "(pages-dir-node)/./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _context_CurrentUserContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context/CurrentUserContext */ \"(pages-dir-node)/./src/context/CurrentUserContext.js\");\n/* harmony import */ var _context_ReplyContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/ReplyContext */ \"(pages-dir-node)/./src/context/ReplyContext.js\");\n/* harmony import */ var _styles_Globals_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/Globals.css */ \"(pages-dir-node)/./src/styles/Globals.css\");\n/* harmony import */ var _styles_Globals_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_Globals_css__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_ReplyContext__WEBPACK_IMPORTED_MODULE_2__.ReplyProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_CurrentUserContext__WEBPACK_IMPORTED_MODULE_1__.CurrentUserProvider, {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\pages\\\\_app.js\",\n                lineNumber: 9,\n                columnNumber: 11\n            }, this)\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\pages\\\\_app.js\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\user\\\\clanschat\\\\src\\\\pages\\\\_app.js\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQXFFO0FBQ2I7QUFDekI7QUFFaEIsU0FBU0UsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxxQkFDRSw4REFBQ0gsZ0VBQWFBO2tCQUNaLDRFQUFDRCw0RUFBbUJBO3NCQUNoQiw0RUFBQ0c7Z0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7Ozs7OztBQUlsQyIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFx1c2VyXFxjbGFuc2NoYXRcXHNyY1xccGFnZXNcXF9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ3VycmVudFVzZXJQcm92aWRlciB9IGZyb20gIFwiLi4vY29udGV4dC9DdXJyZW50VXNlckNvbnRleHRcIjtcbmltcG9ydCB7IFJlcGx5UHJvdmlkZXIgfSBmcm9tICcuLi9jb250ZXh0L1JlcGx5Q29udGV4dCc7XG5pbXBvcnQgXCIuLi9zdHlsZXMvR2xvYmFscy5jc3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuICByZXR1cm4gKFxuICAgIDxSZXBseVByb3ZpZGVyPlxuICAgICAgPEN1cnJlbnRVc2VyUHJvdmlkZXIgPlxuICAgICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICAgIDwvQ3VycmVudFVzZXJQcm92aWRlciA+XG4gICAgPC9SZXBseVByb3ZpZGVyPlxuICApO1xufSJdLCJuYW1lcyI6WyJDdXJyZW50VXNlclByb3ZpZGVyIiwiUmVwbHlQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_app.js\n");

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