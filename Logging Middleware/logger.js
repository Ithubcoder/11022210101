const fetch = require("node-fetch");

async function Log(stack, level, pkg, message) {
    const logUrl = "http://20.244.56.144/evaluation-service/logs";

    const validStacks = ["backend", "frontend"];
    const validLevels = ["debug", "info", "warn", "error", "fatal"];
    const validBackendPackages = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
    const validFrontendPackages = ["api"];

    if (!validStacks.includes(stack)) return console.error("❌ Invalid stack");
    if (!validLevels.includes(level)) return console.error("❌ Invalid level");
    if (
        (stack === "backend" && !validBackendPackages.includes(pkg)) ||
        (stack === "frontend" && !validFrontendPackages.includes(pkg))
    ) return console.error("❌ Invalid package for given stack");

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMDIxbS5yYWpwdXRAZ21haWwuY29tIiwiZXhwIjoxNzUyMjIzODAyLCJpYXQiOjE3NTIyMjI5MDIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI2NTM0ZWE4Ni0wZjNiLTQ5NDYtOWJhNS05YzNiMzk3MTcxNTYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJtdWt1bCIsInN1YiI6ImQwNmE2ZDQzLWQyZmYtNGY0Yy05ODhkLTY0ZWMwMDUyN2IzZiJ9LCJlbWFpbCI6IjIwMjFtLnJhanB1dEBnbWFpbC5jb20iLCJuYW1lIjoibXVrdWwiLCJyb2xsTm8iOiIxMTAyMjIxMDEwMSIsImFjY2Vzc0NvZGUiOiJGYkdnRlUiLCJjbGllbnRJRCI6ImQwNmE2ZDQzLWQyZmYtNGY0Yy05ODhkLTY0ZWMwMDUyN2IzZiIsImNsaWVudFNlY3JldCI6InB0RlpGVUNEZkpzY3N1ZmEifQ.7Hp5PnkrxU5yfafP6vfBaJnPCa1ruy4nq_o5IhwXoBs";

    const logBody = {
        stack,
        level,
        package: pkg,
        message
    };

    try {
        const response = await fetch(logUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(logBody)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("✅ Log submitted successfully:", result);
        } else {
            console.error("❌ Failed to submit log:", result);
        }
    } catch (error) {
        console.error("❌ Error submitting log:", error.message);
    }
}

module.exports = Log;
