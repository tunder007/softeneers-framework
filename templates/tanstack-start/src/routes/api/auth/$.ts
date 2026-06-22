import { createFileRoute } from '@tanstack/react-router'

import { auth } from '../../../server/auth'

// Catch-all server route: better-auth speaks the Fetch API, so hand it the raw
// Request and return its Response. Handles every /api/auth/* endpoint.
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
})
