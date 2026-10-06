/**
 * NASA Space Apps Challenge 2026 Brasil • Frontend Logic
 * Canvas Starfield, Live Countdown, Interactive Challenge Explorer, Brazil Events Finder & FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initCountdown();
  initMobileMenu();
  initChallenges();
  initEvents();
  initFAQ();
  initModal();
});

/* ==========================================================================
   1. Canvas Starfield Background
   ========================================================================== */
function initStarfield() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const numStars = Math.min(180, Math.floor((width * height) / 8000));

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  // Shooting star
  let shootingStar = null;
  function maybeSpawnShootingStar() {
    if (!shootingStar && Math.random() < 0.006) {
      shootingStar = {
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4,
        alpha: 1
      };
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw twinkling stars
    for (let star of stars) {
      star.alpha += star.speed * star.direction;
      if (star.alpha > 0.95) star.direction = -1;
      if (star.alpha < 0.15) star.direction = 1;

      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shooting star animation
    maybeSpawnShootingStar();
    if (shootingStar) {
      ctx.strokeStyle = `rgba(0, 242, 254, ${shootingStar.alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(
        shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle),
        shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle)
      );
      ctx.stroke();

      shootingStar.x += shootingStar.speed;
      shootingStar.y += shootingStar.speed * 0.8;
      shootingStar.alpha -= 0.02;

      if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
        shootingStar = null;
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Live Countdown to Hackathon (14 Nov 2026)
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // NASA Space Apps 2026 starts Saturday, Nov 14, 2026 at 09:00:00 (BRT: GMT-3)
  const targetDate = new Date('2026-11-14T09:00:00-03:00').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      const label = document.querySelector('.countdown-label');
      if (label) label.textContent = '🚀 O HACKATHON ESTÁ ACONTECENDO AGORA!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('btn-mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    drawer.setAttribute('aria-hidden', String(!isOpen));
  });

  const links = drawer.querySelectorAll('.mobile-nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ==========================================================================
   4. 14 Official Challenges Dataset & Explorer
   ========================================================================== */
const challengesData = [
  {
    id: 1,
    titlePt: "Abandonados, Mas Não Esquecidos",
    titleEn: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars",
    level: "Iniciante / Jovem",
    levelClass: "diff-iniciante",
    category: "Espaço & Astrofísica",
    shortDesc: "Crie narrativas e experiências interativas que contem a história dos rovers, sondas e instrumentos que a NASA deixou na Lua e em Marte desde os anos 60 para inspirar crianças e jovens.",
    fullDesc: "Desde a década de 1960, a NASA enviou dezenas de equipamentos ao espaço que permaneceram na superfície lunar, em Marte ou vagando pelo sistema solar. O objetivo deste desafio é ultrapassar meras apresentações estáticas e desenvolver narrativas visuais, mapas interativos ou jogos de exploração para apresentar a estudantes as missões e a ciência revolucionária que esses pioneiros robóticos tornaram possível.",
    skills: ["Storytelling", "Design Gráfico", "Educação / Pedagogia", "Desenvolvimento Web ou Jogos"],
    dataUsed: "Catálogos da NASA de missões Apollo, Curiosity, Opportunity, Perseverance, Lunar Reconnaissance Orbiter (LRO).",
    slug: "abandoned-but-not-forgotten"
  },
  {
    id: 2,
    titlePt: "Detetive de Tendências do Sistema Terra",
    titleEn: "Be An Earth System Trend Detective!",
    level: "Avançado",
    levelClass: "diff-avancado",
    category: "Ciências da Terra",
    shortDesc: "Desenvolva métodos analíticos e algoritmos para identificar e prever tendências consistentes em variáveis climáticas globais usando dados de séries temporais de satélites da NASA.",
    fullDesc: "O clima do planeta Terra apresenta flutuações sazonais combinadas com tendências contínuas de longo prazo em temperatura da superfície, umidade do solo, cobertura de gelo e concentração de aerossóis. Neste desafio, equipes analisam décadas de observações de satélites para construir dashboards preditivos e modelos estatísticos que evidenciem tendências críticas do sistema Terra.",
    skills: ["Ciência de Dados", "Python / R", "Sensoriamento Remoto", "Machine Learning"],
    dataUsed: "NASA Earthdata, Giovanni, MODIS, Terra/Aqua, Sentinel e modelos climáticos MERRA-2.",
    slug: "be-an-earth-system-trend-detective"
  },
  {
    id: 3,
    titlePt: "Treinador de Missão para Astronautas Mirins",
    titleEn: "Build a Junior Astronaut Mission Trainer",
    level: "Iniciante / Jovem",
    levelClass: "diff-iniciante",
    category: "Educação & Jogos",
    shortDesc: "Projete um jogo interativo ou simulador educativo que ensine crianças e estudantes a equilibrarem recursos vitais em missões espaciais (suporte à vida, energia, oxigênio e radiação).",
    fullDesc: "Engenheiros espaciais tomam decisões difíceis a todo momento: quanto oxigênio levar? Como blindar a tripulação da radiação solar? Como gerenciar energia e alimentos? Este desafio convida os participantes a desenvolverem um simulador divertido e gamificado no qual jovens jogadores testam parâmetros de engenharia espacial e compreendem o valor da ciência.",
    skills: ["Game Design (Unity/Godot/Web)", "Educação STEM", "UI/UX", "Ilustração"],
    dataUsed: "Manuais da NASA para tripulações humanas, perfis do programa Artemis e parâmetros da ISS.",
    slug: "build-a-junior-astronaut-mission-trainer"
  },
  {
    id: 4,
    titlePt: "Navegador de Missões Lunares CLPS",
    titleEn: "CLPS Lunar Mission Browser",
    level: "Avançado",
    levelClass: "diff-avancado",
    category: "Espaço & Astrofísica",
    shortDesc: "Construa uma ferramenta geoespacial interativa para auxiliar planejadores de missões lunares na avaliação de pouso, gerenciando luz solar e linha de visada para a Terra.",
    fullDesc: "Com a iniciativa Commercial Lunar Payload Services (CLPS) da NASA, múltiplas sondas robóticas estão pousando na Lua. Este desafio requer a criação de um visualizador web 3D ou mapa lunar interativo que calcule e projete com precisão a incidência solar, sombras dinâmicas em crateras e janelas de comunicação direta com estações terrestres da Deep Space Network.",
    skills: ["WebGIS / Cesium / Three.js", "Matemática Orbital", "Astrofísica", "Frontend Avançado"],
    dataUsed: "Modelos de elevação digital LOLA (Lunar Orbiter Laser Altimeter), dados LROC e efemérides SPICE da NASA/JPL.",
    slug: "clps-lunar-mission-browser"
  },
  {
    id: 5,
    titlePt: "Monitoramento de Saúde para Astronautas",
    titleEn: "Create Health Monitoring Software for Astronauts on Space Missions",
    level: "Intermediário",
    levelClass: "diff-intermediario",
    category: "Saúde & Biologia",
    shortDesc: "Desenvolva software para telemetria biomédica que acompanhe parâmetros vitais, qualidade do sono e bem-estar psicológico de astronautas em viagens espaciais de longa duração.",
    fullDesc: "Viagens para a Lua e Marte impõem desafios fisiológicos e psicológicos sem precedentes: radiação cósmica, perda de massa óssea, isolamento e alteração de ritmo circadiano. O software proposto deve integrar sensores e telemetria para alertar sobre anomalias de saúde e sugerir contramedidas preventivas em tempo real.",
    skills: ["Engenharia Biomédica", "Desenvolvimento Mobile/Web", "Inteligência Artificial", "UI Acessível"],
    dataUsed: "Estudos de gêmeos da NASA (Twins Study), relatórios da Estação Espacial Internacional e dados biomédicos da NASA Life Sciences.",
    slug: "create-health-monitoring-software-for-astronauts-on-space-missions"
  },
  {
    id: 6,
    titlePt: "Dançando com os Satélites Radar (SAR)",
    titleEn: "Dancing with the SARs",
    level: "Intermediário",
    levelClass: "diff-intermediario",
    category: "Ciências da Terra",
    shortDesc: "Construa uma aplicação interativa com dados de radar de abertura sintética (NISAR) para rastrear desmatamento, queimadas, inundações e deformações na superfície terrestre.",
    fullDesc: "A missão conjunta NASA-ISRO Synthetic Aperture Radar (NISAR) captura imagens da Terra dia e noite, atravessando nuvens e copas de árvores com pulsos de micro-ondas. As equipes devem criar ferramentas que traduzam esses dados técnicos complexos em mapas fáceis de usar para comunidades vulneráveis, defesa civil e proteção de biomas como o Cerrado e a Amazônia.",
    skills: ["Processamento de Imagens de Radar", "Geoprocessamento (QGIS / GDAL)", "Desenvolvimento Web", "Comunicação"],
    dataUsed: "Coleções de dados abertos NISAR, dados Sentinel-1 da ESA e plataformas NASA Earthdata Search.",
    slug: "dancing-with-the-sars"
  },
  {
    id: 7,
    titlePt: "Fogo em Queda Livre (Microgravidade)",
    titleEn: "Flame in Freefall",
    level: "Avançado",
    levelClass: "diff-avancado",
    category: "IA & Dados",
    shortDesc: "Crie um dashboard com IA para sumarizar, minerar e extrair descobertas a partir de décadas de experimentos de combustão em microgravidade a bordo da ISS.",
    fullDesc: "Sem gravidade, a queima de chamas comporta-se de forma esférica e sem correntes de convecção tradicionais, permitindo descobrir novas físicas de queima limpa e motores mais eficientes na Terra. O desafio envolve processar milhares de relatórios e vídeos científicos de experimentos da NASA para extrair correlações físicas inéditas via Inteligência Artificial.",
    skills: ["Processamento de Linguagem Natural (NLP / RAG)", "Inteligência Artificial", "Física de Fluidos", "Data Viz"],
    dataUsed: "Bases de dados de combustão microgravitacional da NASA (ACME, BASS, FLEX) e repositórios Open Science.",
    slug: "flame-in-freefall"
  },
  {
    id: 8,
    titlePt: "Análogos Terrestres de Bases na Lua e Marte",
    titleEn: "Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars",
    level: "Avançado",
    levelClass: "diff-avancado",
    category: "Espaço & Astrofísica",
    shortDesc: "Mapeie e classifique regiões na Terra com características climáticas, geológicas ou de isolamento similares aos locais de futuros assentamentos no polo sul lunar e em Marte.",
    fullDesc: "Antes de construir postos permanentes na Lua ou em Marte, a NASA testa habitats e veículos em 'análogos terrestres' — como desertos hiperáridos, vulcões, cavernas de lava e estações antárticas. Este desafio pede a criação de um catálogo interativo e algoritmo de correspondência geográfica que aponte novos análogos na Terra.",
    skills: ["Geologia Planetária", "Sistemas de Informação Geográfica (GIS)", "Modelagem Ambiental", "Web Mapping"],
    dataUsed: "Mapas geológicos e altimétricos da NASA/USGS, dados do polo sul lunar (LRO/Diviner) e sondas orbitais de Marte (MRO/HiRISE).",
    slug: "identify-earth-locations-that-analog-the-permanent-moon-base-locations-and-mars"
  },
  {
    id: 9,
    titlePt: "Adaptação Agrícola com Dados de Satélite",
    titleEn: "Field Shift: Adapting Farms with NASA Data",
    level: "Avançado",
    levelClass: "diff-avancado",
    category: "Ciências da Terra",
    shortDesc: "Projete uma ferramenta de apoio à decisão para agricultores que combine observações de satélites da NASA com dados de solo para mitigar riscos de seca e eventos extremos.",
    fullDesc: "Agricultores enfrentam quebras de safra devido a padrões climáticos erráticos. Satélites da NASA como SMAP (umidade do solo) e Landsat medem a saúde da vegetação em escala continental. O objetivo é transformar esses terabytes de dados em recomendações simples e acionáveis para produtores agrícolas familiares e comerciais.",
    skills: ["Sensoriamento Remoto Agrícola", "Engenharia de Software", "Agronomia", "Design Focado no Usuário"],
    dataUsed: "NASA Harvest, SMAP, ECOSTRESS, índices NDVI/EVI da constelação Landsat e dados climáticos do INMET/INPE.",
    slug: "field-shift-adapting-farms-with-nasa-data"
  },
  {
    id: 10,
    titlePt: "Jukebox de Informações da Terra",
    titleEn: "The Earth Information Jukebox",
    level: "Iniciante / Jovem",
    levelClass: "diff-iniciante",
    category: "Educação & Jogos",
    shortDesc: "Transforme dados científicos complexos do Earth Information Center da NASA em som e música, tornando a ciência acessível e multissensorial.",
    fullDesc: "A sonificação de dados converte variáveis numéricas (como aumento do nível dos oceanos, anomalias de temperatura ou vento) em áudios musicais envolventes. Este desafio é ideal para mentes criativas, músicos e designers que queiram conectar arte e ciência para emocionar o público e incluir pessoas com deficiência visual.",
    skills: ["Sonificação / Música Digital", "Design de Áudio", "Web Audio API", "Acessibilidade"],
    dataUsed: "Conjuntos de dados do NASA Earth Information Center, medições de CO2 do OCO-2 e altimetria marinha SWOT/Jason.",
    slug: "the-earth-information-jukebox"
  },
  {
    id: 11,
    titlePt: "Simulador de Engenharia de Missões Espaciais",
    titleEn: "Space Mission Design Game",
    level: "Iniciante / Jovem",
    levelClass: "diff-iniciante",
    category: "Educação & Jogos",
    shortDesc: "Desenvolva um simulador interativo que desafie os jogadores a equilibrarem orçamentos, trajetórias orbitais, instrumentos científicos e lançadores espaciais.",
    fullDesc: "Criar uma missão espacial requer conciliar gravidade, consumo de combustível, massa de instrumentos e restrições orçamentárias. Equipes devem projetar um jogo ou aplicativo interativo onde jogadores possam experimentar o trabalho dos diretores de missões da NASA ao tentar alcançar a órbita lunar ou os satélites de Júpiter.",
    skills: ["Desenvolvimento de Games", "Mecânica Orbital Básica", "Design Gráfico", "Roteiro"],
    dataUsed: "Calculadoras de trajetórias da NASA, catálogos de foguetes SLS, Falcon e missões Discovery/New Frontiers.",
    slug: "space-mission-design-game"
  },
  {
    id: 12,
    titlePt: "Arquitetura ISRU: Vivendo dos Recursos Cósmicos",
    titleEn: "Living Off the Cosmic Land (ISRU Explorer)",
    level: "Intermediário",
    levelClass: "diff-intermediario",
    category: "Espaço & Astrofísica",
    shortDesc: "Crie modelos funcionais ou maquetes conceituais para mineração e processamento de gelo e oxigênio a partir do regolito lunar e marciano (In-Situ Resource Utilization).",
    fullDesc: "Transportar água e combustível da Terra para missões de longa permanência é proibitivamente caro. A sobrevivência humana na Lua depende de minerar água congelada nas crateras do polo sul e sintetizar combustível para retorno. Proponha sistemas automatizados, usinas de oxigênio ou simuladores técnicos para viabilizar essa autossuficiência.",
    skills: ["Engenharia Espacial", "Modelagem 3D (CAD/Blender)", "Química de Materiais", "Arquitetura"],
    dataUsed: "Mapas de distribuição de hidrogênio lunar da sonda Lunar Prospector, LRO e experimentos MOXIE em Marte.",
    slug: "living-off-the-cosmic-land"
  },
  {
    id: 13,
    titlePt: "Rastreador de Detritos Orbitais e Lixo Espacial",
    titleEn: "Cosmic Clean-Up: Orbital Debris Tracker",
    level: "Intermediário",
    levelClass: "diff-intermediario",
    category: "IA & Dados",
    shortDesc: "Visualize em tempo real os milhares de fragmentos de satélites desativados em órbita baixa da Terra e modele estratégias de mitigação da Síndrome de Kessler.",
    fullDesc: "A órbita baixa da Terra (LEO) acumula mais de 25.000 pedaços de lixo espacial maiores que 10 cm, ameaçando a Estação Espacial e futuros voos tripulados. Este desafio busca soluções inovadoras de rastreamento preditivo, visualização holográfica/web e ideias de captura ativa ou desorbitamento controlado.",
    skills: ["Modelagem Orbital (Two-Line Element - TLE)", "Three.js / WebGL", "Visualização de Dados", "Física Espacial"],
    dataUsed: "Catálogos de detritos do Space-Track.org, NASA Orbital Debris Program Office e dados do radar Haystack.",
    slug: "cosmic-clean-up-orbital-debris-tracker"
  },
  {
    id: 14,
    titlePt: "Ciência Aberta: Biodiversidade e Oceanos",
    titleEn: "Open Science for All: Biodiversity & Ocean Watch",
    level: "Iniciante / Jovem",
    levelClass: "diff-iniciante",
    category: "Ciências da Terra",
    shortDesc: "Facilite a exploração de dados marinhos e de biodiversidade costeira para escolas, comunidades litorâneas e pesquisadores da conservação ecológica.",
    fullDesc: "Os oceanos cobrem 70% do nosso planeta, absorvem calor e sustentam biomas cruciais. Sensores de satélites monitoram corais, clorofila e rotas migratórias marinhas, mas esses dados muitas vezes não chegam a escolas e comunidades pesqueiras. Este projeto propõe plataformas educativas acessíveis que empoderem defensores dos oceanos em todo o litoral brasileiro e mundial.",
    skills: ["Biológica Marinha", "Design Educacional", "Desenvolvimento Frontend", "Ciência Cidadã"],
    dataUsed: "NASA Ocean Color, satélite PACE (Plancton, Aerossol, Nuvem e Ecossistema Oceânico) e OBIS.",
    slug: "open-science-for-all-biodiversity-and-ocean-watch"
  }
];

let selectedLevel = 'all';
let selectedCategory = 'all';
let challengeSearchQuery = '';

function initChallenges() {
  const container = document.getElementById('challenges-container');
  const searchInput = document.getElementById('challenge-search');
  const clearBtn = document.getElementById('clear-challenge-search');
  const countEl = document.getElementById('challenges-count');
  const levelBtns = document.querySelectorAll('#challenge-level-filters .pill-btn');
  const catBtns = document.querySelectorAll('#challenge-category-filters .pill-btn');

  if (!container) return;

  function render() {
    const filtered = challengesData.filter(item => {
      const matchLevel = selectedLevel === 'all' || item.level.includes(selectedLevel);
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const textToSearch = `${item.titlePt} ${item.titleEn} ${item.shortDesc} ${item.skills.join(' ')}`.toLowerCase();
      const matchQuery = !challengeSearchQuery || textToSearch.includes(challengeSearchQuery.toLowerCase());
      return matchLevel && matchCat && matchQuery;
    });

    if (countEl) {
      countEl.textContent = `Mostrando ${filtered.length} de ${challengesData.length} desafios`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
          <p style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 0.5rem;">Nenhum desafio encontrado para esses critérios.</p>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Tente ajustar o termo de pesquisa ou selecionar outra categoria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(c => `
      <article class="challenge-card" data-id="${c.id}">
        <div class="challenge-top">
          <span class="challenge-number">DESAFIO #${String(c.id).padStart(2, '0')}</span>
          <span class="difficulty-badge ${c.levelClass}">${c.level}</span>
        </div>
        <h3 class="challenge-title-pt">${c.titlePt}</h3>
        <p class="challenge-title-en">${c.titleEn}</p>
        <span class="challenge-category-tag">${c.category}</span>
        <p class="challenge-desc">${c.shortDesc}</p>
        <div class="challenge-footer">
          <button class="btn-card-details" onclick="openChallengeModal(${c.id})">
            Ver Detalhes & Dados
          </button>
          <a href="https://www.spaceappschallenge.org/2026/challenges/" target="_blank" rel="noopener noreferrer" class="btn-card-official">
            Página NASA ↗
          </a>
        </div>
      </article>
    `).join('');
  }

  // Filter Listeners
  levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      levelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedLevel = btn.dataset.level;
      render();
    });
  });

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.dataset.category;
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      challengeSearchQuery = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = challengeSearchQuery ? 'block' : 'none';
      }
      render();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      challengeSearchQuery = '';
      clearBtn.style.display = 'none';
      render();
    });
  }

  render();
}

/* ==========================================================================
   5. Brazilian Local Events Dataset & Finder
   ========================================================================== */
const brazilEventsData = [
  {
    city: "Belo Horizonte",
    uf: "MG",
    region: "Sudeste",
    modality: "Presencial",
    modalityClass: "mod-presencial",
    venue: "PUC Minas — Campus São Gabriel",
    organizer: "Rede de Colégios Santa Maria Minas & Comunidade Local",
    description: "Um dos maiores e mais vibrantes polos do Brasil, reunindo ampla infraestrutura para hackathon presencial, mentores de tecnologia e workshops preparatórios.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Brasília",
    uf: "DF",
    region: "Centro-Oeste",
    modality: "Presencial",
    modalityClass: "mod-presencial",
    venue: "Hub de Inovação de Brasília",
    organizer: "Liderança Danilo Tavares Lima & Parceiros de Ciência",
    description: "Evento presencial na capital do país, reunindo estudantes universitários, cientistas de dados e entusiastas do ecossistema aeroespacial de Brasília.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Campinas",
    uf: "SP",
    region: "Sudeste",
    modality: "Híbrido",
    modalityClass: "mod-hibrido",
    venue: "Polo de Tecnologia e Inovação de Campinas",
    organizer: "Comunidade Espacial de Campinas & Universidades",
    description: "Polo estratégico do interior de São Paulo com participação presencial e forte suporte online em rede com outras cidades paulistas.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Fortaleza",
    uf: "CE",
    region: "Nordeste",
    modality: "Presencial",
    modalityClass: "mod-presencial",
    venue: "Centro Universitário UniAteneu — Campus Lagoa",
    organizer: "UniAteneu & Comunidade Cearense de Tecnologia",
    description: "Polo presencial consolidado no Ceará com infraestrutura de laboratórios de informática, auditório e suporte a estudantes de toda a região metropolitana.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Belém",
    uf: "PA",
    region: "Norte",
    modality: "Híbrido",
    modalityClass: "mod-hibrido",
    venue: "Centro de Ciência e Inovação da Amazônia",
    organizer: "Comunidade Tech Paraense & Universidades",
    description: "Conexão única entre dados de satélites da NASA e os desafios ambientais e de biodiversidade do bioma amazônico.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Curitiba",
    uf: "PR",
    region: "Sul",
    modality: "Híbrido",
    modalityClass: "mod-hibrido",
    venue: "Ecossistema de Inovação de Curitiba",
    organizer: "Comunidade Espacial Sul & Parceiros Tech",
    description: "Capital da inovação sustentável no Paraná, conectando participantes presenciais e suporte colaborativo contínuo via Discord.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Londrina",
    uf: "PR",
    region: "Sul",
    modality: "Presencial",
    modalityClass: "mod-presencial",
    venue: "Polo Tecnológico de Londrina",
    organizer: "Ecossistema de Startups e Institutos do Norte do PR",
    description: "Forte hub de tecnologia e agritech, aplicando dados de observação da Terra da NASA para desafios agrícolas e urbanos.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Caxias do Sul",
    uf: "RS",
    region: "Sul",
    modality: "Presencial",
    modalityClass: "mod-presencial",
    venue: "Serra Gaúcha Tech Hub",
    organizer: "Comunidade de Inovação da Serra Gaúcha",
    description: "Hub de alta densidade técnica com tradição em projetos de engenharia, manufatura e software para o Space Apps.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Guarulhos",
    uf: "SP",
    region: "Sudeste",
    modality: "Híbrido",
    modalityClass: "mod-hibrido",
    venue: "Hub de Inovação Guarulhos",
    organizer: "Comunidade Hackathon Brasil",
    description: "Apoiado por uma das maiores comunidades de hackathon do país, com ampla rede de mentores de TI, design e negócios.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Uberlândia",
    uf: "MG",
    region: "Sudeste",
    modality: "Presencial",
    modalityClass: "mod-presencial",
    venue: "Polo Tecnológico do Triângulo Mineiro",
    organizer: "Universidades e Hubs de Inovação de Uberlândia",
    description: "Destaque nacional em engajamento com centenas de estudantes e pesquisadores focados em soluções de alto impacto.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Cavalcante",
    uf: "GO",
    region: "Centro-Oeste",
    modality: "Presencial",
    modalityClass: "mod-presencial",
    venue: "Savanno Kombucharia & Garden (Chapada dos Veadeiros)",
    organizer: "Lideranças Locais & Cerrado Tech",
    description: "Polo especial na Chapada dos Veadeiros com foco em conectar dados espaciais com a realidade do Cerrado e conservação biológica.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Cianorte",
    uf: "PR",
    region: "Sul",
    modality: "Presencial",
    modalityClass: "mod-presencial",
    venue: "Faculdade UMFG",
    organizer: "Corpo Docente e Diretório Acadêmico UMFG",
    description: "Polo acadêmico acolhedor, ideal para quem está participando de um hackathon global pela primeira vez.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Vilhena",
    uf: "RO",
    region: "Norte",
    modality: "Presencial",
    modalityClass: "mod-presencial",
    venue: "Polo de Inovação de Rondônia",
    organizer: "Ecossistema Tech de Rondônia",
    description: "Representando o estado de Rondônia com equipes focadas em desafios terrestres e tecnologias de satélite.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Sorocaba",
    uf: "SP",
    region: "Sudeste",
    modality: "Híbrido",
    modalityClass: "mod-hibrido",
    venue: "Parque Tecnológico de Sorocaba",
    organizer: "Ecossistema Universitário e PTS",
    description: "Polo moderno com laboratórios abertos e salas de ideação para desenvolvimento ágil durante as 48 horas.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Limeira",
    uf: "SP",
    region: "Sudeste",
    modality: "Híbrido",
    modalityClass: "mod-hibrido",
    venue: "Polo Universitário de Limeira",
    organizer: "Comunidade Acadêmica Local & Campinas Hub",
    description: "Encontro de futuros engenheiros e cientistas com integração ao canal de suporte regional paulista.",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  },
  {
    city: "Evento Universal Brasil (Online)",
    uf: "BR",
    region: "Nacional",
    modality: "Online",
    modalityClass: "mod-online",
    venue: "100% Virtual / Discord & Portal da NASA",
    organizer: "Equipe Oficial Global NASA Space Apps",
    description: "Aberto para qualquer estudante residente no Brasil cuja cidade não possua polo presencial. Você concorre a todas as premiações da NASA!",
    link: "https://www.spaceappschallenge.org/2026/local-events/"
  }
];

let selectedRegion = 'all';
let selectedModality = 'all';
let eventSearchQuery = '';

function initEvents() {
  const container = document.getElementById('events-container');
  const searchInput = document.getElementById('event-search');
  const clearBtn = document.getElementById('clear-event-search');
  const regionSelect = document.getElementById('region-select');
  const modalitySelect = document.getElementById('modality-select');
  const countEl = document.getElementById('events-count');

  if (!container) return;

  function render() {
    const filtered = brazilEventsData.filter(ev => {
      const matchRegion = selectedRegion === 'all' || ev.region === selectedRegion;
      const matchMod = selectedModality === 'all' || ev.modality === selectedModality;
      const textToSearch = `${ev.city} ${ev.uf} ${ev.region} ${ev.venue} ${ev.organizer} ${ev.description}`.toLowerCase();
      const matchQuery = !eventSearchQuery || textToSearch.includes(eventSearchQuery.toLowerCase());
      return matchRegion && matchMod && matchQuery;
    });

    if (countEl) {
      countEl.textContent = `Mostrando ${filtered.length} de ${brazilEventsData.length} polos disponíveis no Brasil`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
          <p style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 0.5rem;">Nenhum polo encontrado para essa busca.</p>
          <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.25rem;">
            Lembre-se que você pode participar de qualquer lugar do Brasil através do <strong>Evento Universal (Virtual)</strong>!
          </p>
          <a href="https://www.spaceappschallenge.org/2026/local-events/" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            Inscrever no Evento Universal Virtual
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(ev => `
      <article class="event-card">
        <div class="event-card-header">
          <div>
            <h3 class="event-city">${ev.city} <span class="event-uf">(${ev.uf})</span></h3>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Região ${ev.region}</span>
          </div>
          <span class="event-modality-badge ${ev.modalityClass}">${ev.modality}</span>
        </div>

        <div class="event-venue-box">
          <span class="venue-label">Local / Polo:</span>
          <span class="venue-name">${ev.venue}</span>
        </div>

        <ul class="event-details-list">
          <li>
            <span>🏛️</span>
            <span><strong>Organização:</strong> ${ev.organizer}</span>
          </li>
          <li>
            <span>📝</span>
            <span>${ev.description}</span>
          </li>
        </ul>

        <div class="event-footer">
          <a href="${ev.link}" target="_blank" rel="noopener noreferrer" class="btn-event-register">
            <span>Acessar no Portal NASA</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </article>
    `).join('');
  }

  if (regionSelect) {
    regionSelect.addEventListener('change', (e) => {
      selectedRegion = e.target.value;
      render();
    });
  }

  if (modalitySelect) {
    modalitySelect.addEventListener('change', (e) => {
      selectedModality = e.target.value;
      render();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      eventSearchQuery = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = eventSearchQuery ? 'block' : 'none';
      }
      render();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      eventSearchQuery = '';
      clearBtn.style.display = 'none';
      render();
    });
  }

  render();
}

/* ==========================================================================
   6. FAQ Accordion Logic
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Fecha outros itens
      faqItems.forEach(other => {
        other.classList.remove('active');
        const btn = other.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   7. Challenge Details Modal
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('challenge-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function openChallengeModal(id) {
  const modal = document.getElementById('challenge-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  const challenge = challengesData.find(c => c.id === id);
  if (!challenge) return;

  content.innerHTML = `
    <span class="difficulty-badge ${challenge.levelClass}" style="margin-bottom: 0.75rem; display: inline-block;">${challenge.level}</span>
    <h3 class="modal-title" id="modal-title">${challenge.titlePt}</h3>
    <p class="modal-subtitle">${challenge.titleEn}</p>

    <div class="modal-tags">
      <span class="challenge-category-tag">${challenge.category}</span>
      <span class="pill pill-nasa">Desafio Oficial 2026</span>
    </div>

    <h4 class="modal-section-title">Sobre o Desafio</h4>
    <p class="modal-body-text">${challenge.fullDesc}</p>

    <h4 class="modal-section-title">Habilidades & Perfis Sugeridos</h4>
    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
      ${challenge.skills.map(s => `<span style="font-size: 0.8rem; background: rgba(255,255,255,0.07); padding: 0.25rem 0.65rem; border-radius: var(--radius-sm); color: var(--text-primary); border: 1px solid var(--border-subtle);">${s}</span>`).join('')}
    </div>

    <h4 class="modal-section-title">Fontes de Dados & Missões da NASA</h4>
    <p class="modal-body-text" style="color: #93c5fd; font-family: var(--font-display); font-size: 0.88rem;">${challenge.dataUsed}</p>

    <div class="modal-actions">
      <a href="https://www.spaceappschallenge.org/2026/challenges/" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex-grow: 1;">
        <span>Acessar Desafio no Portal da NASA ↗</span>
      </a>
      <button class="btn btn-hero-ghost" onclick="closeModal()">Fechar</button>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('challenge-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Global hook for inline onclick attributes
window.openChallengeModal = openChallengeModal;
window.closeModal = closeModal;
