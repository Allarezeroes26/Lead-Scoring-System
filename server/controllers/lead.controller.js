"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const predictLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lead = req.body;
        const response = yield fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lead)
        });
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const batchPredictLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leads = req.body;
        if (!Array.isArray(leads)) {
            return res.status(400).json({ error: "Input should be an array of leads" });
        }
        const response = yield fetch("http://127.0.0.1:8000/predict_batch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(leads)
        });
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = {
    predictLead,
    batchPredictLeads
};
//# sourceMappingURL=lead.controller.js.map