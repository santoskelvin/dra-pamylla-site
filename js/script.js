document.addEventListener('DOMContentLoaded', function() {
    // Esconder todos os elementos que serão animados
    prepareAnimatedElements();
    
    // Mostrar a página apenas quando estiver pronta
    setTimeout(() => {
        document.body.classList.add('page-loaded');
        
        // Corrigir layout issues imediatamente
        fixLayoutIssues();
        
        // Remover quaisquer estilos inline indesejados que afetam o dropdown
        // cleanupDropdownStyles(); // REMOVIDO
        
        // Iniciar animações após uma pequena espera
        setTimeout(() => {
            // Iniciar todas as animações
            initAllAnimations();
        }, 300);
    }, 500);
    
    // Preparar elementos com efeito de digitação - com atraso para não interferir no layout inicial
    setTimeout(() => {
        prepareTypewriterElements();
    }, 200);
    
    // FAQ Accordion
    initFaqAccordion();
    
    // Scroll suave para links de âncora
    initSmoothScroll();
    
    // Animação de header em scroll
    initHeaderScroll();
    
    // Menu mobile
    initMobileMenu();
    
    // Dropdown de ajuda - com implementação mais robusta
    setupHelpDropdown();
    
    // Destacar link ativo no menu principal
    initActiveNavLinks();
    
    // Efeito de paralaxe no hero
    initHeroParallax();
    
    // Novo Carrossel Simplificado - Refatorado
    createImageCarousel();
});

// Preparar elementos para animação
function prepareAnimatedElements() {
    // Preparar elementos com efeito de entrada a ser revelados no scroll
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .scale-in');
    
    // Ocultar os elementos até que sejam revelados
    animatedElements.forEach(element => {
        element.style.opacity = "0";
        
        // Evitar reanimação durante o carregamento
        element.classList.add('animation-ready');
    });
    
    // IMPORTANTE: Não esconder elementos com a classe reveal original
    // para evitar duplicidade com o sistema antigo de animação
}

// Preparar elementos para efeito de digitação
function prepareTypewriterElements() {
    // Selecionar apenas parágrafos da seção de Lentes para o efeito typewriter
    const textElements = document.querySelectorAll('.lentes-info > p');
    
    textElements.forEach(element => {
        // Verificação de segurança para garantir que não aplicamos a elementos incorretos
        if (!element.classList.contains('btn-text') && 
            !element.closest('.quote') && 
            !element.closest('.footer-contact') &&
            !element.classList.contains('typewriter') &&  // Evita duplicação
            element.textContent.trim().length > 0) {  // Verifica se há texto
            
            // Guardamos o texto original e as classes originais
            const originalText = element.innerHTML;
            const originalClassList = element.className;
            
            // Criamos um wrapper para manter a estrutura original
            const wrapper = document.createElement('div');
            wrapper.className = 'typewriter-wrapper';
            wrapper.style.position = 'relative';
            wrapper.style.display = 'block';
            
            // Configuramos o elemento para typewriter com tamanho mínimo seguro baseado no conteúdo original
            const originalHeight = element.offsetHeight;
            const originalWidth = element.offsetWidth;
            
            // Adicionamos a classe typewriter e preservamos o tamanho
            element.className = originalClassList + ' typewriter';
            element.setAttribute('data-original-text', originalText);
            element.setAttribute('data-original-class', originalClassList);
            element.style.opacity = '0';
            element.style.visibility = 'hidden';
            element.style.minHeight = originalHeight + 'px';
            element.style.width = '100%';
            
            // Esvaziamos o conteúdo para ser preenchido gradualmente
            element.innerHTML = '';
            
            // Substituímos o elemento original pelo wrapper contendo o elemento
            if (element.parentNode) {
                element.parentNode.insertBefore(wrapper, element);
                wrapper.appendChild(element);
            }
        }
    });
}

