import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import useWakeLock from './hooks/useWakeLock'

function App() {
  const [count, setCount] = useState(0)
  const { isWakeLock, setIsWakeLock } = useWakeLock(false)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>
        <label>
        <input
          type="checkbox"
          checked={isWakeLock}
          onChange={(e) => setIsWakeLock(e.target.checked)}
        />
          屏幕唤起常驻
      </label>
      </h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
