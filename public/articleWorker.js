self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('message', async (event) => {
  if (event.data.type === 'CHECK_ARTICLES') {
    const { jobIds, clientId } = event.data;
    
    try {
      const results = await Promise.all(
        jobIds.map(jobId =>
          fetch(`https://api-d7b62b.stack.tryrelevance.com/latest/studios/e6bd882c-b1a4-4d33-a9fc-4f32d7f3aa32/async_poll/${jobId}?ending_update_only=true`, {
            headers: {
              "Authorization": "fa7659c4878d-4a1f-aff2-3ea6d1ffabf9:sk-NWFjYTEyZGYtNzdkMi00M2M3LTkxZTctYjAwZmJkZTlmZTA2"
            }
          }).then(res => res.json())
        )
      );

      // Check if any articles are complete
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const jobId = jobIds[i];
        
        if (result.type === 'complete') {
          // Save to Supabase
          const response = await fetch('https://toshxkanuhofshjqamlx.supabase.co/rest/v1/articles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2h4a2FudWhvZnNoanFhbWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjg2MzUsImV4cCI6MjA0NjkwNDYzNX0.6Kq9D8aaHdyDUuiHFyyY5ZPNGvPltc79wanqFOnNvB0',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2h4a2FudWhvZnNoanFhbWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjg2MzUsImV4cCI6MjA0NjkwNDYzNX0.6Kq9D8aaHdyDUuiHFyyY5ZPNGvPltc79wanqFOnNvB0'
            },
            body: JSON.stringify({
              client_id: clientId,
              content: result.output,
              title: "Nieuw Artikel",
              word_count: result.output.split(" ").length
            })
          });

          if (!response.ok) {
            throw new Error('Failed to save article');
          }

          // Notify all clients
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: 'ARTICLE_COMPLETE',
              jobId,
              success: true
            });
          });
        }
      }

      // Schedule next check if not all articles are complete
      const allComplete = results.every(r => r.type === 'complete' || r.type === 'failed');
      if (!allComplete) {
        setTimeout(() => {
          self.postMessage({ type: 'CHECK_ARTICLES', jobIds, clientId });
        }, 10000);
      }
    } catch (error) {
      console.error('Error in worker:', error);
    }
  }
});