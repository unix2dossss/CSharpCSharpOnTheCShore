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

visitsTransformed = []
uniqueVisitsTransformed = []

let svg;

async function createSVGBase() {
    let svgWidth = width;
    let svgHeight = height;

    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.style.border = "1px solid black";

    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", svgWidth);
    rect.setAttribute("height", svgHeight);

    svg.appendChild(rect);
}


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

async function generateTransformedValues(){
    for (let i = 0; i < noOfLogPoints; i++) {
        console.log(`Index: ${i}`);
        v = []
        u = []

        vx = (width/noOfLogPoints) * i
        vy = maxVisits - visits[i]
        v.push(vx);
        v.push(vy);

        ux = (width/noOfLogPoints) * i
        uy = maxVisits - uniqueVisits[i]
        u.push(ux);
        u.push(uy);

        visitsTransformed.push(v);
        uniqueVisitsTransformed.push(u);
    }
}


async function generateGraph() {
    await initValues();
    await generateTransformedValues();
    createSVGBase();

    // let points = [
    //     [10, 10],
    //     [50, 100],
    //     [90, 50],
    //     [130, 150],
    //     [170, 80]
    // ];

    // Convert the points array to a string for the polyline
    let visitsPointsString = visitsTransformed.map(point => point.join(",")).join(" ");
    // Convert the points array to a string for the polyline
    let uniqueVisitsPointsString = uniqueVisitsTransformed.map(point => point.join(",")).join(" ");

    // Create the polyline element
    let visitsPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    visitsPolyline.setAttribute("points", visitsPointsString);
    visitsPolyline.setAttribute("fill", "none"); // No fill
    visitsPolyline.setAttribute("stroke", "blue"); // Stroke color for the line
    visitsPolyline.setAttribute("stroke-width", "2"); // Line width

    
    // Create the polyline element
    let uniqueVisitsPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    uniqueVisitsPolyline.setAttribute("points", uniqueVisitsPointsString);
    uniqueVisitsPolyline.setAttribute("fill", "none"); // No fill
    uniqueVisitsPolyline.setAttribute("stroke", "blue"); // Stroke color for the line
    uniqueVisitsPolyline.setAttribute("stroke-width", "2"); // Line width

    // Append the polyline to the SVG
    svg.appendChild(visitsPolyline);
    svg.appendChild(uniqueVisitsPolyline);

    // Append the SVG to the body (or any container in your HTML)
    document.body.appendChild(svg);


    console.log(visitsTransformed);
    console.log(uniqueVisitsTransformed);
}


generateGraph();