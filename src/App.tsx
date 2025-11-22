import React, { useState } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Entity from './pages/Entity'
import EnvironmentSwitcher from './components/EnvironmentSwitcher'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: '20px', textAlign: 'center' }}>
					<h2>Something went wrong</h2>
					<button onClick={() => this.setState({ hasError: false })}>
						Try again
					</button>
				</div>
			)
		}
		return this.props.children
	}
}

function App() {
	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<ThemeProvider>
			<ErrorBoundary>
				<Router>
					{/* NAVBAR */}
					<nav
						style={{
							position: 'fixed',
							top: 0,
							left: 0,
							right: 0,
							padding: '15px 20px',
							backgroundColor: 'var(--nav-bg)',
							color: 'white',
							zIndex: 1000,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							transition: 'background-color 0.3s ease',
						}}
					>
						{/* LOGO */}
						<Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
							<h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
								Tundikhel
							</h1>
						</Link>

						{/* HAMBURGER ICON (MOBILE ONLY) */}
						<div
							onClick={() => setMenuOpen(!menuOpen)}
							style={{
								display: 'none',
								cursor: 'pointer',
							}}
							className="mobile-hamburger"
						>
							<div
								style={{
									width: '25px',
									height: '3px',
									background: 'white',
									margin: '5px 0',
								}}
							></div>
							<div
								style={{
									width: '25px',
									height: '3px',
									background: 'white',
									margin: '5px 0',
								}}
							></div>
							<div
								style={{
									width: '25px',
									height: '3px',
									background: 'white',
									margin: '5px 0',
								}}
							></div>
						</div>

						{/* DESKTOP NAV ITEMS */}
						<div
							className="desktop-menu"
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '20px',
							}}
						>
							<Link to="/" style={{ textDecoration: 'none' }}>
								<button style={navButtonStyle}>Home</button>
							</Link>

							<a
								href="https://nes.newnepal.org"
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: 'none' }}
							>
								<button style={navButtonStyle}>NES Docs</button>
							</a>

							<ThemeToggle />

							<a
								href="https://github.com/NewNepal-org/NepalEntityService-Tundikhel"
								target="_blank"
								rel="noopener noreferrer"
								style={{ color: 'white', textDecoration: 'none' }}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="currentColor"
									style={{ cursor: 'pointer' }}
								>
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
							</a>

							<EnvironmentSwitcher />
						</div>
					</nav>

					{/* MOBILE MENU (SLIDE DOWN) */}
					{menuOpen && (
						<div
							className="mobile-menu"
							style={{
								position: 'fixed',
								top: '50px',
								left: 0,
								right: 0,
								backgroundColor: 'var(--nav-bg)',
								padding: '20px',
								display: 'flex',
								flexDirection: 'column',
								gap: '15px',
								zIndex: 999,
								alignItems: 'end',
							}}
						>
							<Link
								to="/"
								onClick={() => setMenuOpen(false)}
								style={{ textDecoration: 'none' }}
							>
								<button style={navButtonStyle}>Home</button>
							</Link>

							<a
								href="https://nes.newnepal.org"
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: 'none' }}
							>
								<button style={navButtonStyle}>NES Docs</button>
							</a>

							<ThemeToggle />

							<EnvironmentSwitcher />

							<a
								href="https://github.com/NewNepal-org/NepalEntityService-Tundikhel"
								target="_blank"
								rel="noopener noreferrer"
								style={{ color: 'white', textDecoration: 'none' }}
							>
								GitHub
							</a>
						</div>
					)}

					{/* PAGE CONTENT */}
					<div style={{ marginTop: '80px' }}>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/entity" element={<Entity />} />
							<Route path="/entity/*" element={<Entity />} />
						</Routes>
					</div>
				</Router>
			</ErrorBoundary>
		</ThemeProvider>
	)
}

const navButtonStyle: React.CSSProperties = {
	padding: '8px 16px',
	backgroundColor: 'transparent',
	color: 'white',
	border: '1px solid white',
	borderRadius: '4px',
	cursor: 'pointer',
}

export default App