// Iniciar todas as animações
function initAllAnimations() {
    // Corrigir problemas de layout primeiro
    fixLayoutIssues();
    
    // Iniciar animações baseadas em scroll
    initScrollAnimations();
    
    // Animar elementos visíveis inicialmente
    animateVisibleElements();
    
    // Animar hero section diretamente (sem esperar o scroll)
    animateHeroSectionImmediately();
    
    // Também usar o sistema original de reveal
    initScrollReveal();
    
    // Inicializar animações de texto digitado com atraso para não conflitar
    setTimeout(() => {
        initTypewriterEffects();
    }, 800);
    
    // Garantir que todos os elementos sejam eventualmente mostrados após um tempo
    setTimeout(showAllHiddenElements, 5000);
    
    // Verificação de segurança adicional após algum tempo
    setTimeout(() => {
        // Verificar e corrigir problemas de layout persistentes
        fixLayoutIssues();
        
        // Segunda verificação para garantir visibilidade total
        showAllHiddenElements();
    }, 8000);
}

// Animação de efeito de digitação para textos
function initTypewriterEffects() {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Verificamos se o elemento tem o atributo de texto original
                if (element.hasAttribute('data-original-text')) {
                    // Tornamos o elemento visível
                    element.style.opacity = '1';
                    element.style.visibility = 'visible';
                    element.classList.add('revealed');
                    
                    // Verificamos se o elemento já teve a animação aplicada
                    if (!element.hasAttribute('data-animation-started')) {
                        element.setAttribute('data-animation-started', 'true');
                        // Iniciamos a animação de digitação
                        typeText(element, element.getAttribute('data-original-text'));
                    }
                }
                
                // Paramos de observar depois da animação
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observar todos os elementos com classe typewriter
    document.querySelectorAll('.typewriter').forEach(element => {
        observer.observe(element);
    });
}

// Função para simular o efeito de digitação - versão otimizada e mais segura
function typeText(element, text) {
    let index = 0;
    element.innerHTML = '';
    
    // Adicionamos uma verificação para HTML
    const isHTML = /<[a-z][\s\S]*>/i.test(text);
    
    // Definimos uma velocidade mais rápida mas consistente
    const speed = 20;
    
    // Obter o texto puro para cálculos
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Definir um tempo máximo de animação (3 segundos)
    const maxDuration = 3000;
    const charactersToAnimate = Math.min(plainText.length, Math.floor(maxDuration / speed));
    
    // Se for muito texto, fazemos uma animação mais rápida e curta
    if (plainText.length > 100) {
        // Apenas animar os primeiros caracteres e depois completar
        const visiblePart = text.substring(0, Math.floor(text.length * 0.3));
        element.innerHTML = '';
        
        // Mostrar gradualmente e depois completar
        setTimeout(() => {
            element.style.opacity = '0.3';
            element.innerHTML = visiblePart;
            
            setTimeout(() => {
                element.style.opacity = '0.6';
                
                setTimeout(() => {
                    element.innerHTML = text;
                    element.style.opacity = '1';
                    element.classList.add('typewriter-complete');
                    
                    // Remover cursor após conclusão
                    element.classList.add('typewriter-cursor-hidden');
                }, 200);
            }, 200);
        }, 100);
        
        return;
    }
    
    // Para HTML, usamos uma abordagem diferente para preservar tags
    if (isHTML) {
        // Extrair apenas o texto para animação
        const textOnly = plainText;
        let textIndex = 0;
        let htmlIndex = 0;
        
        function animateHTML() {
            if (textIndex >= textOnly.length || textIndex >= charactersToAnimate) {
                // Finalizamos com o HTML completo para garantir que está correto
                element.innerHTML = text;
                element.classList.add('typewriter-complete');
                element.classList.add('typewriter-cursor-hidden');
                return;
            }
            
            // Avançamos pelo HTML, preservando as tags
            while (htmlIndex < text.length) {
                const char = text[htmlIndex];
                if (char === '<') {
                    // Encontramos uma tag, adicionamos a tag completa
                    const tagEnd = text.indexOf('>', htmlIndex) + 1;
                    element.innerHTML += text.substring(htmlIndex, tagEnd);
                    htmlIndex = tagEnd;
                } else {
                    // Caractere normal
                    element.innerHTML += char;
                    htmlIndex++;
                    textIndex++;
                    break;
                }
            }
            
            setTimeout(animateHTML, speed);
        }
        
        animateHTML();
    } else {
        // Para texto simples, usamos a abordagem direta
        function addCharacter() {
            if (index < text.length && index < charactersToAnimate) {
                // Adicionamos o próximo caractere
                element.innerHTML += text.charAt(index);
                index++;
                
                // Chamamos recursivamente com um timeout
                setTimeout(addCharacter, speed);
            } else {
                // Garantir que o texto completo esteja lá
                element.innerHTML = text;
                element.classList.add('typewriter-complete');
                element.classList.add('typewriter-cursor-hidden');
            }
        }
        
        // Começamos a animação com pequeno atraso
        setTimeout(addCharacter, 100);
    }
}

