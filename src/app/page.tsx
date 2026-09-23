'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { products } from '@/lib/products';

type Product = (typeof products)[number];

type CartItem = {
  id: number;
  size: string;
  qty: number;
};

const visualThemes: Record<string, any> = {
  sunset: { background: 'linear-gradient(160deg, #9c6a3a 0%, #5a3d2c 28%, #261c1a 100%)', accent: '#f6d2a7' },
  cream: { background: 'linear-gradient(160deg, #d9c6a2 0%, #b77d48 26%, #4b3126 100%)', accent: '#f8efe5' },
  mocha: { background: 'linear-gradient(160deg, #583525 0%, #2f1d1a 30%, #120d0d 100%)', accent: '#d9b38c' },
  forest: { background: 'linear-gradient(160deg, #4f5d3e 0%, #2f3d2b 32%, #1c2017 100%)', accent: '#d6d7b0' },
  latte: { background: 'linear-gradient(160deg, #d9b98d 0%, #ab6b43 26%, #3d2a22 100%)', accent: '#fff3df' },
  cocoa: { background: 'linear-gradient(160deg, #8a5d3d 0%, #533a2d 30%, #252019 100%)', accent: '#f1d0a7' },
  midnight: { background: 'linear-gradient(160deg, #302f37 0%, #1a1d24 32%, #0d1016 100%)', accent: '#c5b7ff' },
  bean: { background: 'linear-gradient(160deg, #76523c 0%, #453129 30%, #1f1714 100%)', accent: '#e7c4a2' },
};

