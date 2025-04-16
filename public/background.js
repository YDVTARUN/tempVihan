
// Initialize storage when extension is installed
chrome.runtime.onInstalled.addListener(function() {
  console.log("ImpulseLock: Extension installed or updated");
  
  chrome.storage.local.get(['purchaseRecords', 'userStats', 'extensionEnabled'], function(data) {
    // Set default values if not already set
    const updates = {};
    
    if (!data.purchaseRecords) {
      updates.purchaseRecords = [];
      console.log("ImpulseLock: Initializing empty purchase records");
    }
    
    if (!data.userStats) {
      updates.userStats = {
        totalImpulsesStopped: 0,
        totalMoneySaved: 0,
        weeklyImpulsesStopped: 0,
        weeklyMoneySaved: 0,
        monthlyImpulsesStopped: 0,
        monthlyMoneySaved: 0
      };
      console.log("ImpulseLock: Initializing default user stats");
    }
    
    if (data.extensionEnabled === undefined) {
      updates.extensionEnabled = true;
      console.log("ImpulseLock: Setting extension to enabled by default");
    }
    
    if (Object.keys(updates).length > 0) {
      chrome.storage.local.set(updates, function() {
        console.log("ImpulseLock: Default values initialized successfully");
      });
    }
  });
  
  // Reset weekly stats every Sunday
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  const msUntilSunday = daysUntilSunday * 24 * 60 * 60 * 1000;
  
  // Set alarm to reset weekly stats
  chrome.alarms.create('resetWeeklyStats', {
    when: Date.now() + msUntilSunday,
    periodInMinutes: 7 * 24 * 60 // Weekly
  });
  console.log("ImpulseLock: Weekly stats reset alarm set for", new Date(Date.now() + msUntilSunday));
  
  // Set alarm to reset monthly stats (first day of month)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const msUntilNextMonth = nextMonth.getTime() - now.getTime();
  
  chrome.alarms.create('resetMonthlyStats', {
    when: Date.now() + msUntilNextMonth,
    periodInMinutes: 30 * 24 * 60 // Monthly (approx)
  });
  console.log("ImpulseLock: Monthly stats reset alarm set for", nextMonth);
});

// Handle alarms
chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log("ImpulseLock: Alarm triggered:", alarm.name);
  
  if (alarm.name === 'resetWeeklyStats') {
    chrome.storage.local.get(['userStats'], function(data) {
      if (data.userStats) {
        data.userStats.weeklyImpulsesStopped = 0;
        data.userStats.weeklyMoneySaved = 0;
        chrome.storage.local.set({ userStats: data.userStats });
        console.log("ImpulseLock: Weekly stats reset");
      }
    });
  } else if (alarm.name === 'resetMonthlyStats') {
    chrome.storage.local.get(['userStats'], function(data) {
      if (data.userStats) {
        data.userStats.monthlyImpulsesStopped = 0;
        data.userStats.monthlyMoneySaved = 0;
        chrome.storage.local.set({ userStats: data.userStats });
        console.log("ImpulseLock: Monthly stats reset");
      }
    });
  }
});

// Message handling between popup and content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("ImpulseLock: Message received in background script:", request);
  
  if (request.action === 'getStats') {
    chrome.storage.local.get(['userStats'], function(data) {
      console.log("ImpulseLock: Sending stats to popup:", data.userStats || {});
      sendResponse({ stats: data.userStats || {} });
    });
    return true; // Indicates async response
  } else if (request.action === 'logInfo') {
    console.log("ImpulseLock Content Script:", request.message);
    sendResponse({ success: true });
    return true;
  }
});

// Include this to make extension icon clickable
chrome.action.onClicked.addListener((tab) => {
  console.log("ImpulseLock: Extension icon clicked");
  chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});