// Função de segurança para garantir que elementos não fiquem escondidos
function showAllHiddenElements() {
    console.log("Aplicando visibilidade para todos os elementos (segurança)");
    
    // Primeiro, restaurar todos os textos typewriter para seu estado original
    document.querySelectorAll('.typewriter[data-original-text]').forEach(el => {
        el.innerHTML = el.getAttribute('data-original-text');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.classList.add('typewriter-complete');
        el.classList.add('typewriter-cursor-hidden');
        el.classList.add('revealed');
    });
    
    // Garantir que elementos de animação estejam visíveis
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .scale-in').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.classList.add('animated');
    });
    
    // Garantir que marquee esteja visível e corretamente posicionado
    const marquee = document.querySelector('.marquee-container');
    if (marquee) {
        marquee.style.opacity = '1';
        marquee.style.visibility = 'visible';
        // Garantir posicionamento correto
        marquee.style.position = 'absolute';
        marquee.style.bottom = '0';
        marquee.style.left = '0';
        marquee.style.width = '100%';
    }
    
    // Garantir que o menu de ajuda não fique preso aberto
    const ajudaContainer = document.querySelector('.ajuda-container');
    if (ajudaContainer) {
        // Sempre fechar o dropdown em showAllHiddenElements
        ajudaContainer.classList.remove('active');
        console.log('Dropdown de ajuda fechado por showAllHiddenElements');
    }
    
    // Outros elementos com visibility/opacity
    document.querySelectorAll('section, div, p, h1, h2, h3, h4, h5, h6, a, img, ul, li').forEach(el => {
        if (el.closest('#ajuda-dropdown') || el.closest('.ajuda-container')) {
            return; // Pular elementos do dropdown
        }
        if (el.style.opacity === "0" || window.getComputedStyle(el).opacity === "0") {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.classList.add('force-visible');
        }
    });
}

// Corrigir posição do marquee e outros problemas de layout
function fixLayoutIssues() {
    // Corrigir posição do marquee
    const marquee = document.querySelector('.marquee-container');
    if (marquee) {
        // Posicionar corretamente no hero section
        marquee.style.position = 'absolute';
        marquee.style.bottom = '0';
        marquee.style.left = '0';
        marquee.style.width = '100%';
        marquee.style.zIndex = '5';
    }
    
    // Garantir que o dropdown de ajuda não esteja preso aberto
    const ajudaContainer = document.querySelector('.ajuda-container');
    if (ajudaContainer) {
        // NÃO mexer mais no dropdown aqui
        // ajudaContainer.classList.remove('active');
        // console.log('Dropdown de ajuda fechado por fixLayoutIssues');
    }
}

