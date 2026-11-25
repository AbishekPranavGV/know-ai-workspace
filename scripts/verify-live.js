const routes = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/notes',
  '/tasks',
  '/calendar',
  '/goals',
  '/analytics',
  '/files',
  '/team',
  '/integrations',
  '/chat',
  '/learning',
  '/security',
  '/settings',
  '/api/analytics',
  '/api/files',
  '/api/workspace/members',
  '/api/integrations',
  '/api/notes',
  '/api/tasks',
  '/api/calendar/events',
  '/api/goals',
  '/api/learning/flashcards',
  '/api/security/sessions',
  '/api/security/audit-logs',
  '/api/notifications'
];

async function checkRoutes() {
  let passed = 0;
  for (const r of routes) {
    try {
      const res = await fetch('http://localhost:3000' + r);
      console.log(`[${res.status}] ${r}`);
      if (res.status === 200) passed++;
      else {
        const text = await res.text();
        console.log(`       Error preview: ${text.slice(0, 150)}`);
      }
    } catch (e) {
      console.error(`[FAIL] ${r} -> ${e.message}`);
    }
  }
  console.log(`\nTOTAL PASSED: ${passed}/${routes.length}`);
}

checkRoutes();
