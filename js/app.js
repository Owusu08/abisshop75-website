document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        const result = await res.json();
        if (result.success && result.data.length > 0) {
            renderProducts(result.data);
        } else {
            renderProducts(productsData); // Fallback
        }
    } catch (e) {
        console.warn("Backend not running or offline, using fallback data.");
        renderProducts(productsData);
    }
}

function renderProducts(products) {
    const container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image_url}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p class="price">GH₵ ${parseFloat(p.price_ghs).toFixed(2)}</p>
            <button class="btn-momo" onclick="payWithMoMo(${p.id})">Pay with MoMo</button>
        </div>
    `).join('');
}

async function payWithMoMo(productId) {
    const phone = prompt("Enter your Mobile Money phone number (e.g., 024XXXXXXX):");
    if (!phone) return;

    const network = prompt("Select network code:\n'mtn' for MTN\n'vod' for Telecel\n'atl' for AT");
    if (!network) return;

    const email = prompt("Enter your email address:");
    if (!email) return;

    const name = prompt("Enter your full name:");
    if (!name) return;

    try {
        const res = await fetch('/api/checkout/momo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, phone, network, email, name })
        });

        const data = await res.json();
        if (data.success) {
            alert("Payment initiated! Please check your phone to approve the Mobile Money prompt.");
        } else {
            alert("Failed to initiate payment: " + (data.error?.message || "Please check server logs."));
        }
    } catch (err) {
        alert("Error connecting to server. Make sure node server.js is running.");
    }
}
