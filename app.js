document.addEventListener('DOMContentLoaded', () => {
  // --- INITIATE STATS COUNTER ANIMATION ---
  animateStats();

  // --- SIDEBAR ACTIVE MENU STATE ---
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Allow default navigation if href is not "#"
      if (item.getAttribute('href') === '#') {
        e.preventDefault();
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Show status feedback for demo
        const label = item.querySelector('span').textContent;
        showNotification(`${label} sayfası henüz yapım aşamasındadır.`);
      }
    });
  });

  // --- LOGIN MODAL INTERACTION ---
  const loginModal = document.getElementById('loginModal');
  const loginTrigger = document.getElementById('loginTrigger');
  const modalClose = document.getElementById('modalClose');
  const loginForm = document.getElementById('loginForm');
  
  if (loginTrigger && loginModal && modalClose) {
    // Open Modal
    loginTrigger.addEventListener('click', () => {
      loginModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      // Focus first input
      setTimeout(() => {
        document.getElementById('username').focus();
      }, 100);
    });

    // Close Modal via button
    modalClose.addEventListener('click', () => {
      closeLoginModal();
    });

    // Close Modal via clicking overlay background
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        closeLoginModal();
      }
    });

    // Close Modal via Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && loginModal.classList.contains('active')) {
        closeLoginModal();
      }
    });
  }

  function closeLoginModal() {
    loginModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Handle Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('username').value;
      const userName = usernameInput.split('@')[0]; // Extract part of email as username
      
      // Update UI Header
      const headerUserName = document.querySelector('.user-name');
      const headerUserGreeting = document.querySelector('.user-greeting');
      if (headerUserName && headerUserGreeting) {
        headerUserName.textContent = userName.charAt(0).toUpperCase() + userName.slice(1);
        headerUserGreeting.textContent = 'Hoş geldin,';
      }

      // Update Login Button
      if (loginTrigger) {
        loginTrigger.textContent = 'Çıkış Yap';
        loginTrigger.style.backgroundColor = 'transparent';
        loginTrigger.style.color = 'var(--color-accent-cyan)';
        loginTrigger.style.border = '2px solid var(--color-accent-cyan)';
        loginTrigger.style.boxShadow = 'none';
        
        // Change logic to logout if button says logout
        loginTrigger.setAttribute('id', 'logoutTrigger');
        rebindProfileButton();
      }

      closeLoginModal();
      showNotification(`Giriş başarılı! Hoş geldin, ${userName}.`);
    });
  }

  function rebindProfileButton() {
    const logoutBtn = document.getElementById('logoutTrigger') || document.querySelector('.btn-login');
    if (logoutBtn && logoutBtn.textContent === 'Çıkış Yap') {
      // Remove old listeners by replacing button node (simple way for demo code)
      const newLogoutBtn = logoutBtn.cloneNode(true);
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
      
      newLogoutBtn.addEventListener('click', () => {
        // Reset to Guest state
        const headerUserName = document.querySelector('.user-name');
        const headerUserGreeting = document.querySelector('.user-greeting');
        if (headerUserName && headerUserGreeting) {
          headerUserName.textContent = 'Misafir';
          headerUserGreeting.textContent = 'Hoş geldin,';
        }
        
        newLogoutBtn.textContent = 'Giriş Yap';
        newLogoutBtn.style.backgroundColor = 'var(--color-accent-cyan)';
        newLogoutBtn.style.color = '#030d09';
        newLogoutBtn.style.border = 'none';
        newLogoutBtn.style.boxShadow = '0 4px 15px var(--color-accent-cyan-glow)';
        
        newLogoutBtn.setAttribute('id', 'loginTrigger');
        
        // Re-run setup
        window.location.reload();
      });
    }
  }

  // --- PLAY AND LEARN INTERACTION ---
  const btnPlay = document.getElementById('btn-play');
  const btnLearn = document.getElementById('btn-learn');
  const modeCards = document.querySelectorAll('.mode-card');

  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      showNotification('Savaş alanına hazırlanın! Karşılaşma aranıyor...', 'success');
    });
  }

  if (btnLearn) {
    btnLearn.addEventListener('click', () => {
      showRulesModal();
    });
  }

  modeCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const title = card.querySelector('.mode-title').textContent;
      if (title === 'Bot\'a karşı oyna') {
        showNotification('Yapay zeka (Bot) ile maç yükleniyor...', 'info');
      } else if (title === 'Çevrimiçi oyna') {
        showNotification('Oyuncu eşleştirme lobisine bağlanılıyor...', 'success');
      } else if (title === 'Ekranda oyna') {
        showNotification('Yerel iki kişilik oyun modu başlatılıyor...', 'info');
      }
    });
  });

  // --- STATS COUNTER ANIMATION LOGIC ---
  function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 1500; // ms
      const stepTime = Math.max(Math.floor(duration / target), 15);
      
      const increment = Math.ceil(target / (duration / stepTime));
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target.toLocaleString('tr-TR') + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = current.toLocaleString('tr-TR') + suffix;
        }
      }, stepTime);
    });
  }

  // --- MOCK RULES MODAL ---
  function showRulesModal() {
    // Check if rules modal already exists
    let rulesModal = document.getElementById('rulesModal');
    if (!rulesModal) {
      // Create HTML structure for rules modal dynamically
      rulesModal = document.createElement('div');
      rulesModal.setAttribute('id', 'rulesModal');
      rulesModal.className = 'modal-overlay';
      
      rulesModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
          <button class="modal-close" id="rulesClose" aria-label="Kapat">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:20px;height:20px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 class="modal-title" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.8rem; margin-bottom: 1rem;">Timur Satrancı Kuralları</h2>
          <div style="max-height: 400px; overflow-y: auto; padding-right: 0.5rem; text-align: left; font-size: 0.95rem; line-height: 1.6; color: var(--color-text-secondary);">
            <p style="margin-bottom: 1rem; color: #fff; font-weight: 500;">
              Timur Satrancı (Tamerlane Chess), Büyük İmparator Emir Timur döneminde yaygın olarak oynanan, standart satrancın 11x10 boyutlarında daha büyük bir tahtada oynanan tarihi ve zengin bir varyasyonudur.
            </p>
            
            <h3 style="color: var(--color-accent-cyan); font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.5rem;">Sıra Dışı Taşlar</h3>
            <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.8rem;">
              <li style="background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 8px; border-left: 3px solid #ffb300;">
                <strong>Zürafa (Giraffe):</strong> Önce çapraz bir adım, sonra dikey veya yatay olarak en az üç adım gider.
              </li>
              <li style="background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 8px; border-left: 3px solid #81c784;">
                <strong>Deve (Camel):</strong> 3x1 atlama hareketi yapar (L şeklinin daha uzun hali, 3 dikey 1 yatay).
              </li>
              <li style="background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 8px; border-left: 3px solid #64b5f6;">
                <strong>Fil (Elephant):</strong> Çapraz olarak tam 2 kare atlar. Önündeki taşı engel olarak görmez.
              </li>
              <li style="background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 8px; border-left: 3px solid #e0e0e0;">
                <strong>Mancınık (Siege Engine):</strong> Dikey veya yatay olarak tam 2 kare atlar.
              </li>
            </ul>

            <h3 style="color: var(--color-accent-cyan); font-size: 1.1rem; margin-top: 1.2rem; margin-bottom: 0.5rem;">Oyun Amacı</h3>
            <p>
              Klasik satrançta olduğu gibi rakip Şah'ı mat etmektir. Ancak tahta daha büyüktür ve ek olarak yedek kareler (Kaleler) bulunur. Piyonların terfisi de piyonun türüne göre özel kurallara tabidir.
            </p>
          </div>
          <button class="btn-submit" id="rulesUnderstand" style="margin-top: 1.5rem;">Anladım</button>
        </div>
      `;
      document.body.appendChild(rulesModal);
      
      // Event bindings
      const rulesClose = document.getElementById('rulesClose');
      const rulesUnderstand = document.getElementById('rulesUnderstand');
      
      const closeRules = () => {
        rulesModal.classList.remove('active');
        document.body.style.overflow = '';
      };
      
      rulesClose.addEventListener('click', closeRules);
      rulesUnderstand.addEventListener('click', closeRules);
      rulesModal.addEventListener('click', (e) => {
        if (e.target === rulesModal) closeRules();
      });
    }
    
    // Show rules modal
    rulesModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --- DYNAMIC NOTIFICATION SYSTEM (TOAST) ---
  function showNotification(message, type = 'info') {
    // Check/create toast container
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('id', 'notification-container');
      container.style.position = 'fixed';
      container.style.bottom = '2rem';
      container.style.right = '2rem';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '0.8rem';
      container.style.zIndex = '999';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.style.background = 'rgba(10, 34, 24, 0.95)';
    toast.style.color = '#fff';
    toast.style.padding = '1rem 1.8rem';
    toast.style.borderRadius = '12px';
    toast.style.border = '1px solid rgba(0, 229, 255, 0.2)';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
    toast.style.fontFamily = 'var(--font-primary)';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '500';
    toast.style.transform = 'translateY(50px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Change accent border based on type
    if (type === 'success') {
      toast.style.borderLeft = '4px solid #81c784';
    } else if (type === 'error') {
      toast.style.borderLeft = '4px solid #ef5350';
    } else {
      toast.style.borderLeft = '4px solid var(--color-accent-cyan)';
    }
    
    toast.textContent = message;
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);
    
    // Animate out and remove
    setTimeout(() => {
      toast.style.transform = 'translateY(-20px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 400);
    }, 3500);
  }
});
