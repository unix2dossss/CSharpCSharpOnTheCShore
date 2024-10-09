// NAVIGATION

function navigate(page) {
    document.querySelectorAll('.page').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(page).style.display = 'block';
}

navigate('home');