const stars = (rating: number) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(550);
  const [toast, setToast] = useState('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [modalSize, setModalSize] = useState('250g');
  const [modalQty, setModalQty] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('kaveri_cart');
      const storedWish = localStorage.getItem('kaveri_wishlist');
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWish) setWishlist(JSON.parse(storedWish));
    } catch {}
  }, []);

  useEffect(() => localStorage.setItem('kaveri_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('kaveri_wishlist', JSON.stringify(wishlist)), [wishlist]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCartOpen(false);
        setWishOpen(false);
        setSearchOpen(false);
        setActiveProduct(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const roastMatch = !selectedRoasts.length || selectedRoasts.includes(product.roast);
      const strengthMatch = !selectedStrengths.length || selectedStrengths.includes(product.strength);
      const typeMatch = !selectedTypes.length || selectedTypes.includes(product.type);
      const priceMatch = product.price <= maxPrice;
      return roastMatch && strengthMatch && typeMatch && priceMatch;
    });
  }, [selectedRoasts, selectedStrengths, selectedTypes, maxPrice]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query) ||
        product.roast.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalWishlistCount = wishlist.length;
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);

  const addToCart = (productId: number, size = '250g', qty = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === productId && item.size === size);
      if (existing) {
        return current.map((item) =>
          item.id === productId && item.size === size ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...current, { id: productId, size, qty }];
    });
  };

  const changeQty = (productId: number, size: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId && item.size === size ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (productId: number, size: string) => {
    setCart((current) => current.filter((item) => !(item.id === productId && item.size === size)));
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const toggleFilter = (value: string, setter: Dispatch<SetStateAction<string[]>>) => {
    setter((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }
      return [...current, value];
    });
  };

  const openProductModal = (product: Product) => {
    setActiveProduct(product);
    setModalSize('250g');
    setModalQty(1);
    setCartOpen(false);
    setWishOpen(false);
    setSearchOpen(false);
  };

  const closeAllPanels = () => {
    setCartOpen(false);
    setWishOpen(false);
    setSearchOpen(false);
    setActiveProduct(null);
  };

  const handleAddFromModal = () => {
    if (!activeProduct) return;
    for (let i = 0; i < modalQty; i++) {
      addToCart(activeProduct.id, modalSize);
    }
    setToast('Added to cart');
    setActiveProduct(null);
  };

  const handleBuyNow = () => {
    if (!activeProduct) return;
    for (let i = 0; i < modalQty; i++) {
      addToCart(activeProduct.id, modalSize);
    }
    setToast('Added to cart');
    setCartOpen(true);
    setActiveProduct(null);
  };

  const checkout = async () => {
    if (!cart.length) return;

    const payload = {
      items: cart.map((item) => {
        const product = products.find((p) => p.id === item.id);
        return {
          id: item.id,
          name: product?.name ?? 'Coffee',
          roast: product?.roast ?? 'Medium',
          size: item.size,
          qty: item.qty,
          price: product?.price ?? 0,
        };
      }),
    };

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setToast('Unable to start checkout');
      }
    } catch {
      setToast('Checkout service unavailable');
    }
  };

  const productCard = (product: Product) => {
    const theme = visualThemes[product.visual];
    const isWishlisted = wishlist.includes(product.id);

    return (
      <div className="card" key={product.id}>
        <div className="card-img" onClick={() => openProductModal(product)} style={{ background: theme.background }}>
          <div className="product-visual-inner" style={{ background: `radial-gradient(circle at 20% 20%, ${theme.accent} 0%, transparent 26%)` }} />
          <div className="coffee-shape coffee-shape-1" />
          <div className="coffee-shape coffee-shape-2" />
          <div className="coffee-shape coffee-shape-3" />
          <button
            className={`wish-btn ${isWishlisted ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Toggle wishlist"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 21s-7.5-4.6-10-9.3C.3 7.8 2.4 4 6.2 4c2.1 0 3.8 1.3 4.8 3 1-1.7 2.7-3 4.8-3 3.8 0 5.9 3.8 4.2 7.7C19.5 16.4 12 21 12 21z" />
            </svg>
          </button>
        </div>

        <div className="card-body">
          <div className="stars">
            {stars(product.rating)} <span>({product.reviews})</span>
          </div>
          <h3 onClick={() => openProductModal(product)}>{product.name}</h3>
          <div className="size">250g · {product.roast} Roast</div>
          <div className="card-foot">
            <span className="price">₹{product.price}</span>
            <button className="add-btn" onClick={() => addToCart(product.id)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header>
        <nav className="topbar">
          <div className="logo">Kaveri <em>Crest</em></div>

          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#collection">Shop</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#reviews">Coffee Guide</a></li>
            <li><a href="#footer">Contact</a></li>
          </ul>

          <div className="nav-icons">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg className="icon" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>

            <button className="icon-btn" onClick={() => setToast('Account & order tracking coming soon')} aria-label="Account">
              <svg className="icon" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </button>

            <button className="icon-btn" onClick={() => setWishOpen(true)} aria-label="Wishlist">
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M12 21s-7.5-4.6-10-9.3C.3 7.8 2.4 4 6.2 4c2.1 0 3.8 1.3 4.8 3 1-1.7 2.7-3 4.8-3 3.8 0 5.9 3.8 4.2 7.7C19.5 16.4 12 21 12 21z" />
              </svg>
              {totalWishlistCount > 0 && <span className="badge">{totalWishlistCount}</span>}
            </button>

            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
              <svg className="icon" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M1 1h3l2.4 13.4a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L22 6H6" />
              </svg>
              {totalCartCount > 0 && <span className="badge">{totalCartCount}</span>}
            </button>
          </div>

          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen((prev) => !prev)} aria-label="Toggle menu">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#collection" onClick={() => setMobileMenuOpen(false)}>Shop</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>Coffee Guide</a>
            <a href="#footer" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </div>
        )}
      </header>

      <main>
        <section className="hero" id="home">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">100% Arabica &amp; Robusta · Freshly Roasted</span>
              <h1>Rich Aroma. Bold Taste. Perfectly Brewed.</h1>
              <p>
                Premium coffee powder made from carefully selected and freshly roasted beans — crafted for coffee lovers who notice the difference.
              </p>
              <div className="hero-cta-a">
                <a href="#collection" className="btn btn-primary">Shop Now</a>
                <a href="#collection" className="btn btn-outline">Explore Our Coffee</a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-ring" />
            </div>
          </div>
        </section>

        <section id="featured">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Bestsellers</span>
              <h2>Featured Products</h2>
              <p>The four blends our customers reorder the most.</p>
            </div>

            <div className="grid-4">
              {products.slice(0, 4).map(productCard)}
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--beige)' }}>
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">The Kaveri Crest Promise</span>
              <h2>Why Choose Us</h2>
            </div>

            <div className="why-grid">
              <div className="why-card">
                <div className="why-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 3h16l-1.5 9a5 5 0 0 1-5 4h-3a5 5 0 0 1-5-4L4 3z" />
                    <path d="M9 20h6" />
                  </svg>
                </div>
                <h3>100% Premium Beans</h3>
                <p>Sourced from selected estates and hand-checked before roasting.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1 0 10 10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3>Freshly Roasted</h3>
                <p>Roasted in small batches and ground close to your order date.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21c4-4 7-7.5 7-11a7 7 0 1 0-14 0c0 3.5 3 7 7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>
                <h3>Authentic Aroma &amp; Taste</h3>
                <p>No fillers, no shortcuts — just coffee the way it should taste.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 12h13l-3-3m3 3-3 3" />
                    <path d="M16 5h2l3 4v6h-3" />
                    <circle cx="7" cy="18" r="1.6" />
                    <circle cx="18" cy="18" r="1.6" />
                  </svg>
                </div>
                <h3>Fast Delivery</h3>
                <p>Dispatched within 48 hours, delivered across India.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="wrap about">
            <div className="about-visual" />
            <div>
              <span className="eyebrow">Our Story</span>
              <h2>Handcrafted by people who actually drink it</h2>
              <p>
                Kaveri Crest started with a simple frustration — most “premium” coffee powder on the shelf tasted the same. So we went straight to the growers, picked estates by taste rather than volume, and roasted small batches ourselves until it tasted like something worth waking up for.
              </p>
              <p>
                Every pack you open today was roasted, ground, and sealed within days of shipping — not months.
              </p>
            </div>
          </div>
        </section>

        <section id="collection" style={{ background: 'var(--beige)' }}>
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Full Range</span>
              <h2>Coffee Collection</h2>
              <p>Filter by roast, strength, type, or price to find your everyday cup.</p>
            </div>

            <div className="collection-layout">
              <aside className="filters">
                <div className="filter-group">
                  <h4>Roast Level</h4>
                  {['Light', 'Medium', 'Dark'].map((roast) => (
                    <label key={roast}>
                      <input
                        type="checkbox"
                        checked={selectedRoasts.includes(roast)}
                        onChange={() => toggleFilter(roast, setSelectedRoasts)}
                      />
                      {roast} Roast
                    </label>
                  ))}
                </div>

                <div className="filter-group">
                  <h4>Strength</h4>
                  {['Mild', 'Medium', 'Strong'].map((strength) => (
                    <label key={strength}>
                      <input
                        type="checkbox"
                        checked={selectedStrengths.includes(strength)}
                        onChange={() => toggleFilter(strength, setSelectedStrengths)}
                      />
                      {strength}
                    </label>
                  ))}
                </div>

                <div className="filter-group">
                  <h4>Type</h4>
                  {['Filter Coffee', 'Arabica', 'Blend', 'Single Origin'].map((type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleFilter(type, setSelectedTypes)}
                      />
                      {type}
                    </label>
                  ))}
                </div>

                <div className="filter-group">
                  <h4>Max Price: ₹{maxPrice}</h4>
                  <input
                    type="range"
                    min={250}
                    max={550}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="price-range"
                  />
                </div>
              </aside>

              <div>
                <div className="grid-3">{filteredProducts.map(productCard)}</div>
                {filteredProducts.length === 0 && (
                  <p className="empty-msg">No coffee matches those filters — try clearing one.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="reviews">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Loved By Many</span>
              <h2>Customer Reviews</h2>
            </div>

            <div className="review-grid">
              <div className="review-card">
                <div className="stars">★★★★★</div>
                <p>“Tastes exactly like the filter coffee from my hometown. The Strong South Indian Blend is now a staple in our kitchen.”</p>
                <div className="reviewer">
                  <div className="avatar">R</div>
                  <div>
                    <div className="name">Ramesh Iyer</div>
                    <div className="loc">Chennai</div>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="stars">★★★★★</div>
                <p>“You can actually smell the freshness when you open the pack. The Premium Arabica is smooth even without sugar.”</p>
                <div className="reviewer">
                  <div className="avatar">S</div>
                  <div>
                    <div className="name">Sneha Kulkarni</div>
                    <div className="loc">Pune</div>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="stars">★★★★☆</div>
                <p>“Ordered the Dark Roast on a whim, ended up subscribing. Packaging keeps it fresh for weeks.”</p>
                <div className="reviewer">
                  <div className="avatar">A</div>
                  <div>
                    <div className="name">Arjun Mehta</div>
                    <div className="loc">Bengaluru</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="newsletter">
              <h2>Get 10% Off Your First Order</h2>
              <p>Join our list for brewing tips, new roasts, and subscriber-only discounts.</p>
              <form
                className="nl-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setToast('10% off code sent to your email');
                  e.currentTarget.reset();
                }}
              >
                <input type="email" placeholder="Enter your email" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="logo">Kaveri <em>Crest</em></div>
              <p style={{ marginTop: 14 }}>
                Premium, freshly roasted coffee powder, handcrafted in small batches for everyday coffee lovers across India.
              </p>
              <div className="social">
                <a href="#" aria-label="Instagram">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" />
                  </svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg viewBox="0 0 24 24">
                    <path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V9a1 1 0 0 1 1-1z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4>Quick Links</h4>
              <ul className="foot-list">
                <li><a href="#home">Home</a></li>
                <li><a href="#collection">Shop</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#reviews">Reviews</a></li>
              </ul>
            </div>

            <div>
              <h4>Support</h4>
              <ul className="foot-list">
                <li><a href="#" onClick={() => setToast('Support chat coming soon')}>Customer Support</a></li>
                <li><a href="#" onClick={() => setToast('Shipping info coming soon')}>Shipping &amp; Returns</a></li>
                <li><a href="#">Order Tracking</a></li>
              </ul>
            </div>

            <div>
              <h4>Legal</h4>
              <ul className="foot-list">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms &amp; Conditions</a></li>
              </ul>
            </div>
          </div>

          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} Kaveri Crest Coffee Co., India</span>
            <span>Made with care, one roast at a time.</span>
          </div>
        </div>
      </footer>

      <aside className={`drawer ${cartOpen ? 'active' : ''}`} aria-label="Cart drawer">
        <div className="drawer-head">
          <h3>Your Cart</h3>
          <button className="close-btn" onClick={() => setCartOpen(false)}>&times;</button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              Your cart is empty.<br />Add a coffee you love.
            </div>
          ) : (
            cart.map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;

              return (
                <div className="cart-item" key={`${item.id}-${item.size}`}>
                  <div className="cart-thumb" />
                  <div style={{ flex: 1 }}>
                    <h4>{product.name}</h4>
                    <div className="meta">{item.size}</div>
                    <div className="qty-ctrl">
                      <button onClick={() => changeQty(item.id, item.size, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => changeQty(item.id, item.size, 1)}>+</button>
                      <button className="remove-x" onClick={() => removeItem(item.id, item.size)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-foot">
            <div className="promo-row">
              <input type="text" placeholder="Promo code" />
              <button onClick={() => setToast('Promo code applied at checkout')}>Apply</button>
            </div>
            <div className="subtotal-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={checkout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>

      <aside className={`drawer ${wishOpen ? 'active' : ''}`} aria-label="Wishlist drawer">
        <div className="drawer-head">
          <h3>Your Wishlist</h3>
          <button className="close-btn" onClick={() => setWishOpen(false)}>&times;</button>
        </div>

        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div className="empty-cart">No favourites yet. Tap the heart on any coffee.</div>
          ) : (
            wishlist.map((id) => {
              const product = products.find((p) => p.id === id);
              if (!product) return null;
              return (
                <div className="cart-item" key={product.id}>
                  <div className="cart-thumb" onClick={() => openProductModal(product)} style={{ cursor: 'pointer' }} />
                  <div style={{ flex: 1 }}>
                    <h4>{product.name}</h4>
                    <div className="meta">₹{product.price} · 250g</div>
                    <div className="qty-ctrl">
                      <button className="add-btn" style={{ padding: '6px 12px' }} onClick={() => addToCart(product.id)}>
                        Add to Cart
                      </button>
                      <button className="remove-x" onClick={() => toggleWishlist(product.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      <div className={`search-overlay ${searchOpen ? 'active' : ''}`}>
        <div className="search-box">
          <svg className="icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Classic Filter Coffee, Arabica, Dark Roast…"
          />
          <button className="close-btn" onClick={() => setSearchOpen(false)}>&times;</button>
        </div>

        <div className="search-results">
          {searchResults.map((product) => (
            <div className="sr-item" key={product.id} onClick={() => { setSearchOpen(false); openProductModal(product); }}>
              <div className="sr-thumb" />
              <div>
                <h5>{product.name}</h5>
                <div className="p">₹{product.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeProduct && (
        <div className="pmodal">
          <div className="pmodal-card">
            <div className="pmodal-img" style={{ background: visualThemes[activeProduct.visual].background }} />
            <div className="pmodal-body">
              <button className="close-btn" onClick={() => setActiveProduct(null)}>&times;</button>

              <div className="stars">
                {stars(activeProduct.rating)} <span>({activeProduct.reviews} reviews)</span>
              </div>

              <h2>{activeProduct.name}</h2>
              <div className="price">₹{activeProduct.price}</div>

              <div className="badge-row">
                <span className="tag">{activeProduct.roast} Roast</span>
                <span className="tag">{activeProduct.strength}</span>
                <span className="tag">{activeProduct.type}</span>
              </div>

              <h5>Size</h5>
              <div className="size-row">
                {['100g', '250g', '500g', '1kg'].map((size) => (
                  <button
                    key={size}
                    className={`size-opt ${modalSize === size ? 'active' : ''}`}
                    onClick={() => setModalSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <h5>Description</h5>
              <p className="desc">{activeProduct.desc}</p>

              <h5>Ingredients</h5>
              <p className="desc">{activeProduct.ingredients}</p>

              <h5>Brewing Instructions</h5>
              <p className="desc">{activeProduct.brew}</p>

              <div className="pmodal-actions">
                <div className="qty-box">
                  <button onClick={() => setModalQty((prev) => Math.max(1, prev - 1))}>−</button>
                  <span>{modalQty}</span>
                  <button onClick={() => setModalQty((prev) => prev + 1)}>+</button>
                </div>

                <button className="btn btn-primary" onClick={handleAddFromModal}>Add to Cart</button>
                <button className="btn btn-gold" onClick={handleBuyNow}>Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(cartOpen || wishOpen || searchOpen || activeProduct) && (
        <div className="overlay-bg active" onClick={closeAllPanels} />
      )}

      {toast && <div className="toast active">{toast}</div>}

      <style jsx global>{`
        :root {
          --brown: #2f4034;
          --brown-2: #4a5d4f;
          --cream: #f1f4f1;
          --beige: #e3e9e2;
          --gold: #8fa394;
          --ink: #1e2a22;
          --muted: #6e7a70;
          --line: rgba(47, 64, 52, 0.14);
          --white: #fbfdfb;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; scroll-padding-top: 76px; }
        body {
          font-family: 'Jost', sans-serif;
          background: radial-gradient(circle at top left, rgba(143, 163, 148, 0.18), transparent 30%), linear-gradient(180deg, #f5f7f4 0%, #f1f4f1 100%);
          color: var(--ink);
          line-height: 1.6;
          overflow-x: hidden;
        }
        a { color: inherit; text-decoration: none; }
        button, input { font: inherit; }
        img, svg { display: block; }
        h1, h2, h3 { font-family: 'Playfair Display', serif; font-weight: 600; letter-spacing: -0.01em; }

        .wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .topbar { max-width: 1200px; margin: 0 auto; padding: 18px 32px; display: flex; align-items: center; justify-content: space-between; }
        header { position: sticky; top: 0; z-index: 80; background: rgba(241, 244, 241, 0.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); box-shadow: 0 10px 24px rgba(47, 64, 52, 0.04); }
        .logo { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 1.5rem; color: var(--brown); letter-spacing: -0.04em; }
        .logo em { color: var(--gold); font-style: italic; text-shadow: 0 0 18px rgba(143, 163, 148, 0.18); }
        .nav-links { list-style: none; display: flex; gap: 32px; }
        .nav-links a { color: var(--brown); font-size: 0.94rem; }
        .nav-links a:hover { color: var(--gold); }
        .nav-icons { display: flex; align-items: center; gap: 18px; }
        .icon-btn { position: relative; background: none; border: none; padding: 4px; cursor: pointer; }
        .badge { position: absolute; top: -4px; right: -6px; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--gold); color: var(--white); font-size: 0.62rem; font-weight: 600; }
        .icon { width: 20px; height: 20px; stroke: var(--brown); fill: none; stroke-width: 1.8; }
        .mobile-menu-toggle { display: none; border: 1px solid var(--line); border-radius: 50%; width: 38px; height: 38px; background: var(--white); align-items: center; justify-content: center; cursor: pointer; }
        .mobile-menu { display: none; flex-direction: column; gap: 18px; padding: 18px 24px 22px; border-top: 1px solid var(--line); background: rgba(241, 244, 241, 0.98); }
        .mobile-menu a { color: var(--brown); font-size: 0.95rem; }
        .hero { padding: 80px 0 90px; position: relative; }
        .hero::before { content: ''; position: absolute; left: 8%; top: 10%; width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(circle, rgba(143, 163, 148, 0.16), transparent 68%); filter: blur(10px); pointer-events: none; }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: center; position: relative; z-index: 1; }
        .eyebrow { color: var(--gold); font-size: 0.88rem; display: block; margin-bottom: 18px; }
        .hero h1 { font-size: clamp(2.4rem, 5vw, 3.6rem); line-height: 1.1; max-width: 12ch; color: var(--brown); }
        .hero p { color: var(--muted); max-width: 36ch; margin: 22px 0 32px; font-size: 1.05rem; }
        .hero-cta-a { display: flex; align-items: center; flex-wrap: wrap; gap: 14px; }
        .btn { display: inline-block; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-size: 0.92rem; font-weight: 500; border: 1px solid transparent; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease; }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: var(--brown); color: var(--white); box-shadow: 0 8px 20px rgba(59, 36, 23, 0.25); }
        .btn-primary:hover { box-shadow: 0 12px 26px rgba(59, 36, 23, 0.32); }
        .btn-outline { border-color: var(--brown); color: var(--brown); }
        .btn-gold { background: var(--gold); color: var(--white); box-shadow: 0 10px 24px rgba(47, 64, 52, 0.14); }
        .hero-visual { aspect-ratio: 1 / 1; border-radius: 50%; position: relative; background: radial-gradient(circle at 32% 28%, #5a7360 0%, #33453a 55%, #1b2620 100%); box-shadow: 0 30px 60px rgba(59, 36, 23, 0.3); overflow: hidden; border: 1px solid rgba(255,255,255,0.12); }
        .hero-visual::before { content: ''; position: absolute; inset: 14%; border-radius: 50%; background: repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0 2px, transparent 2px 10px); }
        .hero-visual::after { content: ''; position: absolute; inset: 12% 14%; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 40%); border: 1px solid rgba(255,255,255,0.12); }
        .hero-ring { position: absolute; inset: -20px; border: 1.5px dashed rgba(185, 141, 62, 0.7); border-radius: 50%; box-shadow: 0 0 0 18px rgba(143, 163, 148, 0.04); }
        section { padding: 90px 0; }
        .section-head { text-align: center; max-width: 560px; margin: 0 auto 56px; }
        .section-head h2 { font-size: clamp(1.8rem, 3vw, 2.4rem); color: var(--brown); margin-top: 8px; position: relative; display: inline-block; }
        .section-head h2::after { content: ''; position: absolute; left: 50%; bottom: -10px; transform: translateX(-50%); width: 74px; height: 3px; border-radius: 999px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .section-head p { color: var(--muted); margin-top: 12px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 26px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
        .card { background: var(--white); border-radius: 18px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 12px 24px rgba(47, 64, 52, 0.04); transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(47, 64, 52, 0.12); }
        .card-img { aspect-ratio: 1 / 1; position: relative; border-bottom: 1px solid var(--line); overflow: hidden; cursor: pointer; }
        .product-visual-inner { position: absolute; inset: 0; opacity: 0.6; filter: blur(10px); transform: scale(1.15); }
        .coffee-shape { position: absolute; border-radius: 50%; z-index: 1; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1); }
        .coffee-shape-1 { width: 120px; height: 120px; right: 24px; bottom: 18px; background: rgba(23, 17, 15, 0.38); }
        .coffee-shape-2 { width: 78px; height: 78px; left: 28px; bottom: 34px; background: rgba(255,255,255,0.08); }
        .coffee-shape-3 { width: 150px; height: 150px; left: 50%; top: 16%; transform: translateX(-50%); background: rgba(255,255,255,0.09); }
        .wish-btn { position: absolute; top: 12px; right: 12px; z-index: 2; width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(47, 64, 52, 0.08); background: rgba(255, 253, 249, 0.9); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 16px rgba(47, 64, 52, 0.08); }
        .wish-btn svg { width: 16px; height: 16px; stroke: var(--brown); fill: none; transition: fill 0.2s ease, stroke 0.2s ease; }
        .wish-btn.active svg { fill: var(--gold); stroke: var(--gold); }
        .card-body { padding: 20px; }
        .stars { color: var(--gold); font-size: 0.85rem; margin-bottom: 6px; }
        .stars span { color: var(--muted); }
        .card h3 { font-family: 'Jost', sans-serif; font-weight: 600; font-size: 1rem; cursor: pointer; }
        .size { color: var(--muted); font-size: 0.85rem; margin: 4px 0 10px; }
        .card-foot { display: flex; align-items: center; justify-content: space-between; }
        .price { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: var(--brown); letter-spacing: -0.02em; }
        .add-btn { border: none; border-radius: 20px; padding: 9px 16px; background: var(--beige); color: var(--brown); font-weight: 500; cursor: pointer; }
        .add-btn:hover { background: var(--gold); color: var(--white); box-shadow: 0 8px 20px rgba(143, 163, 148, 0.34); }
        .why-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px; }
        .why-card { text-align: center; padding: 34px 20px; background: var(--white); border-radius: 16px; border: 1px solid var(--line); box-shadow: 0 8px 18px rgba(47, 64, 52, 0.03); }
        .why-icon { width: 54px; height: 54px; border-radius: 50%; background: var(--beige); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; }
        .why-icon svg { width: 24px; height: 24px; stroke: var(--brown); fill: none; stroke-width: 1.6; }
        .about { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 64px; align-items: center; }
        .about-visual { aspect-ratio: 4 / 5; border-radius: 16px; position: relative; overflow: hidden; background: linear-gradient(160deg, #6b8577, #243a2d 75%); }
        .about-visual::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(100deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 26px); }
        .collection-layout { display: grid; grid-template-columns: 240px 1fr; gap: 44px; }
        .filters { border-right: 1px solid var(--line); padding-right: 30px; }
        .filter-group { margin-bottom: 30px; }
        .filter-group h4 { font-size: 0.92rem; margin-bottom: 14px; color: var(--brown); }
        .filter-group label { display: flex; align-items: center; gap: 9px; font-size: 0.88rem; color: var(--muted); margin-bottom: 10px; cursor: pointer; }
        .filter-group input { accent-color: var(--gold); }
        .price-range { width: 100%; accent-color: var(--gold); }
        .review-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
        .review-card { background: var(--white); border: 1px solid var(--line); border-radius: 16px; padding: 28px; box-shadow: 0 12px 26px rgba(47, 64, 52, 0.04); }
        .review-card .stars { margin-bottom: 14px; }
        .review-card p { color: var(--ink); font-size: 0.95rem; margin-bottom: 18px; }
        .reviewer { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--beige); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 0.9rem; color: var(--brown); }
        .name { font-size: 0.9rem; font-weight: 500; }
        .loc { font-size: 0.78rem; color: var(--muted); }
        .newsletter { background: var(--brown); border-radius: 20px; padding: 60px; text-align: center; color: var(--white); position: relative; overflow: hidden; }
        .newsletter::before { content: ''; position: absolute; right: -70px; bottom: -70px; width: 220px; height: 220px; background: radial-gradient(circle, rgba(143, 163, 148, 0.28), transparent 65%); pointer-events: none; }
        .newsletter h2 { color: var(--white); font-size: clamp(1.6rem, 3vw, 2.2rem); margin-bottom: 10px; }
        .newsletter p { color: #cbd8ce; margin-bottom: 28px; }
        .nl-form { display: flex; align-items: center; gap: 10px; max-width: 440px; margin: 0 auto; position: relative; z-index: 1; }
        .nl-form input { flex: 1; padding: 14px 18px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; background: transparent; color: var(--white); }
        .nl-form input::placeholder { color: #b7c6bb; }
        .nl-form button { border: none; padding: 14px 26px; border-radius: 30px; background: var(--gold); color: var(--white); cursor: pointer; }
        footer { background: var(--ink); color: #cbd8ce; padding: 70px 0 30px; position: relative; overflow: hidden; }
        .foot-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 50px; }
        footer h4 { color: var(--white); font-family: 'Playfair Display', serif; font-size: 1.05rem; margin-bottom: 18px; }
        footer .logo { color: var(--white); }
        footer p { font-size: 0.88rem; color: #9fb0a4; max-width: 32ch; }
        .foot-list { list-style: none; }
        .foot-list li { margin-bottom: 11px; font-size: 0.88rem; }
        .foot-list a { color: #b7c6bb; position: relative; display: inline-block; }
        .foot-list a::after { content: ''; position: absolute; left: 0; bottom: -3px; width: 0; height: 1px; background: var(--gold); transition: width 0.2s ease; }
        .foot-list a:hover { color: var(--gold); }
        .foot-list a:hover::after { width: 100%; }
        .social { display: flex; gap: 14px; margin-top: 16px; }
        .social a { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #3e4f44; display: flex; align-items: center; justify-content: center; }
        .social svg { width: 15px; height: 15px; stroke: #cbd8ce; fill: none; }
        .foot-bottom { border-top: 1px solid #2b3a31; padding-top: 24px; display: flex; justify-content: space-between; gap: 12px; font-size: 0.8rem; color: #8c9c90; }
        .drawer { position: fixed; top: 0; right: -420px; width: 400px; max-width: 92vw; height: 100dvh; background: var(--white); z-index: 95; transition: right 0.35s ease; display: flex; flex-direction: column; box-shadow: -18px 0 46px rgba(35, 24, 12, 0.08); }
        .drawer.active { right: 0; }
        .drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 22px 24px; border-bottom: 1px solid var(--line); }
        .drawer-head h3 { font-size: 1.1rem; color: var(--brown); }
        .close-btn { background: none; border: none; font-size: 1.3rem; color: var(--brown); cursor: pointer; }
        .drawer-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
        .cart-item { display: flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--line); }
        .cart-thumb { width: 64px; height: 64px; border-radius: 10px; background: linear-gradient(155deg, #4a5d4f, #243a2d); flex-shrink: 0; }
        .cart-item h4 { font-size: 0.94rem; margin-bottom: 4px; }
        .cart-item .meta { font-size: 0.8rem; color: var(--muted); margin-bottom: 8px; }
        .qty-ctrl { display: flex; align-items: center; gap: 10px; }
        .qty-ctrl button { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--line); background: var(--white); font-size: 0.9rem; cursor: pointer; }
        .remove-x { margin-left: auto; background: none; border: none; color: var(--muted); font-size: 0.78rem; text-decoration: underline; cursor: pointer; }
        .drawer-foot { padding: 20px 24px; border-top: 1px solid var(--line); }
        .promo-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .promo-row input { flex: 1; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; font: inherit; }
        .promo-row button { border: none; border-radius: 8px; background: var(--beige); color: var(--brown); padding: 0 14px; cursor: pointer; }
        .subtotal-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 1rem; color: var(--brown); font-weight: 500; }
        .empty-cart { color: var(--muted); text-align: center; padding: 60px 0; font-size: 0.9rem; }
        .search-overlay { position: fixed; top: 0; left: 0; right: 0; z-index: 95; background: var(--cream); transform: translateY(-100%); transition: transform 0.3s ease; box-shadow: 0 14px 34px rgba(47, 64, 52, 0.06); }
        .search-overlay.active { transform: translateY(0); }
        .search-box { max-width: 1200px; margin: 0 auto; padding: 20px 32px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--line); }
        .search-box input { flex: 1; border: none; background: none; font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--brown); outline: none; }
        .search-box input::placeholder { color: var(--muted); }
        .search-results { max-width: 1200px; margin: 0 auto; padding: 20px 32px 40px; display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; }
        .sr-item { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 10px; cursor: pointer; }
        .sr-item:hover { background: var(--beige); }
        .sr-thumb { width: 44px; height: 44px; border-radius: 8px; background: linear-gradient(155deg, #4a5d4f, #243a2d); flex-shrink: 0; }
        .sr-item h5 { font-size: 0.88rem; }
        .sr-item .p { font-size: 0.8rem; color: var(--muted); }
        .pmodal { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 96; padding: 20px; }
        .pmodal-card { background: var(--white); border-radius: 20px; width: 100%; max-width: 920px; max-height: 88vh; overflow: auto; display: grid; grid-template-columns: 1fr 1fr; box-shadow: 0 32px 90px rgba(31, 30, 27, 0.22); }
        .pmodal-img { aspect-ratio: 1 / 1; border-radius: 20px 0 0 20px; position: relative; }
        .pmodal-body { padding: 34px; position: relative; }
        .pmodal-body .close-btn { position: absolute; top: 18px; right: 18px; }
        .pmodal-body h2 { color: var(--brown); font-size: 1.5rem; margin-bottom: 8px; }
        .pmodal-body .price { font-size: 1.3rem; margin-bottom: 14px; }
        .badge-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .tag { background: var(--beige); color: var(--brown); font-size: 0.76rem; padding: 5px 12px; border-radius: 20px; }
        .size-row { display: flex; gap: 10px; flex-wrap: wrap; margin: 16px 0; }
        .size-opt { border: 1px solid var(--line); border-radius: 8px; padding: 8px 14px; background: var(--white); cursor: pointer; }
        .size-opt.active { border-color: var(--gold); background: linear-gradient(180deg, rgba(143, 163, 148, 0.2), rgba(143, 163, 148, 0.08)); }
        .pmodal-body h5 { font-size: 0.86rem; color: var(--brown); margin: 18px 0 6px; }
        .pmodal-body .desc { color: var(--muted); font-size: 0.9rem; }
        .pmodal-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 22px; }
        .qty-box { display: flex; align-items: center; border: 1px solid var(--line); border-radius: 30px; overflow: hidden; }
        .qty-box button { width: 34px; height: 38px; border: none; background: none; cursor: pointer; }
        .qty-box span { width: 28px; text-align: center; font-size: 0.9rem; }
        .overlay-bg { position: fixed; inset: 0; background: rgba(42, 27, 16, 0.5); z-index: 90; backdrop-filter: blur(2px); }
        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--brown); color: var(--white); padding: 13px 24px; border-radius: 30px; font-size: 0.88rem; opacity: 0; pointer-events: none; transition: all 0.3s ease; z-index: 99; box-shadow: 0 18px 36px rgba(25, 31, 29, 0.22); }
        .toast.active { opacity: 1; transform: translateX(-50%) translateY(0); }
        button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .mobile-menu-toggle { display: inline-flex; }
          .mobile-menu { display: flex; }
          .hero-grid, .about, .collection-layout { grid-template-columns: 1fr; }
          .grid-4, .grid-3, .why-grid, .review-grid, .foot-grid, .search-results { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .filters { border-right: none; border-bottom: 1px solid var(--line); padding-right: 0; padding-bottom: 20px; }
          .pmodal-card { grid-template-columns: 1fr; }
          .pmodal-img { border-radius: 20px 20px 0 0; aspect-ratio: 16 / 9; }
        }

        @media (max-width: 520px) {
          .grid-4, .grid-3, .why-grid, .review-grid, .foot-grid, .search-results { grid-template-columns: 1fr; }
          .topbar { padding: 16px 18px; }
          .hero { padding-top: 60px; }
          .hero h1 { max-width: 10ch; }
          .hero-cta-a { display: flex; flex-wrap: wrap; gap: 12px; }
          .btn-outline { margin-left: 0; }
          .newsletter { padding: 42px 20px; }
          .nl-form { flex-direction: column; }
          .drawer { width: 100vw; max-width: 100vw; }
        }
      `}</style>
    </>
  );
}
