import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

// Use in-memory storage instead of file system for serverless demo
let count = 0

const getCount = createServerFn({
  method: 'GET',
}).handler(() => {
  return count
})

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    count += data
    return count
  })

export const Route = createFileRoute('/demo/start/server-funcs')({
  component: Home,
  loader: async () => await getCount(),
})

function Home() {
  const router = useRouter()
  const state = Route.useLoaderData()

  return (
    <div className="p-4">
      <div className="mb-4 text-sm text-gray-600">
        Note: This counter is not persistent as this demo is made for a serverless environment.
      </div>
      <button
        type="button"
        onClick={() => {
          updateCount({ data: 1 }).then(() => {
            router.invalidate()
          })
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add 1 to {state}?
      </button>
    </div>
  )
}
