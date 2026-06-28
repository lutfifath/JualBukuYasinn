// ===== APLIKASI TOKO BUKU YASIN =====
// File ini berisi SEMUA fungsi yang dibutuhkan

console.log('🚀 App.js loaded successfully');

// ===== 1. CART STORAGE FUNCTIONS =====
function getCart() {
    try {
        const cart = localStorage.getItem('bukuyasin_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error('Error reading cart:', e);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('bukuyasin_cart', JSON.stringify(cart));
        console.log('✅ Cart saved:', cart);
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// ===== 2. TAMBAH KE KERANJANG =====
function tambahKeKeranjang(event, name, price) {
    event.preventDefault();
    console.log('Adding to cart:', name, price);
    
    const cart = getCart();
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showNotification(`✅ ${name} ditambahkan ke keranjang!`);
    
    // Redirect after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'keranjang.html';
    }, 1500);
}

// ===== 3. UPDATE CART COUNT =====
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    console.log('Total items in cart:', totalItems);
    
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = totalItems;
    });
}

// ===== 4. SHOW NOTIFICATION =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentElement) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== 5. SHOW ALERT DIALOG =====
function showAlert(title, message) {
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
        animation: zoomIn 0.3s ease-out;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Tutup';
    closeBtn.style.cssText = `
        background-color: #b41525;
        color: white;
        border: none;
        padding: 10px 30px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
        transition: all 0.3s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.backgroundColor = '#920f1a';
    closeBtn.onmouseout = () => closeBtn.style.backgroundColor = '#b41525';
    closeBtn.onclick = () => backdrop.remove();

    modal.innerHTML = `
        <h2 style="color: #333; margin-bottom: 15px; font-size: 1.5rem;">${title}</h2>
        <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">${message}</p>
    `;
    modal.appendChild(closeBtn);

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', function(e) {
        if (e.target === backdrop) {
            backdrop.remove();
        }
    });
}

// ===== 6. KERANJANG PAGE FUNCTIONS =====
function loadCart() {
    const cart = getCart();
    const container = document.getElementById('cartItemsContainer');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Keranjang Anda Kosong</h3>
                <p>Mulai belanja sekarang!</p>
                <a href="produk.html" class="btn btn-primary" style="margin-top: 20px;">Belanja Sekarang</a>
            </div>
        `;
        document.getElementById('itemCount').textContent = '0';
        document.getElementById('subtotal').textContent = 'Rp. 0';
        document.getElementById('total').textContent = 'Rp. 0';
        return;
    }

    let cartHTML = '';
    let totalItems = 0;
    let subtotal = 0;

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        cartHTML += `
            <div class="cart-item">
                <div class="item-image"></div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">Harga: Rp. ${item.price.toLocaleString('id-ID')}</div>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">−</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    container.innerHTML = cartHTML;
    document.getElementById('itemCount').textContent = totalItems;
    document.getElementById('subtotal').textContent = `Rp. ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('total').textContent = `Rp. ${subtotal.toLocaleString('id-ID')}`;
}

function changeQuantity(index, change) {
    let cart = getCart();
    cart[index].quantity += change;
    
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }
    
    saveCart(cart);
    updateCartCount();
    loadCart();
}

function removeFromCart(index) {
    if (confirm('Hapus produk ini dari keranjang?')) {
        let cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        updateCartCount();
        loadCart();
        showNotification('✅ Produk dihapus dari keranjang');
    }
}

function goToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showAlert('⚠️ Peringatan!', 'Anda belum memesan barang. Silakan pilih produk terlebih dahulu.');
        return;
    }
    window.location.href = 'checkout.html';
}

// ===== 7. CHECKOUT PAGE FUNCTIONS =====
function loadCheckoutItems() {
    const cart = getCart();
    const container = document.getElementById('orderItems');

    if (!container) return;

    if (cart.length === 0) {
        window.location.href = 'keranjang.html';
        return;
    }

    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="order-item">
                <div>
                    <span><strong>${item.name}</strong></span><br>
                    <small>x${item.quantity}</small>
                </div>
                <span><strong>Rp. ${itemTotal.toLocaleString('id-ID')}</strong></span>
            </div>
        `;
    });

    container.innerHTML = html;
    document.getElementById('subtotal').textContent = `Rp. ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('total').textContent = `Rp. ${subtotal.toLocaleString('id-ID')}`;
}

