"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const express_validator_1 = require("express-validator");
const BaseController_1 = require("./BaseController");
class Controller extends BaseController_1.BaseController {
    validate(request, response) {
        const v = express_validator_1.validationResult(request);
        if (!v.isEmpty()) {
            const errors = {};
            const validationsErrors = v.array();
            for (let index = 0; index < validationsErrors.length; index++) {
                const error = validationsErrors[index];
                if (error.param in errors)
                    continue;
                errors[error.param] = error.msg;
            }
            response.status(422).send({ errors, message: "Validation failed" }).end();
            return false;
        }
        return true;
    }
    pagination(request, total) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const pagination = {
            page: ((_b = (_a = request.body) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.page) || 1,
            perPage: ((_d = (_c = request.body) === null || _c === void 0 ? void 0 : _c.pagination) === null || _d === void 0 ? void 0 : _d.perPage) || 0,
            pages: 1,
            total,
            sort: (_f = (_e = request.body) === null || _e === void 0 ? void 0 : _e.sort) === null || _f === void 0 ? void 0 : _f.sort,
            field: (_h = (_g = request.body) === null || _g === void 0 ? void 0 : _g.sort) === null || _h === void 0 ? void 0 : _h.field,
            paginate() {
                this.pages = this.perPage && this.total ? Math.ceil(this.total / this.perPage) : 1;
                this.page = this.page > this.pages ? this.pages : this.page;
            }
        };
        pagination.paginate();
        const options = {};
        if (pagination.perPage) {
            options.limit = pagination.perPage;
            options.skip = (pagination.page - 1) * pagination.perPage;
        }
        if (((_k = (_j = request.body) === null || _j === void 0 ? void 0 : _j.sort) === null || _k === void 0 ? void 0 : _k.field) && ((_m = (_l = request.body) === null || _l === void 0 ? void 0 : _l.sort) === null || _m === void 0 ? void 0 : _m.sort)) {
            options.sort = { [request.body.sort.field]: request.body.sort.sort };
        }
        return [pagination, options];
    }
}
exports.Controller = Controller;
