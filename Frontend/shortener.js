// shortener.js

const { v4: uuidv4 } = require('uuid');
const Log = require('./logger'); // ✅ Import logger

let urlDatabase = {}; // Simple in-memory DB

module.exports = async function (req, res) {
    try {
        const { url, validity, shortcode } = req.body;

        // Validate input
        if (!url) {
            await Log("backend", "error", "handler", "Missing 'url' in request body");
            return res.status(400).json({ error: "URL is required" });
        }

        const code = shortcode || uuidv4().slice(0, 6);

        if (urlDatabase[code]) {
            await Log("backend", "error", "handler", `Shortcode '${code}' already exists`);
            return res.status(409).json({ error: "Shortcode already exists" });
        }

        const ttlMinutes = validity ? parseInt(validity) : 30;
        const expirationTime = Date.now() + ttlMinutes * 60 * 1000;

        // Store short URL data
        urlDatabase[code] = {
            originalUrl: url,
            expiresAt: expirationTime
        };

        await Log("backend", "info", "db", `Short URL created for '${url}' with code '${code}'`);

        return res.status(201).json({
            shortUrl: `http://localhost:3000/${code}`,
            validTill: new Date(expirationTime).toISOString()
        });

    } catch (err) {
        await Log("backend", "fatal", "handler", `Unhandled exception: ${err.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
