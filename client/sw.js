//Service Worker

//Listen for push notification
self.addEventListener('push',(e) => {
  self.registration.showNotification(e.data.text())
})
