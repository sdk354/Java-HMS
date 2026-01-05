const PageWrapper = ({ children, title }) => {
	return (
		<div className="page-animate" style={{ position: 'relative' }}>
			<div style={{
				position: 'absolute', top: '-100px', right: '-100px',
				width: '400px', height: '400px',
				background: `radial-gradient(circle, var(--accent-color) 0%, transparent 70%)`,
				opacity: 0.05, zIndex: -1
			}} />

			<h2 className="page-title" style={{ borderLeft: `4px solid var(--accent-color)`, paddingLeft: '15px' }}>
				{title}
			</h2>
			{children}
		</div>
	);
};