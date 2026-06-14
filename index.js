document.addEventListener('DOMContentLoaded', () => {
    // SPA Navigation Setup
    const navLinks = document.querySelectorAll('.nav-links li a, .logo-container');
    const sections = document.querySelectorAll('.page-section');
    
    function showSection(targetId) {
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Update Nav Link States
        document.querySelectorAll('.nav-links li a').forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target') || 'home-page';
            showSection(target);
        });
    });

    // Home Page Action Buttons
    const exploreBtn = document.getElementById('btn-explore');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            showSection('shop-page');
        });
    }

    const contactBtn = document.getElementById('btn-contact');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            showSection('contact-page');
        });
    }

    // Glowing Card Pointer Glow Positioning
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Carousel Controller Logic
    let currentSlide = 0;
    const slidesContainer = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const totalSlides = slides.length;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentSlide = index;
        
        // Slide viewport using translate
        if (slidesContainer) {
            slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        // Update Thumbnail Active states
        thumbnails.forEach((thumb, idx) => {
            if (idx === currentSlide) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Event listeners for Carousel Buttons
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }

    thumbnails.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
            goToSlide(idx);
        });
    });

    // Details Panel Overlay Toggler (For HP ProBook 440 G8)
    const probookCard = document.getElementById('probook-card');
    const detailsOverlay = document.getElementById('details-overlay');
    const closeDetailsBtn = document.getElementById('close-details-btn');

    if (probookCard && detailsOverlay) {
        probookCard.addEventListener('click', () => {
            detailsOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
            goToSlide(0); // Reset carousel to first slide
        });
    }

    if (closeDetailsBtn && detailsOverlay) {
        closeDetailsBtn.addEventListener('click', () => {
            detailsOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // Enable scrolling
        });
        
        // Close on clicking overlay background
        detailsOverlay.addEventListener('click', (e) => {
            if (e.target === detailsOverlay) {
                detailsOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Interactive Toast Notification
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    function showToast(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }

    // Cart Actions & Drawer Controller
    let cartCount = 0;
    const cartIcon = document.querySelector('.cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('btn-checkout');
    
    const cartBadge = document.getElementById('cart-badge');
    const addToCartBtn = document.getElementById('btn-add-cart');
    const buyNowBtn = document.getElementById('btn-buy-now');

    function updateCartDrawer() {
        if (!cartItemsContainer || !cartTotalPrice || !checkoutBtn) return;
        
        // Update Cart Badge Visibility & Count
        if (cartBadge) {
            if (cartCount > 0) {
                cartBadge.textContent = cartCount;
                cartBadge.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
            }
        }
        
        if (cartCount > 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-item">
                    <img src="assets/hp_probook.png" alt="HP ProBook 440 G8">
                    <div class="cart-item-info">
                        <div class="cart-item-title">HP ProBook 440 G8</div>
                        <div class="cart-item-price">₹32,999</div>
                        <div class="cart-item-qty">Quantity: ${cartCount}</div>
                    </div>
                    <button class="cart-remove-btn" aria-label="Remove item">✕</button>
                </div>
            `;
            const total = cartCount * 32999;
            cartTotalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
            checkoutBtn.disabled = false;
            
            // Wire up the click event handler for the remove button
            const removeBtn = cartItemsContainer.querySelector('.cart-remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    cartCount = 0;
                    updateCartDrawer();
                    showToast('HP ProBook 440 G8 removed from cart.');
                });
            }
        } else {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-msg">
                    Your cart is empty.<br>Select our featured laptop to get started!
                </div>
            `;
            cartTotalPrice.textContent = '₹0';
            checkoutBtn.disabled = true;
        }
    }

    // Toggle Cart Drawer
    if (cartIcon && cartDrawer) {
        cartIcon.addEventListener('click', () => {
            cartDrawer.classList.toggle('active');
        });
    }

    if (closeCartBtn && cartDrawer) {
        closeCartBtn.addEventListener('click', () => {
            cartDrawer.classList.remove('active');
        });
    }

    // Close Cart on click outside
    document.addEventListener('click', (e) => {
        if (cartDrawer && cartDrawer.classList.contains('active')) {
            if (!cartDrawer.contains(e.target) && !cartIcon.contains(e.target)) {
                cartDrawer.classList.remove('active');
            }
        }
    });

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            cartCount++;
            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.style.display = 'flex';
            }
            updateCartDrawer();
            showToast('HP ProBook 440 G8 added to your cart!');
            
            // Automatically open cart drawer to show updated item
            setTimeout(() => {
                if (cartDrawer) cartDrawer.classList.add('active');
            }, 600);
        });
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            cartCount = 1;
            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.style.display = 'flex';
            }
            updateCartDrawer();
            if (cartDrawer) cartDrawer.classList.add('active');
            showToast('Item loaded to cart. Opening checkout details...');
        });
    }

    // ==========================================
    // Checkout Overlay Wizard Logic
    // ==========================================
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutShipping = document.getElementById('checkout-shipping');
    const checkoutTotal = document.getElementById('checkout-total');
    const shippingRadios = document.querySelectorAll('input[name="shipping-location"]');
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    
    const btnProceedToPayment = document.getElementById('btn-proceed-to-payment');
    const btnProceedPaymentFinal = document.getElementById('btn-proceed-payment-final');
    const btnCheckoutRedirectContact = document.getElementById('btn-checkout-redirect-contact');
    
    const checkoutStepShipping = document.getElementById('checkout-step-shipping');
    const checkoutStepPayment = document.getElementById('checkout-step-payment');
    const checkoutStepSuccess = document.getElementById('checkout-step-success');
    const checkoutStepDots = document.querySelectorAll('.checkout-step-dot');
    const checkoutStepLines = document.querySelectorAll('.checkout-step-line');
    
    const successOrderId = document.getElementById('success-order-id');
    const trackerOrderId = document.getElementById('tracker-order-id');

    let shippingCost = 0;
    let basePrice = 32999;
    let orderNum = '';

    function calculateCheckoutPrices() {
        if (!checkoutSubtotal || !checkoutShipping || !checkoutTotal) return;
        const subtotal = cartCount * basePrice;
        checkoutSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        checkoutShipping.textContent = shippingCost === 0 ? 'FREE' : `+₹${shippingCost.toLocaleString('en-IN')}`;
        
        const finalTotal = subtotal + shippingCost;
        checkoutTotal.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;
    }

    function resetCheckoutSteps() {
        checkoutStepShipping.classList.add('active');
        checkoutStepPayment.classList.remove('active');
        checkoutStepSuccess.classList.remove('active');
        
        // Reset indicator dots
        checkoutStepDots.forEach((dot, idx) => {
            if (idx === 0) {
                dot.className = 'checkout-step-dot active';
            } else {
                dot.className = 'checkout-step-dot';
            }
        });
        
        // Reset lines
        checkoutStepLines.forEach(line => {
            line.className = 'checkout-step-line';
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartDrawer) cartDrawer.classList.remove('active');
            if (checkoutOverlay) {
                resetCheckoutSteps();
                calculateCheckoutPrices();
                
                // Select Delhi as default
                const delhiRadio = document.querySelector('input[value="delhi"]');
                if (delhiRadio) {
                    delhiRadio.checked = true;
                    shippingCost = 0;
                }
                calculateCheckoutPrices();
                
                checkoutOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (closeCheckoutBtn && checkoutOverlay) {
        closeCheckoutBtn.addEventListener('click', () => {
            checkoutOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Shipping selection change handler
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'delhi') {
                shippingCost = 0;
            } else if (val === 'ncr') {
                shippingCost = 1000;
            }
            calculateCheckoutPrices();
        });
    });

    // Handle Contact Sales button redirection from Step 1 Outside NCR Warning
    if (btnCheckoutRedirectContact) {
        btnCheckoutRedirectContact.addEventListener('click', (e) => {
            e.preventDefault();
            if (checkoutOverlay) checkoutOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            showSection('contact-page');
        });
    }

    // Proceed to Step 2: Payment
    if (btnProceedToPayment) {
        btnProceedToPayment.addEventListener('click', () => {
            const selectedShipping = document.querySelector('input[name="shipping-location"]:checked');
            if (selectedShipping && selectedShipping.value === 'outside') {
                showToast('We do not currently ship to areas outside Delhi/NCR. Please click Contact Sales.');
                return;
            }
            
            checkoutStepShipping.classList.remove('active');
            checkoutStepPayment.classList.add('active');
            
            // Update dots
            checkoutStepDots[0].className = 'checkout-step-dot completed';
            checkoutStepDots[1].className = 'checkout-step-dot active';
            
            // Update lines
            checkoutStepLines[0].className = 'checkout-step-line active';
        });
    }

    // Proceed to Step 3: Success
    if (btnProceedPaymentFinal) {
        btnProceedPaymentFinal.addEventListener('click', () => {
            // Generate mock order ID
            const randNum = Math.floor(10000 + Math.random() * 90000);
            orderNum = `#RNV-${randNum}`;
            if (successOrderId) successOrderId.textContent = orderNum;
            if (trackerOrderId) trackerOrderId.textContent = orderNum;
            
            checkoutStepPayment.classList.remove('active');
            checkoutStepSuccess.classList.add('active');
            
            // Update dots
            checkoutStepDots[1].className = 'checkout-step-dot completed';
            checkoutStepDots[2].className = 'checkout-step-dot active completed';
            
            // Update lines
            checkoutStepLines[0].className = 'checkout-step-line active completed';
            checkoutStepLines[1].className = 'checkout-step-line active completed';

            // Clear Cart completely upon successful order placement
            cartCount = 0;
            updateCartDrawer();
            showToast('Order Placed Successfully! Payment received.');
        });
    }

    // ==========================================
    // Live Order Status Tracker logic
    // ==========================================
    const trackerOverlay = document.getElementById('tracker-overlay');
    const btnTrackOrder = document.getElementById('btn-track-order');
    const closeTrackerBtn = document.getElementById('close-tracker-btn');

    if (btnTrackOrder) {
        btnTrackOrder.addEventListener('click', () => {
            if (checkoutOverlay) checkoutOverlay.classList.remove('active');
            if (trackerOverlay) {
                trackerOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (closeTrackerBtn && trackerOverlay) {
        closeTrackerBtn.addEventListener('click', () => {
            trackerOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        trackerOverlay.addEventListener('click', (e) => {
            if (e.target === trackerOverlay) {
                trackerOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ==========================================
    // FAQ Support Chat Widget Logic
    // ==========================================
    const chatBubbleBtn = document.getElementById('chat-bubble-btn');
    const chatWindow = document.getElementById('chat-window');
    const closeChatWindow = document.getElementById('close-chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const faqBtns = document.querySelectorAll('.chat-faq-btn');

    if (chatBubbleBtn && chatWindow) {
        chatBubbleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatWindow.classList.toggle('active');
            // Scroll messages to bottom on open
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // Remove pulse animation after user expands the chat window once
            const pulse = chatBubbleBtn.querySelector('.chat-pulse');
            if (pulse) {
                pulse.style.display = 'none';
            }
        });
    }

    if (closeChatWindow && chatWindow) {
        closeChatWindow.addEventListener('click', (e) => {
            e.stopPropagation();
            chatWindow.classList.remove('active');
        });
    }

    // Close chat bubble on clicking outside the chat window
    document.addEventListener('click', (e) => {
        if (chatWindow && chatWindow.classList.contains('active')) {
            if (!chatWindow.contains(e.target) && !chatBubbleBtn.contains(e.target)) {
                chatWindow.classList.remove('active');
            }
        }
    });

    const faqResponses = {
        care: "🛡️ <strong>ReNova Care Package:</strong> Included FREE with all laptops! Covers 3 months comprehensive warranty (parts & service), 3 months limited coverage, and 6 months free labor support. Plus 7-day money-back replacement assurance.",
        checks: "⚡ <strong>40+ Quality Audits:</strong> Every corporate notebook is inspected by hand. We verify keyboard keystrokes, stress-test the CPU/motherboard, check battery health (replaced if under 80%), check display pixels, and apply fresh cooling thermal paste.",
        bulk: "💼 <strong>Bulk/Corporate Orders:</strong> Yes, we provide tier-one discounts starting from purchases of 3+ units for administrative offices, research setups, or colleges. Contact our CEO Aarav Tank directly at the Contact Us page for pricing schedules.",
        shipping: "🚚 <strong>Shipping Policy:</strong> We offer <strong>FREE delivery inside Delhi</strong>. For Gurgaon, Noida, Ghaziabad, and Faridabad (NCR) shipping is ₹1,000. If you are outside NCR, contact support: we can manually organize secure insured courier options for you!"
    };

    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqType = btn.getAttribute('data-faq');
            const answerText = faqResponses[faqType];
            const questionText = btn.textContent;

            if (!chatMessages || !answerText) return;

            // Append User Question
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'message user-message';
            userMsgDiv.textContent = questionText;
            chatMessages.appendChild(userMsgDiv);

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Temporary simulated typing reply
            const botTypingDiv = document.createElement('div');
            botTypingDiv.className = 'message bot-message';
            botTypingDiv.innerHTML = "<em>ReNova Assistant is typing...</em>";
            setTimeout(() => {
                chatMessages.appendChild(botTypingDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 300);

            // Replace with actual answer after a delay
            setTimeout(() => {
                botTypingDiv.innerHTML = answerText;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1200);
        });
    });

    // Wire up the home page hero shop button
    const heroShopBtn = document.getElementById('btn-explore-shop');
    if (heroShopBtn) {
        heroShopBtn.addEventListener('click', () => {
            showSection('shop-page');
        });
    }

    // Initialize cart drawer view
    updateCartDrawer();

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract inputs
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const msg = document.getElementById('form-message').value.trim();
            
            if (!name || !email || !msg) {
                showToast('Please fill out all fields.');
                return;
            }
            
            showToast(`Thank you, ${name}! Your message has been sent successfully.`);
            contactForm.reset();
        });
    }
});
