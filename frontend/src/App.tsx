function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Hello from React</h1>
      <p>This page is served by Nginx inside a Docker container.</p>
      <p>
        Backend health check:{' '}
        <a href="/api/health" target="_blank" rel="noreferrer">
          /api/health
        </a>
      </p>
    </main>
  );
}

export default App;
