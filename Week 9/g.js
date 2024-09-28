document.getElementById("mainTitle").addEventListener("click", () => {
    document.getElementById("popupContent").style.display = "block";
});

document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("popupContent").style.display = "none";
});