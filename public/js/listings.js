function toggleClass(element) {
  if (element.classList.contains("show")) {
    element.classList.remove("show");
  } else {
    element.classList.add("show");
  }
}

const basicSchools = document.getElementById("lo-basic-list");
const depthSchoolsPage = document.getElementById("lo-in-depth-list");
const depthSchools = depthSchoolsPage.querySelectorAll("li");

let basicId, depthListItem;

basicSchools.addEventListener("click", function (event) {
  if (event.target.closest(".lo-basic-list-item")) {
    basicId = event.target.closest(".lo-basic-list-item").dataset.id;
    depthSchools.forEach((school) => {
      school.classList.remove("show");
      if (basicId === school.dataset.id) {
        toggleClass(school);
      }
    });
  }
});
