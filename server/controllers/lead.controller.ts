import type { Lead } from "../models/lead.model";

const predictLead = async (req: any, res: any) => {
    try {
        const lead: Lead = req.body;

        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lead)
        })
        
        const data = await response.json();

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const batchPredictLeads = async (req: any, res: any) => {
    try {
        const leads: Lead[] = req.body

        if (!Array.isArray(leads)) {
            return res.status(400).json({ error: "Input should be an array of leads" });
        }

        const response = await fetch("http://127.0.0.1:8000/predict_batch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(leads)
        })

        const data = await response.json()

        res.json(data)
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    predictLead,
    batchPredictLeads
};
