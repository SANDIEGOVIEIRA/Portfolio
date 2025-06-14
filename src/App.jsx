// src/App.jsx (com correções finais e split de código)
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import './App.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import profileImage from './assets/profile.jpg';
import heroPattern from './assets/hero-pattern.svg';

import project2Img from './assets/project9.png';
import project3Img from './assets/project10.png';
import proje8ctImg from './assets/project8.png';

import {
  FaLinkedin,
  FaGithub,
  FaMoon,
  FaSun
} from 'react-icons/fa';

const Modal = lazy(() => import('./Modal'));

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'TaskAPI – Django + Google Calendar',
    summary: 'API RESTful de tarefas com JWT e Google Calendar.',
    overview: 'API para gestão de tarefas com autenticação JWT, integração com Google Calendar e testes automatizados.',
    img: proje8ctImg,
    code: 'https://github.com/SANDIEGOVIEIRA/Django-rest-task-api',
    tools: ['Python','Django','JWT','Google API','Git'],
  },
  {
    id: 2,
    title: 'SpringBoot + React',
    summary: 'CRUD completo com autenticação.',
    overview: 'Projeto full-stack: backend Spring Boot, front-end React, cadastro de produtos e segurança via token.',
    img: project2Img,
    code: 'https://github.com/SANDIEGOVIEIRA/SpringBootReact',
    tools: ['Java','Spring Boot','React','PostgreSQL','Docker'],
  },
  {
    id: 3,
    title: 'Acessibilidade Total',
    summary: 'Extensão Chrome de leitura por voz.',
    overview: 'Extensão para o Google Chrome voltada à acessibilidade digital. Oferece leitura por voz, comandos por voz em português, modo de alto contraste e ajuste de fonte em qualquer site, com foco em inclusão e usabilidade.',
    img: project3Img,
    code: 'https://github.com/SANDIEGOVIEIRA/Acessibilidade-Total',
    tools: ['JavaScript','Chrome API','TTS','Voice','Git'],
  },
];

export default function App() {
  const root = useRef(null);
  const sections = useRef([]);
  const currentIndex = useRef(0);
  const isScrolling = useRef(false);
  const [modal, setModal] = useState(null);
  const [dark, setDark] = useState(false);

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
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-heading',{autoAlpha:0,y:-20},{autoAlpha:1,y:0,duration:.8,ease:'power2.out'});
      gsap.from('.section-title:not(.hero-heading)',{autoAlpha:0,y:-20,duration:.8,stagger:.2,ease:'power2.out'});
      gsap.utils.toArray('.section-content').forEach(el => {
        gsap.fromTo(el,{autoAlpha:0,y:20},{scrollTrigger:{trigger:el,start:'top 80%'},autoAlpha:1,y:0,duration:.8});
      });
      gsap.utils.toArray('.section').forEach((sec,i)=>{
        if(i!==0) gsap.set(sec,{autoAlpha:0});
        ScrollTrigger.create({
          trigger:sec,start:'top center',end:'bottom center',
          onEnter:()=>gsap.to(sec,{autoAlpha:1,duration:.5}),
          onLeave:()=>gsap.to(sec,{autoAlpha:0,duration:.5}),
          onEnterBack:()=>gsap.to(sec,{autoAlpha:1,duration:.5}),
          onLeaveBack:()=>gsap.to(sec,{autoAlpha:0,duration:.5})
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

  const openProject = p => { setModal(p); document.body.style.overflow = 'hidden'; };
  const closeProject = () => { setModal(null); document.body.style.overflow = 'auto'; };

  return (
    <div className="App" ref={root} style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}>
      {/* NAVBAR */}
      <nav className="nav">
        <ul>
          <li><a href="#home">Início</a></li>
          <li><a href="#portfolio">Projetos</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>
          <li className="theme-toggle">
            <button onClick={toggleTheme} aria-label="Alternar tema">
              {dark ? <FaSun color="#ffc107" /> : <FaMoon color="#000000" />}
            </button>
          </li>
          {/*<li className="nav-logo"> (logo de nav bar)
            <img src={profileImage} alt="Perfil" className="nav-profile" />
          </li>*/}
        </ul>
      </nav>

     {/* HERO */}
      <section
        id="home"
        className="section hero-banner"
        style={{ backgroundImage: `url(${heroPattern})` }}
      >
        <h1 className="hero-heading">
          Olá, eu sou<br />
          <span>Sandiego Vieira</span>
        </h1>
        <p className="hero-tagline">
          Construindo soluções back-end eficientes com foco em performance e automação.
        </p>
        <a href="#portfolio" className="btn btn-light hero-btn">
          Ver Projetos
        </a>
      </section>


      {/* PROJETOS */}
      <section id="portfolio" className="section portfolio bg-wave">
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
      <section id="sobre" className="section about bg-about">
        <h2 className="section-title">Sobre Mim</h2>
        <p className="about-subtitle"></p>
        <div className="about-grid">
          <div className="about-content">
            <h3>Resumo</h3>
            <p>Sou <strong>Sandiego Vieira</strong>, graduando em Ciência da Computação (7º período) focado em back-end com Python/Django e Java/Spring Boot.</p>
            <p>Experiência em <strong>REST APIs</strong>, JWT, Google APIs, automação MQTT e extensões para <strong>acessibilidade digital</strong>.</p>
            <a href="#contato" className="btn about-btn">Entrar em Contato</a>
          </div>
          <div className="about-skills">
            <h3>Minhas Habilidades</h3>
            <ul className="skills-list">
              {[ 'Python','Django','Java','Spring Boot','JavaScript','React','HTML','CSS','SQL','Git','Docker','MQTT','Firebase' ].map(s => (
                <li key={s} data-skill={s.toLowerCase()}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="section contact bg-contact">
        <h2 className="section-title">Contato</h2>
        <p className="section-content">
          Email: <a href="mailto:sandiegovieira@outlook.com">sandiegovieira@outlook.com</a>
        </p>
        <p className="section-content">
          Telefone: <a href="tel:+5582994181369">(82) 99418-1369</a>
        </p>
        <div className="social-icons">
          <a href="https://www.linkedin.com/in/sandiego-vieira-1574b2191/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          <a href="https://github.com/SANDIEGOVIEIRA" target="_blank" rel="noreferrer"><FaGithub /></a>
        </div>
      </section>

      {/* MODAL COM SPLIT */}
      {modal && (
        <Suspense fallback={<div>Carregando modal...</div>}>
          <Modal modal={modal} close={closeProject} />
        </Suspense>
      )}
    </div>
  );
}
