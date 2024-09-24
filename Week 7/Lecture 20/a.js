const menuOurs = document.getElementById('menuOurs');
const menuTheirs = document.getElementById('menuTheirs');

const sectionOurs = document.getElementById('sectionOurs');
const sectionTheirs = document.getElementById('sectionTheirs');

const ShowOurs = () => {
    sectionOurs.style.display = "block";
    menuOurs.style.backgroundColor = "green";
    menuTheirs.style.backgroundColor = "transparent";
    sectionTheirs.style.display = "none";
}

const ShowTheirs = () => {
    sectionTheirs.style.display = "block";
    menuTheirs.style.backgroundColor = "green";
    menuOurs.style.backgroundColor = "transparent";
    sectionOurs.style.display = "none";
}


menuOurs.addEventListener("click", ShowOurs);
menuTheirs.addEventListener("click", ShowTheirs);

ShowTheirs();