// Animar a seção hero IMEDIATAMENTE
function animateHeroSectionImmediately() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    // Forçar a visibilidade da seção principal
    heroSection.style.opacity = '1';
    heroSection.classList.add('loaded');
    
    // Selecionar todos os elementos filhos que deveriam ser animados
    const elementsToAnimate = heroSection.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .scale-in, .hero-dots, .hero-decor, .marquee-container');
    
    elementsToAnimate.forEach(element => {
        // Remover a necessidade de scroll
        element.style.opacity = '1';
        element.style.transform = 'none'; // Resetar transformações iniciais
        element.style.visibility = 'visible';
        element.classList.add('animated'); // Aplicar estado final da animação
        element.classList.add('revealed'); // Compatibilidade com outros sistemas de reveal
        
        // Remover delay de transição para carregamento rápido
        element.style.transitionDelay = '0s';
        element.style.animationDelay = '0s';
        
        // Para elementos que usam keyframes, parar a animação inicial
        if (element.style.animationName) {
            element.style.animationPlayState = 'paused';
            setTimeout(() => {
                element.style.animation = 'none'; // Remover animação após um frame
                element.style.opacity = '1';
                element.style.transform = 'none';
            }, 16); 
        }
    });
    
    // Garantir visibilidade do conteúdo de texto
    const textElements = heroSection.querySelectorAll('.hero-text h5, .hero-text h1, .hero-text p, .hero-badges .badge');
    textElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    
    console.log("Hero section animada imediatamente.");
}

// Configurar animações baseadas em scroll
function initScrollAnimations() {
    // Tipos de elementos com animações diferentes
    const fadeElements = document.querySelectorAll('.fade-in:not(.animated)');
    const slideLeftElements = document.querySelectorAll('.slide-in-left:not(.animated)');
    const slideRightElements = document.querySelectorAll('.slide-in-right:not(.animated)');
    const slideUpElements = document.querySelectorAll('.slide-in-up:not(.animated)');
    const scaleElements = document.querySelectorAll('.scale-in:not(.animated)');
    
    // Observador de interseção para elementos
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Adicionar atraso se especificado
                let delay = element.dataset.delay ? parseFloat(element.dataset.delay) : 0;
                
                // Adiciona um atraso adicional para criar um efeito cascata
                if (element.classList.contains('fade-in')) {
                    delay += 0.1;
                } else if (element.classList.contains('slide-in-left') || element.classList.contains('slide-in-right')) {
                    delay += 0.2;
                } else if (element.classList.contains('slide-in-up')) {
                    delay += 0.3;
                } else if (element.classList.contains('scale-in')) {
                    delay += 0.4;
                }
                
                element.style.transitionDelay = `${delay}s`;
                
                // Animar elemento
                setTimeout(() => {
                    element.style.opacity = "1";
                    element.classList.add('animated');
                    
                    if (element.classList.contains('sobre-texto')) {
                        animateChildElements(element);
                    }
                }, delay * 1000);
                
                // Parar de observar após animar
                observer.unobserve(element);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    // Observar todos os elementos animados
    [...fadeElements, ...slideLeftElements, ...slideRightElements, ...slideUpElements, ...scaleElements].forEach(element => {
        observer.observe(element);
    });
}

// Animar elementos filhos de um contêiner (como para sobre-texto)
function animateChildElements(container) {
    const elements = container.querySelectorAll('h3, p, .clinica-fotos');
    let delay = 0.1;
    
    elements.forEach(element => {
        element.style.opacity = "1";
        element.style.transitionDelay = `${delay}s`;
        element.classList.add('revealed');
        delay += 0.1;
    });
}

// Animar elementos já visíveis na tela
function animateVisibleElements() {
    const elements = document.querySelectorAll('.fade-in:not(.animated), .slide-in-left:not(.animated), .slide-in-right:not(.animated), .slide-in-up:not(.animated), .scale-in:not(.animated)');
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Se o elemento já está visível na tela
        if (rect.top < windowHeight - 100) {
            let delay = element.dataset.delay ? parseFloat(element.dataset.delay) : 0.1;
            element.style.transitionDelay = `${delay}s`;
            
            setTimeout(() => {
                element.style.opacity = "1";
                element.classList.add('animated');
                
                if (element.classList.contains('sobre-texto')) {
                    animateChildElements(element);
                }
            }, delay * 1000);
        }
    });
}

