/* ==========================================================================
   CONTACT FORM HANDLER & VALIDATION (SM WEB STUDIO)
   (Simplified Form Fields, Custom Currency Specification, Input Validations)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const budgetInput = document.getElementById('budget');
  const textarea = document.getElementById('message');

  if (!contactForm) return;

  // 1. TEXTAREA AUTO-RESIZING
  if (textarea) {
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }

  // 2. FORM VALIDATION & SUBMISSION
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset previous errors
    clearErrors();

    const fullName = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const company = document.getElementById('company');
    const websiteType = document.getElementById('website-type');
    const budget = document.getElementById('budget');
    const currency = document.getElementById('currency');
    const message = document.getElementById('message');

    let hasErrors = false;

    // Validate Full Name
    if (!fullName.value.trim()) {
      showFieldError(fullName, "Please enter your name");
      hasErrors = true;
    }

    // Validate Email
    if (!email.value.trim()) {
      showFieldError(email, "Please enter your email");
      hasErrors = true;
    } else if (!isValidEmail(email.value.trim())) {
      showFieldError(email, "Please enter a valid email address");
      hasErrors = true;
    }

    // Validate Phone (Required)
    if (!phone.value.trim()) {
      showFieldError(phone, "Please enter your phone number");
      hasErrors = true;
    } else if (!isValidPhone(phone.value.trim())) {
      showFieldError(phone, "Please enter a valid phone number");
      hasErrors = true;
    }

    // Validate Company (Required)
    if (company && !company.value.trim()) {
      showFieldError(company, "Please enter your company/business name");
      hasErrors = true;
    }

    // Validate Website Type
    if (websiteType && !websiteType.value.trim()) {
      showFieldError(websiteType, "Please describe the kind of website you want");
      hasErrors = true;
    }

    // Validate Budget
    if (budget && (!budget.value.trim() || isNaN(budget.value) || parseFloat(budget.value) <= 0)) {
      showFieldError(budget, "Please enter a valid budget amount");
      hasErrors = true;
    }

    // Validate Currency
    if (currency && !currency.value.trim()) {
      showFieldError(currency, "Please enter your currency (e.g. USD, INR)");
      hasErrors = true;
    }

    // Validate Message
    if (!message.value.trim()) {
      showFieldError(message, "Please enter your project message");
      hasErrors = true;
    }

    if (hasErrors) {
      if (window.showToast) {
        window.showToast("Please fix the highlighted errors before submitting.", "error");
      }
      return;
    }

    // Process Form (WhatsApp Dispatch + EmailJS Backup)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" style="width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2;" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
        <path d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Connecting to WhatsApp...
    `;

    const nameVal = fullName.value.trim();
    const emailVal = email.value.trim();
    const phoneVal = phone.value.trim();
    const companyVal = company ? company.value.trim() : 'N/A';
    const websiteTypeVal = websiteType ? websiteType.value.trim() : 'N/A';
    const budgetVal = budget ? budget.value.trim() : 'N/A';
    const currencyVal = currency ? currency.value.trim().toUpperCase() : 'INR';
    const messageVal = message.value.trim();

    // 1. WhatsApp Message formatting for 9419600518
    const whatsappNumber = "919419600518";
    const whatsappMessage = 
`🚀 *New Project Inquiry - SM Web Studio*

👤 *Name:* ${nameVal}
📧 *Email:* ${emailVal}
📞 *Phone:* ${phoneVal}
🏢 *Company:* ${companyVal}
🌐 *Website Type:* ${websiteTypeVal}
💰 *Budget:* ${budgetVal} ${currencyVal}

📝 *Project Details:*
${messageVal}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;

    // 2. EmailJS backup dispatch
    const templateParams = {
      name: nameVal,
      from_name: nameVal,
      user_name: nameVal,
      email: emailVal,
      from_email: emailVal,
      user_email: emailVal,
      phone: phoneVal,
      phone_number: phoneVal,
      user_phone: phoneVal,
      company: companyVal,
      company_name: companyVal,
      user_company: companyVal,
      "website-type": websiteTypeVal,
      website_type: websiteTypeVal,
      website: websiteTypeVal,
      budget: budgetVal,
      project_budget: budgetVal,
      user_budget: budgetVal,
      currency: currencyVal,
      user_currency: currencyVal,
      message: messageVal,
      project_details: messageVal,
      user_message: messageVal
    };

    if (typeof emailjs !== 'undefined') {
      try {
        emailjs.send('service_tzgpwjd', 'template_qecma34', templateParams)
          .then(() => console.log('EmailJS backup sent successfully.'))
          .catch((err) => console.warn('EmailJS backup error (ignoring):', err));
      } catch (e) {
        console.warn('EmailJS error:', e);
      }
    }

    // 3. Open WhatsApp and notify user
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      if (window.showToast) {
        window.showToast("Inquiry recorded! Opening WhatsApp chat...", "success");
      }

      const openedWindow = window.open(whatsappUrl, '_blank');
      if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }

      contactForm.reset();
      if (textarea) {
        textarea.style.height = '';
      }
    }, 400);
  });

  // Helpers
  function isValidEmail(emailStr) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  }

  function isValidPhone(phoneStr) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phoneStr) && phoneStr.length >= 7;
  }

  function showFieldError(inputEl, message) {
    inputEl.style.borderColor = "#ef4444";
    
    const group = inputEl.closest('.form-group');
    if (group) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error-text';
      errorDiv.style.color = '#ef4444';
      errorDiv.style.fontSize = '0.75rem';
      errorDiv.style.marginTop = '0.35rem';
      errorDiv.style.paddingLeft = '0.5rem';
      errorDiv.innerText = message;
      group.appendChild(errorDiv);
    }
  }

  function clearErrors() {
    const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
      input.style.borderColor = '';
    });

    const errorTexts = contactForm.querySelectorAll('.field-error-text');
    errorTexts.forEach(el => el.remove());
  }

  // Remove error boundary on input focus
  const allInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
  allInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = '';
      const group = input.closest('.form-group');
      if (group) {
        const errorText = group.querySelector('.field-error-text');
        if (errorText) errorText.remove();
      }
    });
  });
});
