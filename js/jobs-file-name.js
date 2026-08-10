/*
  jobs-file-name.js — echoes the chosen file's name next to the CV upload
  (/jobs/, the Bewerbungsformular).

  WHY IT EXISTS. Client 2026-08-05: "sacame lo de no file chosen, solo que quede el
  botón de Choose File". The browser paints that text itself, as part of the file
  input's own shadow content, and CSS can only reach the BUTTON
  (`::file-selector-button`) — so hiding the text means `color: transparent` on the
  input, which hides the empty-state string AND the chosen file's name with it
  (css/page-jobs.css). On a form whose whole point is attaching a CV, picking a file
  and seeing nothing change is worse than the "No file chosen" it removes. This puts
  the name back, visibly, and only once there is one.

  The value is still in the accessibility tree either way — it is the input's own
  value — which is why the echo carries aria-hidden in the markup: a screen reader
  already announces the file, and this would be the second announcement.

  JS-ONLY-EVER-ENHANCES, same contract as every other script here: the echo element
  is empty in the markup and nothing in CSS depends on this file. With no JS, a
  script error or a crawler, the field is the button on its own — exactly the state
  the client asked for.

  Generic hook, so a second upload anywhere gets it for free:
      <input type="file" data-file-name-target="#some-id">
      <p id="some-id" class="…" aria-hidden="true"></p>
*/

(function initJobsFileName() {
  var inputs = document.querySelectorAll("input[type=file][data-file-name-target]");
  if (!inputs.length) return;

  Array.prototype.forEach.call(inputs, function (input) {
    var target = document.querySelector(
      input.getAttribute("data-file-name-target")
    );
    if (!target) return;

    input.addEventListener("change", function () {
      var file = input.files && input.files[0];
      // Cleared (the visitor opened the picker and cancelled, or removed the
      // file): back to nothing, not to a stale name.
      target.textContent = file ? file.name : "";
    });
  });
})();
