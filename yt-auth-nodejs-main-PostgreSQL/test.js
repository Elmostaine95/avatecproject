var form = document.createElement("form");
form.method = "POST";
form.action = "/app/downloadfile";
var checkboxesFI = document.getElementsByName("file");
elementfl = document.createElement("input");
elementfl.value = checkboxesFI[i].value;
elementfl.name = "file" + i;
form.appendChild(elementfl);
ocument.body.appendChild(form);
form.submit();