// Inicialização do FAQ
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Fechar outros itens abertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar estado atual
            item.classList.toggle('active');
        });
    });
}

// Scroll suave para links de âncora
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 100; // Compensar header fixo
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animação de header em scroll
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Revelar elementos com animação quando entrarem na viewport
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const revealImgs = document.querySelectorAll('.reveal-img');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150; // Distância do elemento à parte inferior da janela para começar a animação
        
        // Elementos normais com classe reveal
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
                
                // Se for um elemento da seção Sobre, animamos os conteúdos internos
                if (element.classList.contains('sobre-texto')) {
                    element.querySelectorAll('h3, p, .clinica-fotos').forEach(el => {
                        el.classList.add('revealed');
                        
                        // Adicionamos uma animação progressiva para os parágrafos
                        if (el.tagName.toLowerCase() === 'p') {
                            const delay = Array.from(element.querySelectorAll('p')).indexOf(el) * 0.2;
                            el.style.transitionDelay = `${delay}s`;
                        }
                    });
                }
            }
        });
        
        // Imagens com animação específica
        revealImgs.forEach(img => {
            const imgTop = img.getBoundingClientRect().top;
            
            if (imgTop < windowHeight - revealPoint) {
                img.classList.add('revealed');
            }
        });
    }
    
    // Verificar no carregamento inicial e no scroll
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
}

// Funcionalidade do menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Alternar ícone
            const icon = menuToggle.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                console.log('Menu aberto, ícone alterado para X');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                console.log('Menu fechado, ícone alterado para barras');
            }
        });

        // Fechar menu ao clicar em um link
        const navLinks = mobileNav.querySelectorAll('ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    body.classList.remove('menu-open');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Verificar estado inicial do menu (útil em caso de reload da página)
        if (mobileNav.classList.contains('active')) {
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }
}

// Funcionalidade do dropdown de ajuda - versão reforçada
function setupHelpDropdown() {
    const container = document.getElementById('ajuda-dropdown-container');
    const button = document.getElementById('ajuda-btn');
    const dropdown = document.getElementById('ajuda-dropdown');

    if (!container || !button || !dropdown) {
        console.error('Elementos essenciais do dropdown de ajuda não encontrados.');
        return;
    }

    // Garantir estado inicial fechado
    container.classList.remove('active');
    dropdown.style.opacity = '0';
    dropdown.style.visibility = 'hidden';
    dropdown.style.pointerEvents = 'none';

    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique no botão feche o menu imediatamente
        const isActive = container.classList.toggle('active');
        if (isActive) {
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdown.style.pointerEvents = 'auto';
        } else {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.pointerEvents = 'none';
        }
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (event) => {
        if (!container.contains(event.target) && container.classList.contains('active')) {
            container.classList.remove('active');
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.pointerEvents = 'none';
        }
    });

    // Fechar com a tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && container.classList.contains('active')) {
            container.classList.remove('active');
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.pointerEvents = 'none';
        }
    });

     // Fechar ao clicar em um link interno do dropdown
     dropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
             if (container.classList.contains('active')) {
                 container.classList.remove('active');
                 dropdown.style.opacity = '0';
                 dropdown.style.visibility = 'hidden';
                 dropdown.style.pointerEvents = 'none';
            }
        });
    });

    console.log('Novo Dropdown de Ajuda Configurado.');
}

