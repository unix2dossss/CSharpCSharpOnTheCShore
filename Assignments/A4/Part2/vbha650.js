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

let dates = [];
let visits = [];
let uniqueVisits = [];
let noOfLogPoints;
let maxVisits;
let minVisits;
let height;
let width;


async function initValues() {
    const app_logs = await getLogs();
    console.log(app_logs);

    app_logs.forEach(item => {
        dates.push(item.date);
        visits.push(item.visits);
        uniqueVisits.push(item.uniqueVisits);
    });

    const allVisits = [...visits, ...uniqueVisits];

    maxVisits = Math.max(...allVisits);
    minVisits = Math.min(...allVisits);

    height = maxVisits - minVisits;
    width = height * 3.56;

    noOfLogPoints = app_logs.length;
    
}

async function generateGraph() {
    await initValues();
    console.log(`Number of log points: ${noOfLogPoints}`);
    console.log(`Max Visits: ${maxVisits}`);
    console.log(`Min Visits: ${minVisits}`);
    console.log(`Height: ${height}`);
    console.log(`Width: ${width}`);

    for (let i = 0; i < noOfLogPoints; i++) {
        console.log(`Index: ${i}`);
    }
}


generateGraph();