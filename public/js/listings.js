function toggleClass(depthSchool) {
  if (depthSchool.classList.contains("show")) {
    depthSchool.classList.remove("show");
  } else {
    depthSchool.classList.add("show");
  }
}

function toggleAria(basicSchool) {
  let basicLink = basicSchool.children[0];
  let links = basicSchools.getElementsByTagName("a");
  for (let i = 0; i < links.length; i++) {
    if (links[i] === basicLink) {
      links[i].ariaCurrent = "location";
    } else {
      links[i].ariaCurrent = "false";
    }
  }
}

const basicSchools = document.getElementById("lo-basic-list");
const depthSchoolsPage = document.getElementById("lo-in-depth-list");
const depthSchools = depthSchoolsPage.querySelectorAll("li");

let basicId;

basicSchools.addEventListener("click", function (event) {
  if (event.target.closest(".lo-basic-list-item")) {
    basicSchool = event.target.closest(".lo-basic-list-item");
    basicId = basicSchool.dataset.id;
    depthSchools.forEach((school) => {
      school.classList.remove("show");
      if (basicId === school.dataset.id) {
        toggleClass(school);
        toggleAria(basicSchool);
      }
    });
  }
});
