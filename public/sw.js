self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');

  // Envolvemos TUDO em uma Promise para o iOS não matar o Service Worker prematuramente
  const promiseChain = Promise.resolve().then(() => {
    let data = {};
    
    // Leitura segura do payload
    if (event.data) {
      try {
        data = event.data.json();
      } catch (e) {
        console.warn('[Service Worker] Push data is not JSON, treating as text');
        data = { 
          title: 'TikTok Shop 🔔', 
          body: event.data.text() 
        };
      }
    } else {
      data = { title: 'TikTok Shop 🔔', body: 'Você tem uma nova atualização.' };
    }
    
    const title = data.title || 'TikTok Shop 🔔';
    const options = {
      body: data.body || 'Verifique os detalhes no seu painel.',
      icon: '/logo-do-tik-tok_578229-290.jpg',
      // ATENÇÃO: vibrate e badge removidos propositalmente para compatibilidade com iOS
      tag: data.tag || 'order-update',
      renotify: true,
      data: {
        url: data.url || '/dashboard'
      }
    };

    return self.registration.showNotification(title, options);
  });

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// ESCUDO DE PROTEÇÃO: Detecta quando a subscrição expira ou muda e avisa o app
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker]: Push subscription has expired or changed.');
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
    .then(function(newSubscription) {
      // Aqui o app precisaria ser avisado para atualizar no banco
      // Por enquanto, apenas logamos para depuração via chrome://inspect
      console.log('[Service Worker]: New subscription generated', newSubscription);
    })
  );
});

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
