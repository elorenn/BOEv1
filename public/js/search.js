// Home page search bar
function searchBar() {
  var input, filter, ul, li, a, i, txtValue, empty, listArr, check;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("lo-basic-list");
  li = ul.getElementsByTagName("li");
  empty = document.getElementById("lo-search-empty");
  listArr = [...li];

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }

  check = listArr.every((e) => {
    return e.style.display === "none";
  });
  // if none of the schools (li elements) are displayed, then show the empty error message.
  check ? (empty.style.display = "unset") : (empty.style.display = "none");
}
