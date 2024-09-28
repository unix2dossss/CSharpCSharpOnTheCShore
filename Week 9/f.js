document.getElementById("updateVideo").addEventListener("click", () => {
    const videoID = document.getElementById("videoId").value;
    const url = `https://www.youtube.com/embed/${videoID}`;
    const ourFrame = document.getElementById("ourFrame");
    ourFrame.src = url
})