/**
 * @license
 * Licensed under CC BY-NC 4.0
 * https://creativecommons.org/licenses/by-nc/4.0/
 * Author: Sandiego Vieira
 */
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Head } from '@unhead/react';
import { createHead, UnheadProvider } from '@unhead/react/client';

import './App.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import heroPattern from './assets/projec4.webp';
import project2Img from './assets/project9.png';
import project3Img from './assets/project10.png';
import proje8ctImg from './assets/project8.png';

import {
  FaLinkedin,
  FaGithub,
  FaMoon,
  FaSun,
  FaCheck
} from 'react-icons/fa';

const Modal = lazy(() => import('./Modal'));

export default function App() {
  const { t, i18n } = useTranslation();
  const root = useRef(null);
  const sections = useRef([]);
  const currentIndex = useRef(0);
  const isScrolling = useRef(false);
  const [modal, setModal] = useState(null);
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showLang, setShowLang] = useState(false);
  const originalTitle = "Sandiego Vieira | Portfólio";


  const projects = [
    {
      id: 1,
      title: t('projects.0.title'),
      summary: t('projects.0.summary'),
      overview: t('projects.0.overview'),
      img: proje8ctImg,
      code: 'https://github.com/SANDIEGOVIEIRA/Django-rest-task-api',
      tools: ['Python', 'Django', 'JWT', 'Google API', 'Git'],
      type: 'backend'
    },
    {
      id: 2,
      title: t('projects.1.title'),
      summary: t('projects.1.summary'),
      overview: t('projects.1.overview'),
      img: project2Img,
      code: 'https://github.com/SANDIEGOVIEIRA/SpringBootReact',
      tools: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'],
      type: 'fullstack'
    },
    {
      id: 3,
      title: t('projects.2.title'),
      summary: t('projects.2.summary'),
      overview: t('projects.2.overview'),
      img: project3Img,
      code: 'https://github.com/SANDIEGOVIEIRA/Acessibilidade-Total',
      tools: ['JavaScript', 'Chrome API', 'TTS', 'Voice', 'Git'],
      type: 'frontend'
    },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setShowLang(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('prefers-dark');
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
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('prefers-dark', next ? '1' : '0');
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    if (!savedLang) {
      const browserLang = navigator.language || navigator.userLanguage;
      const langCode = browserLang.startsWith('en') ? 'en' : 'pt';
      i18n.changeLanguage(langCode);
    }
  }, [i18n]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-heading', { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: .8, ease: 'power2.out' });
      gsap.from('.section-title:not(.hero-heading)', { autoAlpha: 0, y: -20, duration: .8, stagger: .2, ease: 'power2.out' });
      gsap.utils.toArray('.section-content').forEach(el => {
        gsap.fromTo(el, { autoAlpha: 0, y: 20 }, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
          autoAlpha: 1,
          y: 0,
          duration: .8
        });
      });
      gsap.utils.toArray('.section').forEach((sec, i) => {
        if (i !== 0) gsap.set(sec, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: sec,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => gsap.to(sec, { autoAlpha: 1, duration: .5 }),
          onLeave: () => gsap.to(sec, { autoAlpha: 0, duration: .5 }),
          onEnterBack: () => gsap.to(sec, { autoAlpha: 1, duration: .5 }),
          onLeaveBack: () => gsap.to(sec, { autoAlpha: 0, duration: .5 }),
        });
      });
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    sections.current = gsap.utils.toArray('.section');
    const snapToSection = dir => {
      currentIndex.current = Math.min(Math.max(currentIndex.current + dir, 0), sections.current.length - 1);
      isScrolling.current = true;
      sections.current[currentIndex.current].scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => isScrolling.current = false, 650);
    };
    const onWheel = e => {
      if (modal || isScrolling.current) return;
      e.preventDefault();
      snapToSection(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [modal]);

  useEffect(() => {
    const preventTouchScroll = (e) => {
      if (modal) e.preventDefault();
    };

    // Impedir o movimento por toque enquanto o modal estiver aberto
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventTouchScroll);
    };
  }, [modal]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.language-selector')) setShowLang(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const openProject = (project, index) => {
    setModal({ ...project, index });
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setModal(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="App" ref={root} style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}>
      <Head>
        <title>{originalTitle}</title>
      </Head>

      <nav className="nav">
        <ul>
          <li><a href="#home">{t('nav.home')}</a></li>
          <li><a href="#portfolio">{t('nav.projects')}</a></li>
          <li><a href="#sobre">{t('nav.about')}</a></li>
          <li><a href="#contato">{t('nav.contact')}</a></li>
          <li className="theme-toggle">
            <button onClick={toggleTheme} aria-label="Alternar tema">
              {dark ? <FaSun color="#ffc107" /> : <FaMoon color="#000000" />}
            </button>
          </li>
          <li className={`language-selector${showLang ? ' open' : ''}`} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLang(prev => !prev)}
              aria-label="Selecionar idioma"
              className="lang-button"
              style={{
                fontSize: '1.2rem',
                background: 'transparent',
                padding: '0.25rem 0.5rem',
                borderRadius: '8px',
                transition: 'box-shadow 0.2s ease',
                boxShadow: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(200, 200, 200, 0.6)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              🌐
            </button>
            {showLang && (
              <ul
                className="lang-dropdown"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  background: dark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)',
                  color: dark ? '#fff' : '#000',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  borderRadius: '14px',
                  padding: '0.5rem 0',
                  minWidth: '240px',
                  zIndex: 999,
                  backdropFilter: 'blur(12px)',
                  overflowY: 'auto',
                  maxHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
              >
                {[{ code: 'pt', label: 'Português (Brasil)' }, { code: 'en', label: 'English' }].map(({ code, label }) => (
                  <li
                    key={code}
                    onClick={() => changeLanguage(code)}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '10px',
                      backgroundColor: i18n.language === code ? (dark ? '#333' : '#e4e4e4') : 'transparent'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = dark ? '#444' : '#f0f0f0'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = i18n.language === code ? (dark ? '#333' : '#e4e4e4') : 'transparent'}
                  >
                    <span>{label}</span>
                    {i18n.language === code && (
                      <FaCheck
                        size={14}
                        color={dark ? '#0f0' : '#007BFF'}
                        style={{ marginLeft: '1rem' }}
                      />
                    )}

                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section id="home" className="section hero-banner" style={{ backgroundImage: `url(${heroPattern})` }}>
        <h1 className="hero-heading">{t('hero.title')}<br /><span>Sandiego Vieira</span></h1>
        <p className="hero-tagline">{t('hero.subtitle')}</p>
        <a href="#portfolio" className="btn btn-light hero-btn">{t('hero.cta')}</a>
      </section>

      {/* PROJETOS */}
      <section id="portfolio" className="section portfolio bg-wave">
        <h2 className="section-title">{t('nav.projects')}</h2>
        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>{t('filter.all')}</button>
          <button onClick={() => setFilter('frontend')} className={filter === 'frontend' ? 'active' : ''}>{t('filter.frontend')}</button>
          <button onClick={() => setFilter('backend')} className={filter === 'backend' ? 'active' : ''}>{t('filter.backend')}</button>
        </div>
        <div className="portfolio-grid section-content">
          {projects
            .filter(p => filter === 'all' || p.type === filter || (filter === 'backend' && p.type === 'fullstack') || (filter === 'frontend' && p.type === 'fullstack'))
            .map((p, i) => (
              <div key={p.id} className="portfolio-item">
                <img src={p.img} alt={p.title} className="portfolio-img" />
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <button className="btn" onClick={() => openProject(p, i)}>{t('projectsButton')}</button>
              </div>
            ))
          }
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="section about bg-about">
        <h2 className="section-title">{t('about.title')}</h2>
        <div className="about-grid">
          <div className="about-content">
            <h3>Resumo</h3>
            <p>{t('about.summary')}</p>
            <a href="#contato" className="btn about-btn">{t('about.contact')}</a>
          </div>
          <div className="about-skills">
            <h3>{t('about.skills')}</h3>
            <ul className="skills-list">
              {['Python', 'Django', 'Java', 'Spring Boot', 'JavaScript', 'React', 'HTML', 'CSS', 'SQL', 'Git', 'Docker', 'MQTT', 'Firebase'].map(s => (
                <li key={s} data-skill={s.toLowerCase()}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="section contact bg-contact">
        <h2 className="section-title">{t('contact.title')}</h2>
        <p className="section-content">
          {t('contact.email')}: <a href="mailto:sandiegovieira@outlook.com">sandiegovieira@outlook.com</a>
        </p>
        <p className="section-content">
          {t('contact.phone')}: <a href="tel:+5582994181369">(82) 99418-1369</a>
        </p>
        <div className="social-icons">
          <a href="https://www.linkedin.com/in/sandiego-vieira-1574b2191/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          <a href="https://github.com/SANDIEGOVIEIRA" target="_blank" rel="noreferrer"><FaGithub /></a>
        </div>
      </section>

      {/* MODAL */}
      {modal && (
        <Suspense fallback={<div>Carregando modal...</div>}>
          <Modal modal={modal} close={closeProject} />
        </Suspense>
      )}
    </div>
  );
}
