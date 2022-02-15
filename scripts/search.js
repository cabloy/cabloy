var searchAttr = "data-search-mode";
function contains(a, m) {
  return (a.textContent || a.innerText || "").toUpperCase().indexOf(m) !== -1;
}

function handleNavSearch(search) {
  window.localStorage.setItem("search", search);
  if (search) {
    search = search.toUpperCase();
  }
  if (!search) {
    //no search, show all results
    document.documentElement.removeAttribute(searchAttr);

    document
      .querySelectorAll("nav > ul > li:not(.level-hide)")
      .forEach(function (elem) {
        elem.style.display = "block";
      });

    if (typeof hideAllButCurrent === "function") {
      //let's do what ever collapse wants to do
      hideAllButCurrent();
    } else {
      //menu by default should be opened
      document
        .querySelectorAll("nav > ul > li > ul li")
        .forEach(function (elem) {
          elem.style.display = "block";
        });
    }
  } else {
    //we are searching
    document.documentElement.setAttribute(searchAttr, "");

    //show all parents
    document.querySelectorAll("nav > ul > li").forEach(function (elem) {
      elem.style.display = "block";
    });
    //hide all results
    document.querySelectorAll("nav > ul > li > ul li").forEach(function (elem) {
      elem.style.display = "none";
    });
    //show results matching filter
    document.querySelectorAll("nav > ul > li > ul a").forEach(function (elem) {
      if (!contains(elem.parentNode, search)) {
        return;
      }
      elem.parentNode.style.display = "block";
    });
    //hide parents without children
    document.querySelectorAll("nav > ul > li").forEach(function (parent) {
      var countSearchA = 0;
      parent.querySelectorAll("a").forEach(function (elem) {
        if (contains(elem, search)) {
          countSearchA++;
        }
      });

      var countUl = 0;
      var countUlVisible = 0;
      parent.querySelectorAll("ul").forEach(function (ulP) {
        // count all elements that match the search
        if (contains(ulP, search)) {
          countUl++;
        }

        // count all visible elements
        var children = ulP.children;
        for (i = 0; i < children.length; i++) {
          var elem = children[i];
          if (elem.style.display != "none") {
            countUlVisible++;
          }
        }
      });

      if (countSearchA == 0 && countUl === 0) {
        //has no child at all and does not contain text
        parent.style.display = "none";
      } else if (countSearchA == 0 && countUlVisible == 0) {
        //has no visible child and does not contain text
        parent.style.display = "none";
      }
    });
  }
}

function ParseUrlQuery(url) {
  var query = {};
  var urlToParse = url || window.location.href;
  var params;
  var param;
  var length;
  if (typeof urlToParse === "string" && urlToParse.length) {
    urlToParse =
      urlToParse.indexOf("?") > -1 ? urlToParse.replace(/\S*\?/, "") : "";
    params = urlToParse.split("&");
    length = params.length;

    for (var i = 0; i < length; i += 1) {
      param = params[i].replace(/#\S+/g, "").split("=");
      query[decodeURIComponent(param[0])] =
        typeof param[1] === "undefined"
          ? undefined
          : decodeURIComponent(param[1]) || "";
    }
  }
  return query;
}

//on search
document
  .getElementById("nav-search")
  .addEventListener("input", function (event) {
    handleNavSearch(this.value);
  });

function handlePageSearchInit() {
  var search;
  // url query
  var query = ParseUrlQuery();
  search = query.search;
  // local storage
  if (!search) {
    search = window.localStorage.getItem("search");
  }
  if (!search) return;
  // do search
  document.getElementById("nav-search").value = search;
  handleNavSearch(search);
  showCurrent();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", handlePageSearchInit);
} else {
  handlePageSearchInit();
}
