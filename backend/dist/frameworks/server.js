"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
const serverconfig_1 = require("../config/serverconfig");
(0, dbconfig_1.default)();
app_1.default.listen(serverconfig_1.PORT, () => {
    console.log(`server started on http://localhost:${serverconfig_1.PORT}`);
});