// Destacar link ativo no menu de navegação principal
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const homeLink = document.querySelector('.main-nav ul li a[href="#hero"]');
    
    function highlightActiveLink() {
        const scrollY = window.scrollY;
        
        // Remover classe ativa de todos os links primeiro
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Verificar cada seção e comparar posição
        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // Ajuste para considerar o header fixo
            
            // Verificar se o scroll está dentro da seção atual
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Adicionar classe ativa ao link correspondente
                const activeLink = document.querySelector(`.main-nav ul li a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Verificar na carga inicial e no scroll
    window.addEventListener('scroll', highlightActiveLink);
    window.addEventListener('load', highlightActiveLink);
}

// Efeito de paralaxe no hero
function initHeroParallax() {
    const hero = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    const heroDots = document.querySelector('.hero-dots');
    const heroDecor = document.querySelector('.hero-decor');
    
    if (hero && window.innerWidth > 768) {
        window.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // Movimento sutil do fundo
            hero.style.backgroundPosition = `${50 + (x * 5)}% ${50 + (y * 5)}%`;
            
            // Movimento dos elementos decorativos
            if (heroDots) {
                heroDots.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            }
            
            if (heroDecor) {
                heroDecor.style.transform = `rotate(${x * 20}deg) translate(${y * 15}px, ${x * 15}px)`;
            }
            
            // Efeito sutil no conteúdo
            if (heroContent) {
                heroContent.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
            }
        });
    }
    
    // Efeito de revelação inicial
    if (hero) {
        setTimeout(() => {
            hero.classList.add('loaded');
        }, 300);
    }
}

// Limpar estilos indesejados do dropdown - FUNÇÃO REMOVIDA
/*
function cleanupDropdownStyles() {
    // ... (código comentado)
}
*/

// Carrossel de Imagens Refatorado (Antes e Depois)
function createImageCarousel() {
    const carouselContainer = document.querySelector('#resultados .carousel-container');
    if (!carouselContainer) return;

    const wrapper = carouselContainer.querySelector('.carousel-wrapper');
    const track = carouselContainer.querySelector('.carousel-track');
    const items = Array.from(track.children);
    const nextButton = carouselContainer.querySelector('.next-btn');
    const prevButton = carouselContainer.querySelector('.prev-btn');

    if (!wrapper || !track || items.length === 0 || !nextButton || !prevButton) {
        console.warn('Elementos do carrossel não encontrados na seção #resultados.');
        return;
    }

    let currentIndex = 0;
    // Usar a largura do wrapper como referência para o deslocamento
    // let itemWidth = items[0].getBoundingClientRect().width; // Linha original removida

    // Função para obter a largura atual do wrapper (mais confiável)
    const getItemWidth = () => {
        return wrapper.offsetWidth;
    };

    // Posiciona os slides lado a lado (redundante com CSS flex, mas garante)
    const setSlidePositions = () => {
        let currentItemWidth = items[0].getBoundingClientRect().width;
        items.forEach((item, index) => {
            item.style.left = currentItemWidth * index + 'px';
        });
    };
    // setSlidePositions(); // Não é mais necessário com flexbox

    // Move o track para o slide correto
    const moveToSlide = (targetIndex) => {
        // Garante que o índice esteja dentro dos limites
        if (targetIndex < 0) {
            targetIndex = items.length - 1;
        } else if (targetIndex >= items.length) {
            targetIndex = 0;
        }
        
        const currentItemWidth = getItemWidth(); // Usar a largura do wrapper
        const amountToMove = targetIndex * currentItemWidth;
        track.style.transform = `translateX(-${amountToMove}px)`;
        currentIndex = targetIndex;

        // Atualiza a classe 'is-active' (opcional)
        items.forEach((item, index) => {
            item.classList.toggle('is-active', index === currentIndex);
        });
    };

    // Event Listeners para os botões
    nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
    });

    // Atualizar largura em redimensionamento (importante para responsividade)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Usar debounce para evitar execuções excessivas
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalcula a largura do wrapper
            const newItemWidth = getItemWidth();
            // Atualiza a posição sem animação para evitar saltos
            track.style.transition = 'none'; 
            track.style.transform = `translateX(-${currentIndex * newItemWidth}px)`;
            // Reativa a transição após um pequeno delay para garantir a aplicação do estilo
            // Usar requestAnimationFrame pode ser mais robusto em alguns casos, mas setTimeout(0) funciona bem
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease-in-out';
            }, 50); // Delay pequeno para garantir que a transição seja reativada após o DOM update
        }, 250);
    });

    // Inicializa o carrossel no primeiro slide
    moveToSlide(0);
}

// Função de debounce simples
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}; 