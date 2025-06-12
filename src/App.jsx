// src/App.js
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import profileImage from './assets/profile.jpg';
import heroPattern  from './assets/hero-pattern.svg';

import project1Img  from './assets/project1.jpg';
import project2Img  from './assets/project2.jpg';
import project3Img  from './assets/project3.jpg';

import {
  FaLinkedin,
  FaGithub,
  FaTimes,
  FaMoon,
  FaSun,
} from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────
   Dados dos projetos
────────────────────────────────────────────── */
const projects = [
  {
    id: 1,
    title   : 'Django-rest-task-api',
    summary : 'API RESTful de tarefas com JWT e Google Calendar.',
    overview: 'API para gestão de tarefas com autenticação JWT, integração com Google Calendar e testes automatizados.',
    img     : project1Img,
    code    : 'https://github.com/SANDIEGOVIEIRA/COMPILER',
    tools   : ['Python','Django','JWT','Google API','Git'],
  },
  {
    id: 2,
    title   : 'SpringBoot + React',
    summary : 'CRUD completo com autenticação.',
    overview: 'Projeto full-stack: backend Spring Boot, front-end React, cadastro de produtos, segurança via token.',
    img     : project2Img,
    code    : 'https://github.com/SANDIEGOVIEIRA/SpringBootReact',
    tools   : ['Java','Spring Boot','React','PostgreSQL','Docker'],
  },
  {
    id: 3,
    title   : 'Acessibilidade-Total',
    summary : 'Extensão Chrome de leitura por voz.',
    overview: 'Extensão que oferece alto contraste, leitura por voz e comandos de voz em português, focada em inclusão digital.',
    img     : project3Img,
    code    : 'https://github.com/SANDIEGOVIEIRA/Acessibilidade-Total',
    tools   : ['JavaScript','Chrome API','TTS','Voice','Git'],
  },
];

