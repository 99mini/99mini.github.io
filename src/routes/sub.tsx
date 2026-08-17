import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sub')({
  component: SubPage,
})

function SubPage() {
  return <h1>Sub</h1>
}
