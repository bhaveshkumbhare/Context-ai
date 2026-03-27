import ContextForm from './components/ContextForm'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <header className="text-center flex flex-col gap-2">
          <div className="flex justify-center items-center gap-3">
            <span className="text-4xl" aria-hidden="true">🔀</span>
            <h1 className="text-3xl font-bold text-gray-900">Context AI</h1>
          </div>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Enter your task or context prompt and get an optimized version for every
            major AI assistant — so you always get the same great result, no matter
            which AI you&apos;re using.
          </p>
        </header>

        {/* How it works */}
        <section
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
          aria-label="How it works"
        >
          {[
            { icon: '✍️', title: 'Describe your task', desc: 'Write what you need help with in plain language.' },
            { icon: '🧠', title: 'We detect & route', desc: 'The app categorizes your task and finds the best AI for it.' },
            { icon: '📋', title: 'Copy & paste', desc: 'Get a tailored prompt for each AI and copy it in one click.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-2 shadow-sm">
              <span className="text-3xl" aria-hidden="true">{icon}</span>
              <p className="font-semibold text-gray-800 text-sm">{title}</p>
              <p className="text-gray-500 text-xs">{desc}</p>
            </div>
          ))}
        </section>

        {/* Main form */}
        <main>
          <ContextForm />
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400">
          Context AI — helping you switch AI assistants without losing your train of thought.
        </footer>
      </div>
    </div>
  )
}
