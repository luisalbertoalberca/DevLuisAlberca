'use strict'

// ===== CURSOR PERSONALIZADO =====
document.addEventListener('mousemove', function(e) {
    const cursor = document.getElementById('cursor');
    if (cursor) {
        cursor.style.left = (e.clientX - 40) + 'px';
        cursor.style.top = (e.clientY - 40) + 'px';
    }
});

document.addEventListener('mouseover', function(e) {
    const cursor = document.getElementById('cursor');
    if (e.target.tagName === 'A' || e.target.closest('.btn')) {
        if (cursor) cursor.classList.add('mini');
    }
});

document.addEventListener('mouseout', function(e) {
    const cursor = document.getElementById('cursor');
    if (e.target.tagName === 'A' || e.target.closest('.btn')) {
        if (cursor) cursor.classList.remove('mini');
    }
});

// ===== SMOOTH SCROLL NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Actualizar clase activa en navegación
            document.querySelectorAll('.header .a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos animables
document.querySelectorAll('.skill-category, .project-card, .timeline-item, .stat').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// ===== CONTADOR DE ESTADÍSTICAS ANIMADO =====
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const finalValue = parseInt(stat.innerText);
        if (isNaN(finalValue)) return;
        
        let currentValue = 0;
        const increment = finalValue / 30;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.innerText = finalValue + (stat.innerText.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(currentValue) + (stat.innerText.includes('+') ? '+' : '');
            }
        }, 30);
    });
}

// Llamar a animateCounters cuando la sección sea visible
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
}

// ===== ANIMACIÓN DE BARRAS DE PROGRESO =====
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    skillsObserver.observe(skillsSection);
}

// ===== FILTRO DE PROYECTOS POR CATEGORÍA =====
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar tarjetas
            projectCards.forEach(card => {
                const tags = card.getAttribute('data-tags');
                if (filter === 'all' || (tags && tags.includes(filter))) {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 10);
                    }, 300);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

initProjectFilter();

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn[type="submit"]');
        const originalText = submitBtn.innerText;
        
        // Cambiar texto del botón
        submitBtn.innerText = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simular envío
        setTimeout(() => {
            submitBtn.innerText = '✓ ¡Enviado!';
            submitBtn.style.background = '#10b981';
            
            // Resetear formulario
            form.reset();
            
            // Volver al estado original después de 3 segundos
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

initContactForm();

// ===== TOGGLE MENÚ MÓVIL =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.header .ul');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.header .a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

initMobileMenu();

// ===== INDICADOR DE LECTURA =====
function initReadingProgress() {
    const progressBar = document.querySelector('.reading-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

initReadingProgress();

// ===== ACTIVE LINK EN NAVEGACIÓN SEGÚN SCROLL =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('.header .a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

updateActiveNavLink();

// ===== MODO OSCURO / CLARO (TOGGLE) =====
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        themeToggle.classList.toggle('active');
    });
}

initThemeToggle();

// ===== COPY CÓDIGO DE FUNCIONES =====
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '📋 Copiar';
        
        copyBtn.addEventListener('click', () => {
            const code = block.innerText;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerHTML = '✓ Copiado!';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 Copiar';
                }, 2000);
            });
        });
        
        block.appendChild(copyBtn);
    });
}

initCodeCopy();

// ===== LAZY LOADING DE IMÁGENES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sin soporte
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

initLazyLoading();

// ===== EFECTO RIPPLE EN BOTONES =====
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .tag, .project-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

initRippleEffect();

// ===== NOTIFICACIÓN CUANDO COPIA CORREO =====
function initEmailCopy() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const email = link.getAttribute('href').replace('mailto:', '');
            
            // Copiar al portapapeles
            navigator.clipboard.writeText(email).then(() => {
                showNotification('Email copiado al portapapeles!', 'success');
            }).catch(() => {
                console.log('Email:', email);
            });
        });
    });
}

initEmailCopy();

// ===== FUNCIÓN PARA MOSTRAR NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    notification.style.animation = 'slideInDown 0.3s ease';
    
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// ===== CONTADOR DE VISITANTES (LocalStorage) =====
function initVisitorCounter() {
    let visits = localStorage.getItem('portfolioVisits') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('portfolioVisits', visits);
    
    const counter = document.querySelector('.visitor-counter');
    if (counter) {
        counter.innerText = `Visitantes: ${visits}`;
    }
}

initVisitorCounter();

// ===== SCROLL REVEAL ANIMADO =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        } else {
            reveal.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ===== DETECTAR MODO OSCURO DEL SISTEMA =====
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const scrollPosition = window.pageYOffset;
            const speed = el.getAttribute('data-parallax') || 0.5;
            el.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}

initParallax();

// ===== VALIDACIÓN DE FORMULARIO =====
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
    });
    
    function validateField(field) {
        if (field.value.trim() === '') {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    }
}

initFormValidation();

// ===== INICIALIZACIÓN AL CARGAR PÁGINA =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio cargado exitosamente! 🚀');
    
    // Agregar clase de carga
    document.body.classList.add('loaded');
    
    // Mostrar versión del sitio
    console.log('Versión: 2.0 - Portfolio Mejorado');
});

// ===== AGREGAR ANIMACIÓN DE CARGA =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
