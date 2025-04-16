
// Debug utility for the ImpulseLock extension
document.addEventListener('DOMContentLoaded', function() {
  const debugLog = document.getElementById('debug-log');
  const clearLogBtn = document.getElementById('clear-log');
  const refreshBtn = document.getElementById('refresh-data');
  const enableToggle = document.getElementById('enable-extension');
  const testBtnsContainer = document.getElementById('test-buttons');
  
  // Load extension state
  chrome.storage.local.get(['extensionEnabled'], function(data) {
    const isEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
    enableToggle.checked = isEnabled;
    logMessage(`Extension is currently ${isEnabled ? 'enabled' : 'disabled'}`);
  });
  
  // Toggle extension state
  enableToggle.addEventListener('change', function() {
    const isEnabled = enableToggle.checked;
    chrome.storage.local.set({ extensionEnabled: isEnabled });
    logMessage(`Extension ${isEnabled ? 'enabled' : 'disabled'}`);
  });
  
  // Clear log
  clearLogBtn.addEventListener('click', function() {
    debugLog.innerHTML = '';
    logMessage('Log cleared');
  });
  
  // Refresh data
  refreshBtn.addEventListener('click', function() {
    loadStorageData();
  });
  
  // Create test marketplace buttons
  const testSites = [
    { name: 'Amazon', url: 'https://www.amazon.com/dp/B07ZPKN6YR/' },
    { name: 'Flipkart', url: 'https://www.flipkart.com/asus-tuf-gaming-f15-core-i5-11th-gen-16-gb-512-gb-ssd-windows-11-home-4-graphics-nvidia-geforce-rtx-3050-fx506hc-hn361w-laptop/p/itm92565651dc3ed' },
    { name: 'Walmart', url: 'https://www.walmart.com/ip/Apple-AirPods-Pro-2nd-Generation-with-MagSafe-Case-USB-C/1758220329' },
    { name: 'eBay', url: 'https://www.ebay.com/itm/304681660010' }
  ];
  
  testSites.forEach(site => {
    const btn = document.createElement('button');
    btn.textContent = `Test on ${site.name}`;
    btn.className = 'test-site-btn';
    btn.addEventListener('click', function() {
      chrome.tabs.create({ url: site.url });
      logMessage(`Opening test page on ${site.name}`);
    });
    testBtnsContainer.appendChild(btn);
  });
  
  // Load and display storage data
  function loadStorageData() {
    chrome.storage.local.get(['purchaseRecords', 'userStats', 'extensionEnabled'], function(data) {
      logMessage('Current storage data:');
      logMessage(`- Extension enabled: ${data.extensionEnabled !== undefined ? data.extensionEnabled : 'true (default)'}`);
      logMessage(`- Purchase records: ${data.purchaseRecords ? data.purchaseRecords.length : 0} entries`);
      
      if (data.userStats) {
        logMessage(`- Total impulses stopped: ${data.userStats.totalImpulsesStopped}`);
        logMessage(`- Total money saved: $${data.userStats.totalMoneySaved.toFixed(2)}`);
      } else {
        logMessage('- No user stats available');
      }
    });
  }
  
  function logMessage(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    debugLog.appendChild(entry);
    // Auto-scroll to bottom
    debugLog.scrollTop = debugLog.scrollHeight;
  }
  
  // Check for content script logs
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'logDebug') {
      logMessage(`Content Script: ${request.message}`);
      sendResponse({success: true});
    }
  });
  
  // Initial data load
  loadStorageData();
  logMessage('Debug page initialized');
});

