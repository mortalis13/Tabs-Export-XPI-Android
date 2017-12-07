
var VALID_PROTOCOLS = [
  'http://',
  'https://',
  'file://',
  'about:'
];

// --------- API Utils ---------

function getActiveTab() {
  return browser.tabs.query({}).then(tabs => {
    return tabs.find(tab => tab.active);
  });
}

function activateTab(id) {
  return browser.tabs.update(id, {active: true});
}

function getOption(key, default_value) {
  return browser.storage.local.get(key).then(res => res.reload_delay || default_value);
}

function notifyMsg(id, title, msg) {
  return browser.notifications.clear(id).then(() => {
    return browser.notifications.create(id, {
      type: "basic",
      title: title,
      message: msg
    });
  });
}


// --------- JS Utils ---------

function validUrl(url) {
  for (var prot of VALID_PROTOCOLS) {
    if (url.startsWith(prot)) return true;
  }
  return false;
}

function sleep(n) {
  return new Promise(resolve => setTimeout(resolve, n));
}

function getUniqueToken() {
  var res = '';
  var d = new Date();
  
  try {
    var date = formatDate(d.getDate());
    var month = formatDate(d.getMonth() + 1);
    var year = d.getFullYear();
    var hours = formatDate(d.getHours());
    var minutes = formatDate(d.getMinutes());
    var seconds = formatDate(d.getSeconds());
    res = "" + date + month + year + "_" + hours + minutes + seconds;
  }
  catch(e) {
    res = d.getTime();
  }
  
  return res;
}

function formatDate(arg) {
  return (arg < 10)?'0'+arg: arg;
}
