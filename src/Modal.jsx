import { FaTimes } from 'react-icons/fa';

export default function Modal({ modal, close }) {
  if (!modal) return null;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal modal-row" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><FaTimes /></button>

        <div className="modal-image">
          <img src={modal.img} alt={modal.title} />
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
      </div>
    </div>
  );
}
