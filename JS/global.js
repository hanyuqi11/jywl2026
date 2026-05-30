/**
 * 吉养未来 - Global JavaScript v3.0
 * GSAP动效 · 金色粒子系统 · 红绸飘动 · 视差滚动
 * 淘宝式购物车 · 下单结算系统
 * 红色助农品牌官方首页
 */
(function () {
  'use strict';

  // ========================================
  // Product Database
  // ========================================
  var PRODUCTS = {
    product1: {
      id: 'product1',
      name: '抗联野菜脆棒',
      emoji: '🥬',
      price: 29.90,
      originalPrice: 39.90,
      image: 'https://s41.ax1x.com/2026/05/25/pmCfdaR.png',
      skus: ['原味', '香辣味']
    },
    product2: {
      id: 'product2',
      name: '红粮玉米杂粮杯',
      emoji: '🌽',
      price: 36.90,
      originalPrice: 49.90,
      image: 'https://s41.ax1x.com/2026/05/25/pmCfBPx.png',
      skus: ['便捷杯装', '家庭袋装']
    },
    product3: {
      id: 'product3',
      name: '黑土荞麦脆片',
      emoji: '🥜',
      price: 25.90,
      originalPrice: 35.90,
      image: '',
      skus: ['原味', '芝麻味']
    },
    product4: {
      id: 'product4',
      name: '白山蓝莓冻干酸奶块',
      emoji: '🫐',
      price: 39.90,
      originalPrice: 55.90,
      image: '',
      skus: ['120g装', '180g装']
    }
  };

  // ========================================
  // GSAP Dynamic Loading
  // ========================================
  function loadGSAP(callback) {
    if (window.gsap) { callback(); return; }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
    script.onload = function () {
      var st = document.createElement('script');
      st.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';
      st.onload = function () {
        gsap.registerPlugin(ScrollTrigger);
        callback();
      };
      document.head.appendChild(st);
    };
    document.head.appendChild(script);
  }

  // ========================================
  // Navigation Scroll Effect
  // ========================================
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    function updateNav() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  // Active Nav Link
  function setActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Mobile Menu
  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ========================================
  // Gold Particle System (Canvas)
  // ========================================
  function initParticles() {
    var canvas = document.getElementById('heroParticles');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var maxParticles = 25; // 减少为原来的42%

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.6 + 0.4, // 更小：0.4-2.0
        speedX: (Math.random() - 0.5) * 0.2, // 更慢
        speedY: -(Math.random() * 0.3 + 0.08), // 更慢
        opacity: Math.random() * 0.4 + 0.1, // 更低透明度
        life: Math.random() * 400 + 150, // 更长寿命
        age: 0,
        color: Math.random() > 0.25 ? '212, 166, 58' : '255, 225, 170'
      };
    }

    for (var i = 0; i < maxParticles; i++) {
      var p = createParticle();
      p.age = Math.random() * p.life;
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.speedX + Math.sin(p.age * 0.015) * 0.15; // 更平缓摆动
        p.y += p.speedY;
        p.age++;

        if (p.age > p.life || p.y < -20) {
          particles[i] = createParticle();
          p = particles[i];
          p.y = canvas.height + 20;
        }

        var alpha = p.opacity * (1 - Math.abs(p.age / p.life - 0.5) * 2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ', ' + Math.max(0, alpha) + ')';
        ctx.fill();

        // 更克制的辉光
        if (p.size > 1.0 && alpha > 0.25) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + p.color + ', ' + Math.max(0, alpha * 0.10) + ')';
          ctx.fill();
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ========================================
  // Scroll Reveal (with GSAP)
  // ========================================
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    if (window.gsap) {
      reveals.forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach(function (el) { observer.observe(el); });
    }
  }

  // ========================================
  // Parallax Scrolling
  // ========================================
  function initParallax() {
    var layers = document.querySelectorAll('[data-parallax]');
    if (layers.length === 0) return;

    function updateParallax() {
      var scrollY = window.scrollY;
      layers.forEach(function (layer) {
        var speed = parseFloat(layer.getAttribute('data-parallax')) || 0.3;
        layer.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
      });
    }
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  // ========================================
  // Number Count Animation
  // ========================================
  function initCounters() {
    var counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length === 0) return;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(el, target, suffix);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    });
  }

  function animateCounter(el, target, suffix) {
    var start = performance.now();
    var duration = 2000;
    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) { requestAnimationFrame(update); }
      else { el.textContent = target + suffix; }
    }
    requestAnimationFrame(update);
  }

  // ========================================
  // Smooth Scroll
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ========================================
  // Card Hover Effect
  // ========================================
  function initCardHover() {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(1000px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ========================================
  // Toast Notification
  // ========================================
  function showToast(message) {
    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 2500);
  }

  // ========================================
  // GSAP Hero Animations (if on homepage)
  // ========================================
  function initHeroAnimations() {
    if (!window.gsap || !document.querySelector('.hero')) return;

    var hero = document.querySelector('.hero');
    if (!hero) return;

    var title = hero.querySelector('.hero-title');
    if (title) {
      gsap.fromTo(title,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
      );
    }

    var badge = hero.querySelector('.hero-badge');
    if (badge) {
      gsap.fromTo(badge,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.1, ease: 'back.out(1.7)' }
      );
    }

    var subtitle = hero.querySelector('.hero-subtitle');
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' }
      );
    }

    var buttons = hero.querySelectorAll('.hero-actions .btn');
    buttons.forEach(function (btn, i) {
      gsap.fromTo(btn,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.9 + i * 0.15, ease: 'power2.out' }
      );
    });

    var guide = hero.querySelector('.hero-scroll-guide');
    if (guide) {
      gsap.fromTo(guide,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 1.5, ease: 'power2.out' }
      );
    }
  }

  // ========================================
  // SKU Selection
  // ========================================
  function initSKUSelection() {
    var skuContainers = document.querySelectorAll('.sku-options');
    skuContainers.forEach(function (container) {
      container.addEventListener('click', function (e) {
        var btn = e.target.closest('.sku-option');
        if (!btn) return;
        container.querySelectorAll('.sku-option').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });
  }

  // Get selected SKU for a product
  function getSelectedSKU(productId) {
    var container = document.querySelector('.sku-options[data-product="' + productId + '"]');
    if (!container) return null;
    var active = container.querySelector('.sku-option.active');
    return active ? active.getAttribute('data-sku') : null;
  }

  // Get current quantity
  function getQty(productId) {
    var input = document.getElementById('qty-' + productId);
    if (!input) return 1;
    var val = parseInt(input.value);
    return isNaN(val) || val < 1 ? 1 : Math.min(val, 99);
  }

  // ========================================
  // Quantity Control (global)
  // ========================================
  window.changeQty = function (productId, delta) {
    var input = document.getElementById('qty-' + productId);
    if (!input) return;
    var val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(99, val + delta));
    input.value = val;
  };

  window.validateQty = function (productId) {
    var input = document.getElementById('qty-' + productId);
    if (!input) return;
    var val = parseInt(input.value);
    if (isNaN(val) || val < 1) input.value = 1;
    if (val > 99) input.value = 99;
  };

  // ========================================
  // Cart System (localStorage)
  // ========================================
  var CART_KEY = 'jiyang_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    var cart = getCart();
    var count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var badge = document.getElementById('cartBadgeNav');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  // Add to cart
  window.addToCart = function (productId) {
    var product = PRODUCTS[productId];
    if (!product) return;

    var sku = getSelectedSKU(productId);
    var qty = getQty(productId);
    var cart = getCart();

    // Check if same product+SKU already exists
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId === productId && cart[i].sku === sku) {
        existing = cart[i];
        break;
      }
    }

    if (existing) {
      existing.qty = Math.min(99, existing.qty + qty);
    } else {
      cart.push({
        productId: productId,
        name: product.name,
        emoji: product.emoji,
        image: product.image,
        price: product.price,
        sku: sku,
        qty: qty
      });
    }

    saveCart(cart);
    showToast('✓ 已加入购物车：' + product.name + '（' + sku + '）×' + qty);
    refreshCartDrawer();
  };

  // Buy now
  window.buyNow = function (productId) {
    var product = PRODUCTS[productId];
    if (!product) return;

    var sku = getSelectedSKU(productId);
    var qty = getQty(productId);

    // Clear cart and add single item
    var cart = [{
      productId: productId,
      name: product.name,
      emoji: product.emoji,
      image: product.image,
      price: product.price,
      sku: sku,
      qty: qty
    }];
    saveCart(cart);
    openCheckout();
  };

  // ========================================
  // Cart Drawer
  // ========================================
  window.toggleCart = function () {
    var overlay = document.getElementById('cartOverlay');
    var drawer = document.getElementById('cartDrawer');
    if (!overlay || !drawer) return;

    var isOpen = drawer.classList.contains('active');
    if (isOpen) {
      overlay.classList.remove('active');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      refreshCartDrawer();
      overlay.classList.add('active');
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  function refreshCartDrawer() {
    var body = document.getElementById('cartDrawerBody');
    var footer = document.getElementById('cartDrawerFooter');
    var totalEl = document.getElementById('cartTotalPrice');
    if (!body || !footer) return;

    var cart = getCart();

    if (cart.length === 0) {
      body.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>购物车是空的</p><span>快去选购老区好物吧～</span></div>';
      footer.style.display = 'none';
      return;
    }

    var total = 0;
    var html = '';
    cart.forEach(function (item, index) {
      var subtotal = item.price * item.qty;
      total += subtotal;
      var imgHtml = item.image
        ? '<img src="' + item.image + '" alt="' + item.name + '">'
        : item.emoji;
      html += '<div class="cart-item">' +
        '<div class="cart-item-img">' + imgHtml + '</div>' +
        '<div class="cart-item-info">' +
        '<div class="cart-item-title">' + item.name + '</div>' +
        '<div class="cart-item-sku">' + item.sku + '</div>' +
        '<div class="cart-item-bottom">' +
        '<span class="cart-item-price">¥' + subtotal.toFixed(2) + '</span>' +
        '<div class="cart-item-qty-control">' +
        '<button class="cart-item-qty-btn" onclick="cartChangeQty(' + index + ', -1)">−</button>' +
        '<span class="cart-item-qty-val">' + item.qty + '</span>' +
        '<button class="cart-item-qty-btn" onclick="cartChangeQty(' + index + ', 1)">+</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<button class="cart-item-delete" onclick="cartRemove(' + index + ')" title="删除">✕</button>' +
        '</div>';
    });

    body.innerHTML = html;
    footer.style.display = 'block';
    totalEl.textContent = '¥' + total.toFixed(2);
  }

  window.cartChangeQty = function (index, delta) {
    var cart = getCart();
    if (index < 0 || index >= cart.length) return;
    cart[index].qty = Math.max(1, Math.min(99, cart[index].qty + delta));
    saveCart(cart);
    refreshCartDrawer();
  };

  window.cartRemove = function (index) {
    var cart = getCart();
    if (index < 0 || index >= cart.length) return;
    var removed = cart[index];
    cart.splice(index, 1);
    saveCart(cart);
    refreshCartDrawer();
    showToast('已移除：' + removed.name);
  };

  // ========================================
  // Checkout
  // ========================================
  window.checkout = function () {
    var cart = getCart();
    if (cart.length === 0) {
      showToast('购物车是空的，快去选购吧～');
      return;
    }
    // Close cart drawer
    toggleCart();
    openCheckout();
  };

  function openCheckout() {
    var overlay = document.getElementById('checkoutOverlay');
    var modal = document.getElementById('checkoutModal');
    if (!overlay || !modal) return;

    var cart = getCart();
    if (cart.length === 0) return;

    // Build checkout items
    var body = document.getElementById('checkoutBody');
    var total = 0;
    var html = '';
    cart.forEach(function (item) {
      var subtotal = item.price * item.qty;
      total += subtotal;
      var imgHtml = item.image
        ? '<img src="' + item.image + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:contain;">'
        : '<span style="font-size:1.5rem;">' + item.emoji + '</span>';
      html += '<div class="checkout-item">' +
        '<div class="checkout-item-img">' + imgHtml + '</div>' +
        '<div class="checkout-item-info">' +
        '<div class="checkout-item-name">' + item.name + '</div>' +
        '<div class="checkout-item-sku">' + item.sku + ' ×' + item.qty + '</div>' +
        '</div>' +
        '<div class="checkout-item-price">¥' + subtotal.toFixed(2) + '</div>' +
        '</div>';
    });

    // Add mock shipping form
    html += '<div class="checkout-form">' +
      '<div class="checkout-form-label">📦 收货信息</div>' +
      '<div class="checkout-form-row">' +
      '<input type="text" id="checkoutName" placeholder="收货人姓名" value="张三">' +
      '<input type="tel" id="checkoutPhone" placeholder="手机号码" value="138****8888">' +
      '</div>' +
      '<input type="text" id="checkoutAddress" placeholder="详细地址" value="吉林省长春市朝阳区xxx路xxx号" style="width:100%;margin-bottom:10px;">' +
      '<div class="checkout-form-label" style="margin-top:8px;">💬 备注（选填）</div>' +
      '<input type="text" id="checkoutNote" placeholder="如有特殊要求请备注" style="width:100%;">' +
      '</div>';

    body.innerHTML = html;
    document.getElementById('checkoutTotalPrice').textContent = '¥' + total.toFixed(2);

    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeCheckout = function () {
    var overlay = document.getElementById('checkoutOverlay');
    var modal = document.getElementById('checkoutModal');
    if (overlay) overlay.classList.remove('active');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.submitOrder = function () {
    var name = (document.getElementById('checkoutName') || {}).value || '未填写';
    var phone = (document.getElementById('checkoutPhone') || {}).value || '未填写';

    if (!name || !phone || name === '未填写' || phone === '未填写') {
      showToast('请填写收货人姓名和手机号码');
      return;
    }

    var cart = getCart();
    if (cart.length === 0) return;

    // Build order summary
    var items = cart.map(function (item) {
      return item.name + '（' + item.sku + '）×' + item.qty;
    }).join('、');

    var total = cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);

    // Generate order ID
    var orderId = 'JY' + Date.now().toString(36).toUpperCase();

    // Save order to localStorage
    var orders = [];
    try { orders = JSON.parse(localStorage.getItem('jiyang_orders')) || []; } catch (e) {}
    orders.unshift({
      orderId: orderId,
      items: cart.slice(),
      total: total,
      name: name,
      phone: phone,
      address: (document.getElementById('checkoutAddress') || {}).value || '',
      note: (document.getElementById('checkoutNote') || {}).value || '',
      time: new Date().toLocaleString('zh-CN'),
      status: '待发货'
    });
    localStorage.setItem('jiyang_orders', JSON.stringify(orders));

    // Clear cart
    saveCart([]);

    // Close checkout
    closeCheckout();

    // Show success
    var successOverlay = document.getElementById('orderSuccessOverlay');
    var successModal = document.getElementById('orderSuccessModal');
    var successMsg = document.getElementById('orderSuccessMsg');
    if (successOverlay && successModal) {
      successMsg.innerHTML = '订单编号：<strong>' + orderId + '</strong><br>' +
        '商品：' + items + '<br>' +
        '金额：<strong style="color:#FF5000;">¥' + total.toFixed(2) + '</strong><br>' +
        '预计3-5个工作日送达';
      successOverlay.classList.add('active');
      successModal.classList.add('active');
    }

    refreshCartDrawer();
    updateCartBadge();
  };

  window.closeOrderSuccess = function () {
    var overlay = document.getElementById('orderSuccessOverlay');
    var modal = document.getElementById('orderSuccessModal');
    if (overlay) overlay.classList.remove('active');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close modals on overlay click
  document.addEventListener('click', function (e) {
    if (e.target.id === 'checkoutOverlay') closeCheckout();
    if (e.target.id === 'orderSuccessOverlay') closeOrderSuccess();
  });

  // ========================================
  // Init Everything
  // ========================================
  function init() {
    initNav();
    setActiveNav();
    initMobileMenu();
    initParticles();
    initParallax();
    initCounters();
    initSmoothScroll();
    initCardHover();
    initScrollReveal();
    initSKUSelection();

    // Init cart badge
    updateCartBadge();

    // Load GSAP and run enhanced animations
    loadGSAP(function () {
      initHeroAnimations();
    });

    console.log('%c🌾 吉养未来 v3.0 · 红色助农品牌 %c把青春写进黑土地',
      'color: #C8102E; font-size: 1.2em; font-weight: bold;',
      'color: #D4AF37;');
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();