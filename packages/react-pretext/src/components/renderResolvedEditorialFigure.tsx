import type { ResolvedEditorialFigure } from '../lib/editorialFigures'

function renderResolvedEditorialFigure(figure: ResolvedEditorialFigure, index: number) {
  return (
    <div
      key={index}
      className={figure.className}
      style={{
        position: 'absolute',
        left: `${figure.x}px`,
        top: `${figure.y}px`,
        width: `${figure.width}px`,
        height: `${figure.height}px`,
        ...figure.style,
      }}
    >
      {figure.content}
    </div>
  )
}

export { renderResolvedEditorialFigure }
