
browser.browserAction.onClicked.addListener(tab => exportTabs());

// ------------- Vars -------------

var VALID_PROTOCOLS = [
  'http',
  'https',
  'file',
  'about'
];

var PREPARE_WAIT = 2000;
var NOTIFY_TITLE = 'Tabs Export Add-on';


// ------------- Export -------------

async function exportTabs() {
  try {
    console.log('exportTabs()');
    PREPARE_WAIT = await getOption('reload_delay', PREPARE_WAIT);
    
    var activeTab = await getActiveTab();
    var prevTabId = activeTab && activeTab.id;
    
    await prepareTabs(prevTabId);
    activateTab(prevTabId);
    var tab_urls = await getTabsInfo();
    tab_urls_str = tab_urls.join('\n');
    
    var unique_token = getUniqueToken();
    var filename = "tabs_export_" + unique_token + ".txt";
    await saveFile(tab_urls_str, filename);
    
    notifyMsg('tabs-exported', NOTIFY_TITLE, 'Tabs exported');
    console.log('End exportTabs');
  }
  catch(e) {
    console.error('Exception exportTabs():', e);
    notifyMsg('tabs-exception', NOTIFY_TITLE, 'Inner error: ' + e);
  }
}

async function getTabsInfo() {
  console.log('getTabsInfo()');
  
  await sleep(1000);
  var tab_urls = [];
  
  var tabs = await browser.tabs.query({});
  tabs.forEach(tab => {
    var url = tab.url;
    if (validUrl(url)) {
      tab_urls.push(url);
    }
  });
  
  console.log('End getTabsInfo()');
  return tab_urls;
}

async function prepareTabs(prevTabId) {
  console.log('prepareTabs()');
  
  var tabs = await browser.tabs.query({});
  await Promise.all(tabs.map(async tab => {
    if (tab.discarded) {
      console.log('PREPARE_WAIT: ' + PREPARE_WAIT);
      var res = await activateTab(tab.id);
      await sleep(PREPARE_WAIT);
      return res;
    }
  }))
  .catch(error => {
    console.error('prepareTabs error:', error);
    notifyMsg('export-tabs-prepare-error', NOTIFY_TITLE, 'Error preparing tabs: ' + error);
  });
  
  console.log('End prepareTabs()');
}

function saveFile(value, fileName, fileType="text/plain") {
  console.log('saveFile()');
  
  var blob = new Blob([value], {type: fileType});
  var url = URL.createObjectURL(blob);

  return browser.downloads.download({url, filename: fileName})
    .then(id => console.log('Started downloading:', id))
    .catch(error => {
      console.error('Download failed:', error)
      notifyMsg('export-tabs-download-error', NOTIFY_TITLE, 'Error downloading tabs: ' + error);
    });
}
