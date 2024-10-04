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

let visitsTransformed = [];
let uniqueVisitsTransformed = [];

let svg;

async function createSVGBase() {
    let svgWidth = width;
    let svgHeight = height;

    let totalSvgWidth = svgWidth + 30;

    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `-30 0 ${totalSvgWidth} ${svgHeight}`);
    svg.setAttribute("preserveAspectRatio", "none");

    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", svgWidth);
    rect.setAttribute("height", svgHeight);
    rect.setAttribute("fill", "lightgray");
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", "2");


    svg.appendChild(rect);

    let maxText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    maxText.setAttribute("x", -20);
    maxText.setAttribute("y", 10);
    maxText.setAttribute("fill", "black");
    maxText.setAttribute("font-size", "12px");
    maxText.setAttribute("text-anchor", "middle");
    maxText.textContent = maxVisits;
    svg.appendChild(maxText);

    let minText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    minText.setAttribute("x", -20);
    minText.setAttribute("y", svgHeight - 5);
    minText.setAttribute("fill", "black");
    minText.setAttribute("font-size", "12px");
    minText.setAttribute("text-anchor", "middle");
    minText.textContent = minVisits;
    svg.appendChild(minText);
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

async function generateTransformedValues() {
    visitsTransformed = [];
    uniqueVisitsTransformed = [];

    for (let i = 0; i < noOfLogPoints; i++) {
        let v = [];
        let u = [];

        let vx = (width / (noOfLogPoints - 1)) * i;
        let ux = (width / (noOfLogPoints - 1)) * i;

        let vy = height - ((visits[i] - minVisits) / (maxVisits - minVisits) * height);
        let uy = height - ((uniqueVisits[i] - minVisits) / (maxVisits - minVisits) * height);

        v.push(vx);
        v.push(vy);

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

    // Dynamically set the first and last date in the HTML
    document.getElementById("start-date").textContent = dates[0]; // First date
    document.getElementById("end-date").textContent = dates[dates.length - 1]; // Last date

    let visitsPointsString = visitsTransformed.map(point => point.join(",")).join(" ");
    let uniqueVisitsPointsString = uniqueVisitsTransformed.map(point => point.join(",")).join(" ");

    let visitsPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    visitsPolyline.setAttribute("points", visitsPointsString);
    visitsPolyline.setAttribute("fill", "none");
    visitsPolyline.setAttribute("stroke", "red");
    visitsPolyline.setAttribute("stroke-width", "2");

    let uniqueVisitsPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    uniqueVisitsPolyline.setAttribute("points", uniqueVisitsPointsString);
    uniqueVisitsPolyline.setAttribute("fill", "none");
    uniqueVisitsPolyline.setAttribute("stroke", "green");
    uniqueVisitsPolyline.setAttribute("stroke-width", "2");

    svg.appendChild(visitsPolyline);
    svg.appendChild(uniqueVisitsPolyline);

    const graphContainer = document.getElementById("graph-container");
    graphContainer.appendChild(svg);

    // Optional: Set the dynamic data points text for debugging or display
    document.getElementById("visit-data-points").textContent = visits.join(", ")
    document.getElementById("unique-data-points").textContent = uniqueVisits.join(", ");
}



window.addEventListener("resize", async function() {
    if (svg) {
        document.body.removeChild(svg);
    }

    await generateGraph();
});

generateGraph();