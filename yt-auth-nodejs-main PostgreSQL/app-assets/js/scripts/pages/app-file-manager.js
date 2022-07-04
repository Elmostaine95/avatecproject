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
    zip.file(files[i].name, files.i);
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    var fd = new FormData();
    fd.append("upl", content, files[0].webkitRelativePath.split("/")[0]);
    fetch("/app/folder-upload", {
      method: "post",
      body: fd,
    });
  });
  function timedRefresh(timeoutPeriod) {
    setTimeout("location.reload(true);", timeoutPeriod);
  }
  window.onload = timedRefresh(700);
}
