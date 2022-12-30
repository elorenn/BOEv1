// const allSchools = document.getElementById("lo-basic-list");
// let oneSchool = allSchools.querySelectorAll("li");

// // allSchools.addEventListener("click", function (event) {
// //   // let id = $(this).data("id");
// //   // console.log("id: " + id);
// //   console.log("HI " + this);
// //   console.log(this);
// //   console.log(event.target);

// //   if (event.target.closest(".lo-basic-list-item")) {
// //     console.log("MATCH!");
// //     console.log(event.target.closest(".lo-basic-list-item"));
// //     let id = event.target.closest(".lo-basic-list-item")..id;
// //     console.log(id);
// //   }
// // });

// oneSchool.forEach((one) => {
//   let id = one.dataset.id;
//   console.log(id);

//   let listing = document.querySelector(`[data-id="${id}"]`);
//   console.log("type: " + listing);
//   console.log(listing);
//   console.log(listing.dataset.id);
// });

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------

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
    // depthListItem = depthSchoolsPage.querySelector(`[data-id="${basicId}"]`);
    depthSchools.forEach((school) => {
      school.classList.remove("show");
      if (basicId === school.dataset.id) {
        toggleClass(school);
      }
    });
  }
});
