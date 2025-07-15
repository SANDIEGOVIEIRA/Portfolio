/**
 * @license
 * Licensed under CC BY-NC 4.0
 * https://creativecommons.org/licenses/by-nc/4.0/
 * Author: Sandiego Vieira
 */

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Modal({ modal, close }) {
  const { t } = useTranslation();
  const [fullscreen, setFullscreen] = useState(false);

  if (!modal) return null;

  // Verificação de índice
  const title = modal.index !== undefined ? t(`projects.${modal.index}.title`, modal.title) : modal.title;
  const overview = modal.index !== undefined ? t(`projects.${modal.index}.overview`, modal.overview) : modal.overview;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal modal-row" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><FaTimes /></button>

        <div className="modal-image">
          <img
            src={modal.img}
            alt={title}
            onClick={() => setFullscreen(true)}
            className="clickable-image"
          />
          <h4 className="tools-title">{t('modal.tools')}</h4>
          <ul className="skills-list modal-skills">
            {modal.tools.map(tl => (
              <li key={tl} data-skill={tl.toLowerCase()}>{tl}</li>
            ))}
          </ul>
        </div>

        <div className="modal-info">
          <h2>{title}</h2>
          <h4>{t('modal.overview')}</h4>
          <p>{overview}</p>
          <div className="modal-links">
            <a href={modal.code} className="btn btn-outline" target="_blank" rel="noreferrer">
              {t('modal.code')}
            </a>
          </div>
        </div>

        {/* Lightbox fullscreen */}
        {fullscreen && (
          <div className="lightbox" onClick={() => setFullscreen(false)}>
            <img src={modal.img} alt={`Fullscreen ${title}`} />
            <button className="lightbox-close" onClick={() => setFullscreen(false)}>×</button>
          </div>
        )}
      </div>
    </div>
  );
}
