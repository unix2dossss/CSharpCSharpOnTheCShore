async function getLogs() {
    try {
        const response = await fetch("https://cws.auckland.ac.nz/nzsl/api/Log");
        const logs = await response.json(); 
        return logs;
    } catch (error) {
        console.error("Error fetching total Logs:", error);
        return [];
    }
}

getLogs();
