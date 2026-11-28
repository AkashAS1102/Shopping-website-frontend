/* ============================
   CONTACT.JS v3.0 – Enterprise Support & Experience Hub
   Interactive Regional Desks, Real-time Ticket Dispatch,
   Store Locator, Live Assistant with Typing Indicators,
   FAQ Search & Helpful Voting, Callback Scheduler
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. City Switcher Tabs ──
  const cities = {
    bangalore: {
      title: 'Bangalore Corporate Headquarters',
      address: '123, MG Road, Silicon Heights, 4th Floor, Bangalore, Karnataka 560001, India',
      phone: '+91 (80) 4123 4567',
      email: 'bangalore.office@shopnow.in'
    },
    mumbai: {
      title: 'Mumbai Western Fulfillment Center',
      address: 'Plot 45, Bandra Kurla Complex (BKC), Commercial Hub, Mumbai, Maharashtra 400051',
      phone: '+91 (22) 2654 9870',
      email: 'mumbai.hub@shopnow.in'
    },
    delhi: {
      title: 'Delhi NCR Logistics & Service Hub',
      address: 'Building 12, Connaught Place, Outer Circle, New Delhi 110001',
      phone: '+91 (11) 2341 8765',
      email: 'delhi.desk@shopnow.in'
    }
  };

  document.querySelectorAll('.city-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cityKey = btn.dataset.city;
      const c = cities[cityKey];
      if (c) {
        const titleEl = document.getElementById('cityTitle');
        const addrEl  = document.getElementById('cityAddress');
        const phoneEl = document.getElementById('cityPhone');
        const emailEl = document.getElementById('cityEmail');

        if (titleEl) titleEl.textContent = c.title;
        if (addrEl)  addrEl.textContent  = c.address;
        if (phoneEl) phoneEl.textContent = c.phone;
        if (emailEl) emailEl.textContent = c.email;
      }
    });
  });

  // ── 2. Contact Form Submission & Ticket Creation ──
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('cName')?.value.trim();
    const email   = document.getElementById('cEmail')?.value.trim();
    const phone   = document.getElementById('cPhone')?.value.trim();
    const orderNo = document.getElementById('cOrder')?.value.trim();
    const subject = document.getElementById('cSubject')?.value;
    const message = document.getElementById('cMessage')?.value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Inquiry…';
    btn.disabled = true;

    // Simulate ticket generation
    setTimeout(() => {
      const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);

      // Save to support history
      const tickets = LS.get('sn_support_tickets', []);
      tickets.unshift({
        ticketId,
        name,
        email,
        phone,
        orderNo,
        subject,
        message,
        date: new Date().toISOString(),
        status: 'Open'
      });
      LS.set('sn_support_tickets', tickets);

      btn.innerHTML = '<i class="fas fa-check"></i> Inquiry Received!';
      btn.style.background = 'var(--success)';
      showToast(`✅ Ticket #${ticketId} created! Our team will respond shortly.`);

      renderSupportTickets();

      setTimeout(() => {
        contactForm.reset();
        btn.innerHTML = origHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }, 1200);
  });

  // ── 3. Real-Time Searchable FAQ Filter ──
  const faqSearch = document.getElementById('faqSearchInput');
  const faqItems  = document.querySelectorAll('.faq-item');

  faqSearch?.addEventListener('input', () => {
    const query = faqSearch.value.toLowerCase().trim();
    let matchCount = 0;

    faqItems.forEach(item => {
      const qText = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
      const aText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
      const keywords = item.dataset.keywords || '';

      const isMatch = qText.includes(query) || aText.includes(query) || keywords.includes(query);
      item.style.display = isMatch ? 'block' : 'none';
      if (isMatch) matchCount++;
    });

    let noResultsEl = document.getElementById('faqNoResults');
    if (matchCount === 0) {
      if (!noResultsEl) {
        noResultsEl = document.createElement('div');
        noResultsEl.id = 'faqNoResults';
        noResultsEl.style.cssText = 'text-align:center;padding:2rem;color:var(--text-muted);';
        noResultsEl.innerHTML = '<i class="fas fa-circle-question" style="font-size:2.5rem;opacity:.2;margin-bottom:.5rem;display:block;"></i>No matching questions found. Use live chat below for instant help!';
        document.getElementById('faqAccordionList')?.appendChild(noResultsEl);
      }
    } else if (noResultsEl) {
      noResultsEl.remove();
    }
  });

  // ── 4. FAQ Accordion Click Expand ──
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ── 5. Live Support Chat Widget Simulator ──
  const chatModal   = document.getElementById('liveChatModal');
  const openChatBtn = document.getElementById('openChatBtn');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const chatForm    = document.getElementById('chatForm');
  const chatInput   = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  openChatBtn?.addEventListener('click', () => {
    if (chatModal) {
      chatModal.style.display = chatModal.style.display === 'flex' ? 'none' : 'flex';
      if (chatModal.style.display === 'flex') {
        chatInput?.focus();
      }
    }
  });

  closeChatBtn?.addEventListener('click', () => {
    if (chatModal) chatModal.style.display = 'none';
  });

  function appendChatMessage(text, sender = 'bot') {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = sender === 'user'
      ? 'background:var(--grad-primary);color:#fff;padding:.65rem .95rem;border-radius:var(--radius-sm);max-width:85%;align-self:flex-end;line-height:1.4;'
      : 'background:var(--bg);padding:.65rem .95rem;border-radius:var(--radius-sm);max-width:85%;align-self:flex-start;color:var(--text);line-height:1.4;';
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleBotResponse(userMsg) {
    const q = userMsg.toLowerCase();
    let reply = "I'm here to help! Could you please clarify if your inquiry is regarding order tracking, returns, shipping, or coupon codes?";

    if (q.includes('track') || q.includes('order') || q.includes('status')) {
      reply = "To track any active order, visit your Account > My Orders page and tap 'Track Shipment'. You can also provide your order number here for status updates!";
    } else if (q.includes('return') || q.includes('refund') || q.includes('replace')) {
      reply = "We offer a 30-day return policy on all products! Doorstep pickup is completely free, and refunds are processed within 3-5 business days.";
    } else if (q.includes('coupon') || q.includes('discount') || q.includes('code') || q.includes('promo')) {
      reply = "Today's hot coupon codes: FLASH50 (50% off electronics), SAVE10 (10% off any order), and FLAT100 (₹100 off above ₹500). Apply them in your cart!";
    } else if (q.includes('delivery') || q.includes('shipping') || q.includes('days') || q.includes('time')) {
      reply = "Standard delivery takes 3 to 5 business days across India. Free shipping applies on all orders above ₹499!";
    } else if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
      reply = "Hello! 👋 Welcome to ShopNow priority support. How can I assist you today?";
    }

    // Show typing dots animation
    const typingEl = document.createElement('div');
    typingEl.id = 'chatTypingIndicator';
    typingEl.className = 'typing-dots';
    typingEl.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Typing effect delay
    setTimeout(() => {
      typingEl.remove();
      appendChatMessage(reply, 'bot');
    }, 850);
  }

  chatForm?.addEventListener('submit', e => {
    e.preventDefault();
    const text = chatInput?.value.trim();
    if (!text) return;

    appendChatMessage(text, 'user');
    chatInput.value = '';
    handleBotResponse(text);
  });

  // Quick Action Buttons in chat
  document.querySelectorAll('.chat-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const promptText = btn.textContent;
      appendChatMessage(promptText, 'user');
      handleBotResponse(promptText);
    });
  });

  // ── 6. Support Tickets Table ──
  function renderSupportTickets() {
    const tableWrap = document.getElementById('supportTicketsWrap');
    if (!tableWrap) return;
    const tickets = LS.get('sn_support_tickets', []);
    if (!tickets.length) {
      tableWrap.innerHTML = `
        <div style="text-align:center;padding:1.5rem;color:var(--text-muted);font-size:.9rem;">
          <i class="fas fa-ticket-simple" style="font-size:2rem;opacity:.25;margin-bottom:.5rem;display:block;"></i>
          No open support tickets. Any inquiries you submit will be tracked here.
        </div>`;
      return;
    }
    tableWrap.innerHTML = `
      <div class="ticket-table-wrap">
        <table class="ticket-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map(t => `
              <tr>
                <td><strong>${t.ticketId}</strong></td>
                <td>${t.subject}</td>
                <td>${new Date(t.date).toLocaleDateString('en-IN')}</td>
                <td><span class="badge badge-success" style="font-size:.75rem;">${t.status || 'Under Review'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  renderSupportTickets();

  // ── 7. Interactive Store Locator ──
  function initStoreLocator() {
    const grid = document.getElementById('storeLocatorGrid');
    if (!grid || typeof PHYSICAL_STORES === 'undefined') return;

    grid.innerHTML = PHYSICAL_STORES.map((s, idx) => `
      <div class="store-card ${idx === 0 ? 'selected' : ''}" data-id="${s.id}">
        <div class="store-card-city"><i class="fas fa-location-dot text-primary"></i> ${s.city}</div>
        <div style="font-weight:700;font-size:.9rem;color:var(--text);margin-bottom:.25rem;">${s.name}</div>
        <div class="store-card-address">${s.address}</div>
        <div class="store-card-timing"><i class="far fa-clock"></i> ${s.timing}</div>
        <div style="margin-top:.75rem;display:flex;gap:.5rem;">
          <a href="tel:${s.phone.replace(/\s+/g,'')}" class="btn btn-outline" style="padding:.3rem .6rem;font-size:.78rem;"><i class="fas fa-phone"></i> Call</a>
          <button class="btn btn-primary" onclick="alert('Opening directions to ${s.name} on Google Maps');" style="padding:.3rem .6rem;font-size:.78rem;"><i class="fas fa-directions"></i> Directions</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.store-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
        grid.querySelectorAll('.store-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });
  }
  initStoreLocator();

  // ── 8. Callback Request Scheduler ──
  document.getElementById('callbackForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const phone = document.getElementById('cbPhone')?.value;
    const time = document.getElementById('cbTime')?.value;
    if (!phone) {
      showToast('Please enter your phone number.', 'warning');
      return;
    }
    showToast(`📞 Callback scheduled for ${time || 'today'} at ${phone}!`);
    e.target.reset();
  });

  // ── 9. FAQ Helpful Rating Buttons ──
  document.querySelectorAll('.faq-helpful-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.style.color = 'var(--primary)';
      btn.innerHTML = '<i class="fas fa-check"></i> Thank you!';
      showToast('Feedback noted! Glad this helped.');
    });
  });

  // ── 10. Support Satisfaction Emoji Rating ──
  document.querySelectorAll('.feedback-emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.feedback-emoji-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      showToast(`⭐ Thank you for rating our support ${btn.dataset.rating}!`, 'success');
    });
  });

});