export default function App() {
  const root         = useRef(null);
  const sections     = useRef([]);          // lista de seções
  const isScrolling  = useRef(false);       // trava para o snap
  const currentIndex = useRef(0);           // índice da seção atual

  const [modal, setModal] = useState(null);
  const [dark , setDark ] = useState(false);

  /* ─────────── Tema claro / escuro ─────────── */
  useEffect(() => {
    const saved     = localStorage.getItem('prefers-dark');
    const prefersOS = window.matchMedia('(prefers-color-scheme:dark)').matches;
    const startDark = saved === '1' || (saved === null && prefersOS);

    if (startDark) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => document.documentElement.classList.remove('theme-transition'), 400);

    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('prefers-dark', nextDark ? '1' : '0');
  };

  /* ─────────── Animações GSAP ─────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-heading',
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: .8, ease: 'power2.out' });

      gsap.from('.section-title:not(.hero-heading)', {
        autoAlpha: 0, y: -20, duration: .8, ease: 'power2.out', stagger: .2 });

      gsap.utils.toArray('.section-content').forEach(el => {
        gsap.fromTo(el, { autoAlpha: 0, y: 20 },
          { scrollTrigger: { trigger: el, start: 'top 80%' },
            autoAlpha: 1, y: 0, duration: .8 });
      });

      /* fade-in/fade-out das seções */
      gsap.utils.toArray('.section').forEach((sec, i) => {
        if (i !== 0) gsap.set(sec, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: sec,
          start  : 'top center',
          end    : 'bottom center',
          onEnter:       () => gsap.to(sec, { autoAlpha: 1, duration: .5 }),
          onLeave:       () => gsap.to(sec, { autoAlpha: 0, duration: .5 }),
          onEnterBack:   () => gsap.to(sec, { autoAlpha: 1, duration: .5 }),
          onLeaveBack:   () => gsap.to(sec, { autoAlpha: 0, duration: .5 }),
        });
      });

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  /* ─────────── Snap entre seções (wheel) ─────────── */
  useEffect(() => {
    sections.current = gsap.utils.toArray('.section');
    const onWheel = (e) => {
      if (modal || isScrolling.current) return;        // ignore quando modal aberto ou scroll em curso
      e.preventDefault();

      const dir = e.deltaY > 0 ? 1 : -1;
      currentIndex.current = Math.min(
        Math.max(currentIndex.current + dir, 0),
        sections.current.length - 1
      );

      isScrolling.current = true;
      sections.current[currentIndex.current]
        .scrollIntoView({ behavior: 'smooth' });

      // libera a trava após a duração do smooth-scroll (~600 ms)
      setTimeout(() => { isScrolling.current = false; }, 650);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [modal]);

  /* ─────────── Modal helpers ─────────── */
  const openProject  = (p) => { setModal(p); document.body.style.overflow = 'hidden'; };
  const closeProject = () => { setModal(null); document.body.style.overflow = 'auto'; };

  /* ─────────── Render ─────────── */
  return (
    <div
      className="App"
      ref={root}
      /* scroll-snap nativo como fallback */
      style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}
    >
      {/* NAVBAR */}
      <nav className="nav">
        <ul>
          <li><a href="#home">Início</a></li>
          <li><a href="#portfolio">Projetos</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>

          {/* Tema claro / escuro */}
          <li className="theme-toggle">
            <button onClick={toggleTheme} aria-label="Alternar tema">
              {dark
                ? <FaSun  color="#ffc107" />
                : <FaMoon color="#000000" />}
            </button>
          </li>

          <li className="nav-logo">
            <img src={profileImage} alt="Perfil" className="nav-profile" />
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="section hero-banner"
        style={{ backgroundImage: `url(${heroPattern})`, scrollSnapAlign: 'start' }}
      >
        <h1 className="hero-heading">Olá, eu sou<br /><span>Sandiego Vieira</span></h1>
        <p className="hero-tagline">Desenvolvedor back-end apaixonado por APIs e automação.</p>
        <a href="#portfolio" className="btn btn-light hero-btn">Ver Projetos</a>
      </section>

      {/* PROJETOS */}
      <section
        id="portfolio"
        className="section portfolio bg-wave"
        style={{ scrollSnapAlign: 'start' }}
      >
        <h2 className="section-title">Projetos</h2>
        <div className="portfolio-grid section-content">
          {projects.map(p => (
            <div key={p.id} className="portfolio-item">
              <img src={p.img} alt={p.title} className="portfolio-img" />
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <button className="btn" onClick={() => openProject(p)}>Ver Detalhes</button>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section
        id="sobre"
        className="section about bg-about"
        style={{ scrollSnapAlign: 'start' }}
      >
        <h2 className="section-title">Sobre Mim</h2>
        <p className="about-subtitle">Criando soluções inteligentes com APIs e automações.</p>

        <div className="about-grid">
          <div className="about-content">
            <h3>Venha me conhecer!</h3>
            <p>Sou <strong>Sandiego Vieira</strong>, graduando em Ciência da Computação (7º período) em Maceió-AL, focado em back-end com Python/Django e Java/Spring Boot.</p>
            <p>Tenho experiência em <strong>REST APIs</strong> com JWT, integrações com Google APIs, automações MQTT e extensões voltadas à <strong>acessibilidade digital</strong>. Gosto de aprender, compartilhar conhecimento e construir produtos que melhorem a vida das pessoas.</p>
            <a href="#contato" className="btn about-btn">Entrar em Contato</a>
          </div>

          <div className="about-skills">
            <h3>Minhas Habilidades</h3>
            <ul className="skills-list">
              {[
                'Python','Django','Java','Spring Boot','JavaScript','React',
                'HTML','CSS','SQL','Git','Docker','MQTT','Firebase'
              ].map(s => (
                <li key={s} data-skill={s.toLowerCase()}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section
        id="contato"
        className="section contact"
        style={{ scrollSnapAlign: 'start' }}
      >
        <h2 className="section-title">Contato</h2>
        <p className="section-content">
          Email: <a href="mailto:sandiegovieira@outlook.com">sandiegovieira@outlook.com</a>
        </p>
        <p className="section-content">
          Telefone: <a href="tel:+5582994181369">(82) 99418-1369</a>
        </p>
      </section>

      {/* FOOTER */}
      <footer
        className="footer"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="footer-content">
          <div className="footer-about">
            <h3>Sandiego Vieira</h3>
            <p>Back-end • Automação</p>
          </div>
          <div className="footer-social">
            <h4>Social</h4>
            <div className="social-icons">
              <a href="https://www.linkedin.com/in/sandiego-vieira-1574b2191/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href="https://github.com/SANDIEGOVIEIRA" target="_blank" rel="noreferrer"><FaGithub /></a>
            </div>
          </div>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Sandiego Vieira</p>
      </footer>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={closeProject}>
          <div
            className="modal modal-row"
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeProject}><FaTimes /></button>

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
                <a
                  href={modal.code}
                  className="btn btn-outline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Código
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
