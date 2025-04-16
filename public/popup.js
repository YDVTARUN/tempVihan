
document.addEventListener('DOMContentLoaded', function() {
  // Load stats from storage
  chrome.storage.local.get(['userStats', 'extensionEnabled'], function(data) {
    const stats = data.userStats || { 
      totalImpulsesStopped: 0, 
      totalMoneySaved: 0 
    };
    
    const isEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
    
    // Update UI with stats
    document.getElementById('impulses-stopped').textContent = stats.totalImpulsesStopped;
    document.getElementById('money-saved').textContent = '$' + stats.totalMoneySaved.toFixed(2);
    
    // Set button state
    const toggleButton = document.getElementById('toggle-extension');
    toggleButton.textContent = isEnabled ? 'Enabled' : 'Disabled';
    toggleButton.style.backgroundColor = isEnabled ? '#8B5CF6' : '#9CA3AF';
    
    // Add button event listeners
    document.getElementById('open-dashboard').addEventListener('click', function() {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    });
    
    toggleButton.addEventListener('click', function() {
      const newState = !isEnabled;
      chrome.storage.local.set({ extensionEnabled: newState }, function() {
        toggleButton.textContent = newState ? 'Enabled' : 'Disabled';
        toggleButton.style.backgroundColor = newState ? '#8B5CF6' : '#9CA3AF';
      });
    });
  });
});
