/*=========================================================================================
    File Name: app-file-manager.js
    Description: app-file-manager js
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

$(function () {
  "use strict";

  var sidebarFileManager = $(".sidebar-file-manager"),
    sidebarToggler = $(".sidebar-toggle"),
    fileManagerOverlay = $(".body-content-overlay"),
    filesTreeView = $(".my-drive"),
    sidebarRight = $(".right-sidebar"),
    filesWrapper = $(".file-manager-main-content"),
    viewContainer = $(".view-container"),
    fileManagerItem = $(".file-manager-item"),
    noResult = $(".no-result"),
    fileActions = $(".file-actions"),
    viewToggle = $(".view-toggle"),
    filterInput = $(".files-filter"),
    toggleDropdown = $(".toggle-dropdown"),
    sidebarMenuList = $(".sidebar-list"),
    fileDropdown = $(".file-dropdown"),
    fileContentBody = $(".file-manager-content-body");

  // Select File
  if (fileManagerItem.length) {
    fileManagerItem.find(".form-check-input").on("change", function () {
      var $this = $(this);
      if ($this.is(":checked")) {
        $this.closest(".file, .folder").addClass("selected");
      } else {
        $this.closest(".file, .folder").removeClass("selected");
      }
      if (fileManagerItem.find(".form-check-input:checked").length) {
        fileActions.addClass("show");
      } else {
        fileActions.removeClass("show");
      }
    });
  }

  // Toggle View
  if (viewToggle.length) {
    viewToggle.find("input").on("change", function () {
      var input = $(this);
      viewContainer.each(function () {
        if (!$(this).hasClass("view-container-static")) {
          if (input.is(":checked") && input.data("view") === "list") {
            $(this).addClass("list-view");
          } else {
            $(this).removeClass("list-view");
          }
        }
      });
    });
  }

  // Filter
  if (filterInput.length) {
    filterInput.on("keyup", function () {
      var value = $(this).val().toLowerCase();

      fileManagerItem.filter(function () {
        var $this = $(this);

        if (value.length) {
          $this
            .closest(".file, .folder")
            .toggle(-1 < $this.text().toLowerCase().indexOf(value));
          $.each(viewContainer, function () {
            var $this = $(this);
            if ($this.find(".file:visible, .folder:visible").length === 0) {
              $this.find(".no-result").removeClass("d-none").addClass("d-flex");
            } else {
              $this.find(".no-result").addClass("d-none").removeClass("d-flex");
            }
          });
        } else {
          $this.closest(".file, .folder").show();
          noResult.addClass("d-none").removeClass("d-flex");
        }
      });
    });
  }

  // sidebar file manager list scrollbar
  if ($(sidebarMenuList).length > 0) {
    var sidebarLeftList = new PerfectScrollbar(sidebarMenuList[0], {
      suppressScrollX: true,
    });
  }

  if ($(fileContentBody).length > 0) {
    var rightContentWrapper = new PerfectScrollbar(fileContentBody[0], {
      cancelable: true,
      wheelPropagation: false,
    });
  }
  // Files Treeview
  if (filesTreeView.length) {
    filesTreeView.jstree({
      core: {
        themes: {
          dots: false,
        },
        data: [
          {
            text: "My Drive",
            children: [
              {
                text: "photos",
                children: [
                  {
                    text: "image-1.jpg",
                    type: "jpg",
                  },
                  {
                    text: "image-2.jpg",
                    type: "jpg",
                  },
                ],
              },
            ],
          },
        ],
      },
      plugins: ["types"],
      types: {
        default: {
          icon: "far fa-folder font-medium-1",
        },
        jpg: {
          icon: "far fa-file-image text-info font-medium-1",
        },
      },
    });
  }

  // click event for show sidebar
  sidebarToggler.on("click", function () {
    sidebarFileManager.toggleClass("show");
    fileManagerOverlay.toggleClass("show");
  });

  // remove sidebar
  $(".body-content-overlay, .sidebar-close-icon").on("click", function () {
    sidebarFileManager.removeClass("show");
    fileManagerOverlay.removeClass("show");
    sidebarRight.removeClass("show");
  });

  // on screen Resize remove .show from overlay and sidebar
  $(window).on("resize", function () {
    if ($(window).width() > 768) {
      if (fileManagerOverlay.hasClass("show")) {
        sidebarFileManager.removeClass("show");
        fileManagerOverlay.removeClass("show");
        sidebarRight.removeClass("show");
      }
    }
  });

  // making active to list item in links on click
  sidebarMenuList.find(".list-group a").on("click", function () {
    if (sidebarMenuList.find(".list-group a").hasClass("active")) {
      sidebarMenuList.find(".list-group a").removeClass("active");
    }
    $(this).addClass("active");
  });

  // Toggle Dropdown
  if (toggleDropdown.length) {
    $(".file-logo-wrapper .dropdown").on("click", function (e) {
      var $this = $(this);
      e.preventDefault();
      if (fileDropdown.length) {
        $(".view-container").find(".file-dropdown").remove();
        if ($this.closest(".dropdown").find(".dropdown-menu").length === 0) {
          fileDropdown
            .clone()
            .appendTo($this.closest(".dropdown"))
            .addClass("show")
            .find(".dropdown-item")
            .on("click", function () {
              $(this).closest(".dropdown-menu").remove();
            });
        }
      }
    });
    $(document).on("click", function (e) {
      if (!$(e.target).hasClass("toggle-dropdown")) {
        filesWrapper.find(".file-dropdown").remove();
      }
    });

    if (viewContainer.length) {
      $(".file, .folder").on("mouseleave", function () {
        $(this).find(".file-dropdown").remove();
      });
    }
  }
});

function logout() {
  $.post("/auth/logout?_method=DELETE"); //Adapt to actual logout script
  location.reload();
}

function seenby(val) {
  var element = document.getElementById("seen");
  if (val == "Onlyby" || val == "Exceptby") element.style.display = "block";
  else element.style.display = "none";
}

function sharingby(val) {
  var element = document.getElementById("sharing");
  if (val == "Onlyby" || val == "Exceptby") element.style.display = "block";
  else element.style.display = "none";
}
function downloadableby(val) {
  var element = document.getElementById("downloadable");
  if (val == "Onlyby" || val == "Exceptby") element.style.display = "block";
  else element.style.display = "none";
}

function downloadfile() {
  var form = document.createElement("form");
  form.method = "POST";
  form.action = "/app/downloadfile";
  var checkboxesFI = document.getElementsByName("file");
  var checkboxesFO = document.getElementsByName("folder");
  var result = {};
  for (var i = 0; i < checkboxesFI.length; i++) {
    if (checkboxesFI[i].checked) {
      window["elementfl" + i] = document.createElement("input");
      window["elementfl" + i].value = checkboxesFI[i].value;
      window["elementfl" + i].name = "file" + i;
      form.appendChild(window["elementfl" + i]);
    }
  }
  for (var i = 0; i < checkboxesFO.length; i++) {
    if (checkboxesFO[i].checked) {
      window["elementfo" + i] = document.createElement("input");
      window["elementfo" + i].value = checkboxesFO[i].value;
      window["elementfo" + i].name = "folder" + i;
      form.appendChild(window["elementfo" + i]);
    }
  }
  document.body.appendChild(form);
  form.submit();
}

function downloadonefile() {
  var form = document.createElement("form");
  form.method = "POST";
  form.action = "/app/downloadfile";
  var checkboxesFI = document.getElementsByName("file");
  var result = {};
  if (file[1] == "Folder" ) {
    elementfl = document.createElement("input");
    elementfl.value = file[0];
    elementfl.name = "folder";
    form.appendChild(elementfl);
  }else{
    elementfl = document.createElement("input");
    elementfl.value = file[0] + file[1];
    elementfl.name = "file";
    form.appendChild(elementfl);
  }
  document.body.appendChild(form);
  form.submit();
}

function deletefile() {
  var checkboxesFI = document.getElementsByName("file");
  var checkboxesFO = document.getElementsByName("folder");
  var result = {};
  for (var i = 0; i < checkboxesFI.length; i++) {
    if (checkboxesFI[i].checked) {
      result["file" + i] = checkboxesFI[i].value;
    }
  }
  for (var i = 0; i < checkboxesFO.length; i++) {
    if (checkboxesFO[i].checked) {
      result["folder" + i] = checkboxesFO[i].value;
    }
  }
  var fd = new FormData();
  fd.append("data", JSON.stringify(result));
  fetch("/app/deletefile", {
    method: "post",
    body: fd,
  });

  function timedRefresh(timeoutPeriod) {
    setTimeout("location.reload(true);", timeoutPeriod);
  }
  window.onload = timedRefresh(700);
}

function folderupload() {
  var zip = new JSZip();
  var files = document.getElementById("folder").files;
  for (const i in files) {
    var hajar = files[i].webkitRelativePath
    if (files[i].webkitRelativePath === undefined) {
      continue;
    }
    zip.file(hajar.substring(hajar.indexOf('/') + 1), files[i]);
  }
  zip
    .generateAsync({ type: "blob" })
    .then(function (content) {
      var fd = new FormData();
      fd.append(
        "upl",
        content,
        files[0].webkitRelativePath.split("/")[0] + ".zip"
      );
      fetch("/app/folder-upload", {
        method: "post",
        body: fd,
      });
    })
}

var file = [];
function setval(varval) {
  // 0:filesid  1:minetype 2:name 3:filesize 4:updatedat 5:createdat 6:userid 7:sharing
  file = varval;
}

function info() {
  document.getElementById("fileicon").innerHTML =
    '<img src="/images/icons/' +
    file[1].replace(/\./g, "") +
    '.png" alt="file-icon" height="64" />';
  document.getElementById("filename").innerHTML =
    '<h5 class="modal-title">' + file[2] + "</h5>";
  document.getElementById("filesize").innerHTML =
    '<p class="mb-0 mt-1">' + file[3] + "</p>";
  document.getElementById("filesize2").innerHTML =
    '<p class="fw-bold">' + file[3] + "</p>";
  document.getElementById("updatedat").innerHTML =
    '<p class="fw-bold">' +
    Date(file[4]).toString().split(" ").slice(1, 4).join(" ") +
    "</p>";
  document.getElementById("createdat").innerHTML =
    '<p class="fw-bold">' +
    Date(file[5]).toString().split(" ").slice(1, 4).join(" ") +
    "</p>";
  document.getElementById("minetype").innerHTML =
    '<p class="fw-bold">' + file[1].replace(/\./g, "") + "</p>";
}

function deleteone() {
  var form = document.createElement("form");
  form.method = "POST";
  form.action = "/app/deleteone";
  element = document.createElement("input");
  element.value = file[0];
  element.name = file[1];
  form.appendChild(element);
  document.body.appendChild(form);
  form.submit();
}

function setpermissions() {
  var form = document.createElement("form");
  form.method = "POST";
  form.action = "/app/setpermissions";
  var data = {};
  var seenby = document.getElementById("seenby");
  var sharingby = document.getElementById("sharingby");
  var downloadableby = document.getElementById("downloadableby");
  if (file[1] == "Folder") {
    data["folder"] = file[0];
  } else {
    data["file"] = file[0];
  }
  data["seenby"] = seenby.value;
  data["sharingby"] = sharingby.value;
  data["downloadableby"] = downloadableby.value;
  if (seenby.value == "Exceptby" || seenby.value == "Onlyby") {
    var seenusers = document.querySelector("#seenusers");
    var seenselected = Array.from(seenusers.options)
      .filter(function (option) {
        return option.selected;
      })
      .map(function (option) {
        return option.value;
      });
    data["seenby" + seenby.value] = seenselected;
  }
  if (sharingby.value == "Exceptby" || sharingby.value == "Onlyby") {
    var sharingusers = document.querySelector("#sharingusers");
    var sharingselected = Array.from(sharingusers.options)
      .filter(function (option) {
        return option.selected;
      })
      .map(function (option) {
        return option.value;
      });
    data["sharingby" + sharingby.value] = sharingselected;
  }
  if (downloadableby.value == "Exceptby" || downloadableby.value == "Onlyby") {
    var downloadableusers = document.querySelector("#downloadableusers");
    var downloadableselected = Array.from(downloadableusers.options)
      .filter(function (option) {
        return option.selected;
      })
      .map(function (option) {
        return option.value;
      });
    data["downloadableby" + downloadableby.value] = downloadableselected;
  }
  element = document.createElement("input");
  element.value = JSON.stringify(data);
  element.name = "data";
  form.appendChild(element);
  document.body.appendChild(form);
  form.submit();
}

function reportfile() {
  var form = document.createElement("form");
  form.method = "POST";
  form.action = "/app/reportfile";
  sendto = document.createElement("input");
  sendto.value = file[6];
  sendto.name = "sendto";
  filename = document.createElement("input");
  filename.value = file[2];
  filename.name = "file";
  form.appendChild(sendto);
  form.appendChild(filename);
  document.body.appendChild(form);
  form.submit();
}

function truenotification() {
  fetch("/app/truenotification", {
    method: "post",
  });
}

function sharefile() {
  var form = document.createElement("form");
  form.method = "POST";
  form.action = "/app/sharefile";
  var data = {};
  var shareusers = document.querySelector("#shareusers");
  var shareselected = Array.from(shareusers.options)
    .filter(function (option) {
      return option.selected;
    })
    .map(function (option) {
      return option.value;
    });
  data["sharewith"] = shareselected;
  data["fileid"] = file[0];
  data["type"] = file[1];
  element = document.createElement("input");
  element.value = JSON.stringify(data);
  element.name = "data";
  form.appendChild(element);
  document.body.appendChild(form);
  form.submit();
}

function preview() {
  var fd = new FormData();
  fd.append("fileid", file[0]);
  fd.append("minetype", file[1]);
  fd.append("name", file[2]);
  fetch("/app/preview", {
    method: "post",
    body: fd,
  })
    .then((response) => response.text())
    .then((data) => {
      if (data == "file") {
        $(".folderpreview").jstree("destroy");
        document.getElementById("preview").innerHTML =
          '<embed type="text/pdf" src="/preview/' +
          file[0] +
          file[1] +
          '#toolbar=0"  width="700" height="800" >';
      } else {
        var datanew = JSON.parse(data);
        console.log(datanew)
        folderTreeView = $(".folderpreview");
        // Files Treeview
        if (folderTreeView.length) {
          document.getElementById("preview").innerHTML =
            '<embed type="text/pdf" src=""  width="0" height="0" >';
          $(".folderpreview").jstree("destroy");
          folderTreeView
            .on("changed.jstree", function (e, data) {
              var i, j, r, path;
              for (i = 0, j = data.selected.length; i < j; i++) {
                r = data.instance.get_node(data.selected[i]).original.path.split(/\\/g);
                path = r.slice(r.indexOf("preview") + 1, -1).join("/") + "/" + data.instance.get_node(data.selected[i]).text;
              }
              document.getElementById("preview").innerHTML =
                '<embed type="text/pdf" src="/preview/' +
                path +
                '#toolbar=0"  width="700" height="800" >';
            })
            .jstree({
              core: {
                check_callback: true,
                data: datanew,
              },
              plugins: ["types"],
              types: {
                default: {
                  icon: "far fa-folder font-medium-1",
                },
                ".jpg": {
                  icon: "far fa-file-image text-info font-medium-1",
                },
                ".docx": {
                  icon: "far fa-file-word text-info font-medium-1",
                },
                ".doc": {
                  icon: "far fa-file-word text-info font-medium-1",
                },
                ".pdf": {
                  icon: "far fa-file-pdf text-info font-medium-1",
                },
              },
            });
        }
      }
    });
}
function PreviewRemoveFile() {
  var fd = new FormData();
  fetch("/app/PreviewRemoveFile", {
    method: "post",
    body: fd,
  });
  document.getElementById("preview").src = "";
}

function renameDocument() {
  var NewDocumentName = document.getElementById("Newname").value;
  var format = /[*\\[\]:"\\|<>\/?]+/;
  if(format.test(NewDocumentName)){
    document.getElementById("filenamecant").innerHTML = "<p class='text-center'> A file name cant't contain any of the following characters:<br> \\ / : * ? <> | </p>";
  } else {
    var form = document.createElement("form");
    form.method = "POST";
    form.action = "/app/renameDocument";
    element1 = document.createElement("input");
    element2 = document.createElement("input");
    element3 = document.createElement("input");
    element1.value = NewDocumentName;
    element1.name = "NewDocumentName";
    element2.value = file[0];
    element2.name = "filesid";
    element3.value = file[1] ;
    element3.name = "minetype";
    form.appendChild(element1);
    form.appendChild(element2);
    form.appendChild(element3);
    document.body.appendChild(form);
    form.submit();
}
}
