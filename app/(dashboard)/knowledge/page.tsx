import { redirect } from 'next/navigation'

export default function KnowledgePage() {
  // Redirect to agent setup with the knowledge tab selected
  redirect('/agent-setup?tab=knowledge')
}
