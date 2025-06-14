/**
 * @license
 * Licensed under CC BY-NC 4.0
 * https://creativecommons.org/licenses/by-nc/4.0/
 * Author: Sandiego Vieira
 */

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function Modal({ modal, close }) {
  const [fullscreen, setFullscreen] = useState(false);

  if (!modal) return null;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal modal-row" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><FaTimes /></button>

        <div className="modal-image">
          <img
            src={modal.img}
            alt={modal.title}
            onClick={() => setFullscreen(true)}
            className="clickable-image"
          />
          <h4 className="tools-title">Ferramentas usadas</h4>
          <ul className="skills-list modal-skills">
            {modal.tools.map(t => (
              <li key={t} data-skill={t.toLowerCase()}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="modal-info">
          <h2>{modal.title}</h2>
          <h4>Visão geral do projeto</h4>
          <p>{modal.overview}</p>
          <div className="modal-links">
            <a href={modal.code} className="btn btn-outline" target="_blank" rel="noreferrer">Código</a>
          </div>
        </div>

        {/* Lightbox fullscreen */}
        {fullscreen && (
          <div className="lightbox" onClick={() => setFullscreen(false)}>
            <img src={modal.img} alt={`Visualização de ${modal.title}`} />
            <button className="lightbox-close" onClick={() => setFullscreen(false)}>×</button>
          </div>
        )}
      </div>
    </div>
  );
}
