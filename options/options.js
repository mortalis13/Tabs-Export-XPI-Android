
function saveOptions(e) {
  browser.storage.local.set({
    reload_delay: document.querySelector("#reload-delay").value
  });
  document.querySelector("#message").innerHTML = 'Options saved';
  e.preventDefault();
}

function restoreOptions() {
  var storageItem = browser.storage.local.get('reload_delay');
  storageItem.then(res => {
    document.querySelector("#reload-delay").value = res.reload_delay;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#options-form").addEventListener("submit", saveOptions);
