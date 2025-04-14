var projectsData = []
const bodyClassList = document.body.classList
const slider = document.querySelector(".slider")
const background = document.querySelector('.page-background');
const projects = document.querySelector(".projects");
const projectWrapper = document.querySelector(".project-wrapper");
const project = document.querySelector(".project");
const carousel = document.querySelector(".project-carousel");
const carouselTrack = document.querySelector(".project-carousel-track");
var inProjectWrapper, isScrolling, startX, scrollLeft;
var lastScrollLeft = 0;
var isDragging = false;


function toggleTheme() {
    slider.animate(
        [
            { transform: "scale(1) rotate(0deg)" },
            { transform: "scale(.6) rotate(180deg)" },
            { transform: "scale(1) rotate(360deg)" }
        ],
        {
            duration: 500,
            easing: "cubic-bezier(.7, .05, .14, 1.34)"
        }
    )
    let newTheme = bodyClassList.contains("light-theme") ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
}

function addProjectThumbnail(item, index) {
    return `
        <button class="project-thumbnail" type="button" key="project-thumbnail-${index}" onclick="showProject(${index})">
            <div class="project-thumbnail-img img-wrapper">
                <img src="${item.path + item.primaryImg}" alt="Пет-проект ${index}" />
            </div>
            <div class="project-thumbnail-description">
                <p>${item.name}</p>
            </div>
        </button>`;
}

function showProject(index) {
    document.body.classList.add("no-scroll");
    projectWrapper.style.display = "flex";
    projectWrapper.classList.remove("hide");
    project.classList.remove("hide");
    let projectData = projectsData[index]
    carousel.scrollTo({ left: 0 })
    carouselTrack.innerHTML = null;
    projectData.img?.forEach((value, i) => {
        carouselTrack.innerHTML += `<img src="${projectData.path + value}" key="project-${index}-img-${i}" alt="Скриншот ${i}" draggable="false"/>`;
    })

    document.querySelector(".project-title").innerHTML = projectData.name;
    document.querySelector(".project-description").innerHTML = projectData.description;
    document.querySelector(".project-stack").innerHTML = "Стек: \t" + projectData.stack;
    document.querySelector(".project-year").innerHTML = "Год: \t" + projectData.year;
    document.querySelector(".project-link").href = projectData.link;
}

function closeModal() {
    projectWrapper.classList.add("hide");
    project.classList.add("hide");
    setTimeout(() => {
        projectWrapper.style.display = null;
        document.body.classList.remove("no-scroll");
    }, 300);
}

function scrollToClosest() {
    const scrollLeft = carousel.scrollLeft;
    const images = document.querySelectorAll(".project-carousel-track img");
    let closestImg = images[0];
    let minDistance = Math.abs(images[0].offsetLeft - scrollLeft);
    images.forEach((img) => {
        let distance = Math.abs(img.offsetLeft - scrollLeft);
        if (distance < minDistance) {
            minDistance = distance;
            closestImg = img;
        }
    });

    carousel.scrollTo({
        left: closestImg.offsetLeft,
        behavior: "smooth",
    });
}


window.onload = async () => {
    projectsData = await fetch("data.json")
        .then(response => response.json())
        .then(({ data }) => data)
        .catch(error => console.error("Ошибка загрузки данных:", error));

    projects.innerHTML = null;
    projectsData.forEach((value, i) => {
        projects.innerHTML += addProjectThumbnail(value, i);
    });

    projectWrapper.addEventListener("pointerdown", (event) => {
        if (event.target === projectWrapper) inProjectWrapper = true;
        else inProjectWrapper = false;
    });

    projectWrapper.addEventListener("pointerup", (event) => {
        if (event.target === projectWrapper && inProjectWrapper) closeModal();
        inProjectWrapper = null;
    });

    carousel.addEventListener("scroll", () => {
        clearTimeout(isScrolling);
        if (carousel.scrollLeft !== lastScrollLeft) { // движется ли скролл
            isScrolling = setTimeout(() => {
                scrollToClosest();
            }, 500);
        }
        lastScrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        carousel.style.cursor = "grabbing";
    });

    carousel.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX); // cкорость движения
        carousel.scrollLeft = scrollLeft - walk;
    });

    carousel.addEventListener("mouseup", () => {
        isDragging = false;
        carousel.style.cursor = "grab";
    });

    carousel.addEventListener("mouseleave", () => {
        isDragging = false;
        carousel.style.cursor = "grab";
    });

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        background.style.transform = `translateY(${scrollY * 0.5}px)`; // параллакс
    });
};