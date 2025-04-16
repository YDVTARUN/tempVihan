
// Initialize storage when extension is installed
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get(['purchaseRecords', 'userStats', 'extensionEnabled'], function(data) {
    // Set default values if not already set
    const updates = {};
    
    if (!data.purchaseRecords) {
      updates.purchaseRecords = [];
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
    }
    
    if (data.extensionEnabled === undefined) {
      updates.extensionEnabled = true;
    }
    
    if (Object.keys(updates).length > 0) {
      chrome.storage.local.set(updates);
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
  
  // Set alarm to reset monthly stats (first day of month)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const msUntilNextMonth = nextMonth.getTime() - now.getTime();
  
  chrome.alarms.create('resetMonthlyStats', {
    when: Date.now() + msUntilNextMonth,
    periodInMinutes: 30 * 24 * 60 // Monthly (approx)
  });
});

// Handle alarms
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'resetWeeklyStats') {
    chrome.storage.local.get(['userStats'], function(data) {
      if (data.userStats) {
        data.userStats.weeklyImpulsesStopped = 0;
        data.userStats.weeklyMoneySaved = 0;
        chrome.storage.local.set({ userStats: data.userStats });
      }
    });
  } else if (alarm.name === 'resetMonthlyStats') {
    chrome.storage.local.get(['userStats'], function(data) {
      if (data.userStats) {
        data.userStats.monthlyImpulsesStopped = 0;
        data.userStats.monthlyMoneySaved = 0;
        chrome.storage.local.set({ userStats: data.userStats });
      }
    });
  }
});

// Message handling between popup and content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getStats') {
    chrome.storage.local.get(['userStats'], function(data) {
      sendResponse({ stats: data.userStats || {} });
    });
    return true; // Indicates async response
  }
});