function submitCheckout() {
    const form = document.getElementById('checkoutForm');
    
    if (!form.checkValidity()) {
        showAlert('⚠️ Perhatian!', 'Mohon lengkapi semua field yang wajib diisi (*)');
        return;
    }

    const cart = getCart();
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const province = document.getElementById('province').value.trim();
    const zipcode = document.getElementById('zipcode').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const notes = document.getElementById('notes').value.trim();

    if (!fullname || !email || !phone || !address || !city || !province || !zipcode) {
        showAlert('⚠️ Perhatian!', 'Semua field yang bertanda (*) harus diisi!');
        return;
    }

    let message = `📦 *PESANAN BUKU YASIN* 📦\n\n`;
    message += `${'='.repeat(50)}\n`;
    message += `👤 *DATA PEMBELI*\n`;
    message += `${'='.repeat(50)}\n`;
    message += `Nama: ${fullname}\n`;
    message += `Email: ${email}\n`;
    message += `No. Telp: ${phone}\n\n`;
    
    message += `${'='.repeat(50)}\n`;
    message += `📍 *ALAMAT PENGIRIMAN*\n`;
    message += `${'='.repeat(50)}\n`;
    message += `${address}\n`;
    message += `${city}, ${province} ${zipcode}\n\n`;
    
    message += `${'='.repeat(50)}\n`;
    message += `💳 *METODE PEMBAYARAN*\n`;
    message += `${'='.repeat(50)}\n`;
    message += `${payment}\n\n`;
    
    message += `${'='.repeat(50)}\n`;
    message += `📚 *DAFTAR BARANG*\n`;
    message += `${'='.repeat(50)}\n`;
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. ${item.name}\n`;
        message += `    Harga: Rp. ${item.price.toLocaleString('id-ID')}\n`;
        message += `    Jumlah: ${item.quantity}\n`;
        message += `    Subtotal: Rp. ${itemTotal.toLocaleString('id-ID')}\n\n`;
    });
    
    message += `${'='.repeat(50)}\n`;
    message += `💰 *TOTAL PEMBAYARAN*\n`;
    message += `${'='.repeat(50)}\n`;
    message += `Rp. ${total.toLocaleString('id-ID')}\n\n`;
    
    if (notes) {
        message += `${'='.repeat(50)}\n`;
        message += `📝 *CATATAN KHUSUS*\n`;
        message += `${'='.repeat(50)}\n`;
        message += `${notes}\n\n`;
    }
    
    message += `Mohon konfirmasi ketersediaan barang dan proses pembayaran.\n`;
    message += `Terima kasih telah memilih Jual Buku Yasin! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://api.whatsapp.com/send?phone=6287810860755&text=${encodedMessage}`;

    saveCart([]);
    updateCartCount();
    
    window.open(whatsappLink, '_blank');
    
    setTimeout(() => {
        showAlert('✅ Sukses!', 'Pesanan Anda telah dikirim ke WhatsApp admin.\n\nMohon tunggu konfirmasi dari kami untuk proses selanjutnya.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2500);
    }, 500);
}

// ===== 8. PRODUK PAGE FUNCTIONS =====
const products = [
    { id: 1, name: 'Buku Yasin SoftCover 64 Hal', price: 50000, category: 'softcover' },
    { id: 2, name: 'Buku Yasin SoftCover 96 Hal', price: 50000, category: 'softcover' },
    { id: 3, name: 'Buku Yasin SoftCover 128 Hal', price: 60000, category: 'softcover' },
    { id: 4, name: 'Buku Yasin SoftCover Emboss', price: 70000, category: 'softcover' },
    { id: 5, name: 'Buku Yasin HardCover 128 Hal', price: 75000, category: 'hardcover' },
    { id: 6, name: 'Buku Yasin HardCover Bludru', price: 100000, category: 'hardcover' },
    { id: 7, name: 'Buku Yasin HardCover Emboss Emas', price: 120000, category: 'hardcover' },
    { id: 8, name: 'Buku Yasin HardCover Premium', price: 150000, category: 'hardcover' }
];

let currentFilter = 'all';

function filterProducts(event, category) {
    event.preventDefault();
    currentFilter = category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayProducts();
}

function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    let filteredProducts = products;
    
    if (currentFilter !== 'all') {
        filteredProducts = products.filter(p => p.category === currentFilter);
    }

    let html = '';
    
    if (currentFilter === 'all') {
        html += '<div class="category-section">';
        html += '<h3 class="category-title">Semua Produk</h3>';
        html += '<div class="products-grid">';
        products.forEach(product => {
            html += createProductCard(product);
        });
        html += '</div></div>';
    } else {
        const categoryTitle = currentFilter === 'softcover' ? 'Buku Yasin SoftCover' : 'Buku Yasin HardCover';
        html += '<div class="category-section">';
        html += `<h3 class="category-title">${categoryTitle}</h3>`;
        html += '<div class="products-grid">';
        filteredProducts.forEach(product => {
            html += createProductCard(product);
        });
        html += '</div></div>';
    }

    container.innerHTML = html;
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image"></div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">Rp. ${product.price.toLocaleString('id-ID')}</div>
                <button class="btn btn-primary btn-small" onclick="tambahKeKeranjang(event, '${product.name.replace(/'/g, "\\'")}', ${product.price})">Pesan Sekarang</button>
            </div>
        </div>
    `;
}

// ===== 9. UPDATE ACTIVE NAV LINK =====
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== 10. ADD ANIMATIONS =====
if (!document.querySelector('style[data-app-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-app-animations', 'true');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes zoomIn {
            from {
                transform: scale(0.8);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== 11. INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded, initializing...');
    updateCartCount();
    updateActiveNav();
    
    // Load halaman spesifik
    if (window.location.pathname.includes('keranjang')) {
        loadCart();
    }
    if (window.location.pathname.includes('checkout')) {
        loadCheckoutItems();
    }
    if (window.location.pathname.includes('produk')) {
        displayProducts();
    }
});

// ===== 12. LOAD CTA & FOOTER =====
function loadCtaAndFooter() {
    // Load CTA dan Footer dari file terpisah
    fetch('includes/cta-footer.html')
        .then(response => response.text())
        .then(data => {
            // Cari placeholder untuk CTA & Footer
            let placeholder = document.getElementById('cta-footer-placeholder');
            if (!placeholder) {
                // Jika tidak ada placeholder, insert sebelum </body>
                document.body.insertAdjacentHTML('beforeend', data);
            } else {
                placeholder.innerHTML = data;
            }
            console.log('✅ CTA & Footer loaded successfully');
        })
        .catch(error => {
            console.error('Error loading CTA & Footer:', error);
        });
}

console.log('✅ All functions registered successfully');

