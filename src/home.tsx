import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Link } from './components/Link'

function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Bitcoin is Freedom</h1>
        <img src="/images/maxvette_Bitcoin-is-Freedom.jpg" alt="Bitcoin is Freedom" />
      </div>
      <div className="content">
        <p>Welcome to my page</p>
        <h2>Bitcoin Links</h2>
        <ul>
          <li><Link href="/bitcoin.html">Bitcoin</Link></li>
          <li><Link href="https://nakamotobook.com/" external>Nakamoto Book</Link></li>
        </ul>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>
)
