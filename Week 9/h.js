const mydragstart = (ev) => {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

const mydragover = (ev) => {
    ev.preventDefault();
}

const mydrop = (ev) => {
    if (ev.dataTransfer !== null) {
        const data = ev.dataTransfer.getData("text/plain");
        // alert(`Dropped ${data}`);
        // ev.target.appendChild(document.getElementById("Berry"));
        document.getElementById(data).remove();
    }
}