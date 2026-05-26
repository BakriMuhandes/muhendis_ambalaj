import tr from '../../i18n/tr.json';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-semibold">{tr.login.title}</h1>
        <p className="mb-6 text-sm text-slate-600">{tr.login.subtitle}</p>
        <form className="space-y-4" action="/panel">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium">
              {tr.login.username}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 transition focus:ring-2"
              placeholder="ornek.kullanici"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              {tr.login.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 transition focus:ring-2"
              placeholder="******"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
          >
            {tr.login.submit}
          </button>
        </form>
      </section>
    </main>
  );
}