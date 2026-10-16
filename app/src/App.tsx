import { useEffect, useReducer, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Backpack,
  Compass,
  ArrowDownUp,
  Globe2,
  Headphones,
  Menu,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Watch,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { products, type CategoryId, type Product } from '@/data/products'
import { cartReducer, loadSavedCart, saveCart } from '@/state/cart'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import './App.css'

type Locale = 'en' | 'zh'

function readSavedLocale(): Locale {
  try {
    return window.localStorage.getItem('wayfarer-supply-locale') === 'zh' ? 'zh' : 'en'
  } catch {
    return 'en'
  }
}

const copy = {
  en: {
    announcement: 'COMPLIMENTARY SHIPPING ON ORDERS OVER $75',
    nav: ['Bags', 'Travel', 'Tech', 'Drinkware', 'Everyday'],
    search: 'Search the field kit…',
    explore: 'Explore the collection',
    edition: 'FIELD NOTES / ISSUE 001',
    heroEyebrow: 'A BETTER WAY OUT THERE',
    heroTitle: ['Gear up.', 'Break out.'],
    heroBody: 'Thoughtful essentials for the miles ahead. Find your next favorite, wherever the day takes you.',
    shopNow: 'Shop all gear',
    discover: 'Scroll to discover',
    orbit: 'MADE TO MOVE',
    portal: 'Five portals. One good trip.',
    categoryTitle: 'Choose your portal.',
    categoryBody: 'The right gear changes everything. Start somewhere unexpected.',
    categories: ['Bags', 'Travel', 'Tech', 'Drinkware', 'Everyday carry'],
    categorySub: ['Carry more. Feel less.', 'Pack light, go far.', 'Stay connected out there.', 'A better daily pour.', 'Small things, big miles.'],
    collection: 'THE FIELD KIT',
    upcoming: 'Your next favorite is around the corner.',
    upcomingBody: 'Explore 5 collections of gear, built for wherever you’re headed.',
    exploreLine: 'Browse the collection',
    footer: 'A little further, every day.',
    footerNote: 'Independent essentials for the open road.',
    language: 'Language',
    catalogTitle: 'Selected gear.',
    catalogKicker: 'THE EVERYDAY EXPLORER EDIT',
    allGear: 'All gear',
    resultLabel: 'pieces of good gear',
    sortLabel: 'Featured',
    reviewsLabel: 'reviews',
    viewDetails: 'Quick look',
    noResults: 'No gear found on this route.',
    noResultsHint: 'Try another search or reset your filters.',
    resetFilters: 'Clear filters',
    addToBag: 'Add to bag',
    inTheBag: 'In your bag',
    quantity: 'Quantity',
    details: 'A closer look',
    cartTitle: 'Your field kit',
    cartEmpty: 'Your bag is taking the scenic route.',
    cartEmptyHint: 'Find something useful for the miles ahead.',
    continueShopping: 'Explore the gear',
    subtotal: 'Subtotal',
    demoCheckout: 'Checkout is not enabled in this demo.',
    remove: 'Remove',
    added: 'Added to your bag',
  },
  zh: {
    announcement: '订单满 US$75 即享免费配送',
    nav: ['包袋', '旅行', '科技', '饮具', '日常'],
    search: '搜索出发装备…',
    explore: '探索精选装备',
    edition: '旅途手记 / 001 期',
    heroEyebrow: '让每一程都更自在',
    heroTitle: ['装备就位，', '跃迁出发。'],
    heroBody: '为下一段路认真挑选的日常好物。无论今天去向何处，都能找到心仪装备。',
    shopNow: '探索全部装备',
    discover: '向下探索',
    orbit: '为出发而造',
    portal: '五个入口，一场好旅程。',
    categoryTitle: '选择你的目的地。',
    categoryBody: '合适的装备，让旅程大不一样。从意想不到的地方开始。',
    categories: ['包袋', '旅行收纳', '科技配件', '饮具', '日常随身'],
    categorySub: ['轻装多带一点。', '轻轻打包，走得更远。', '一路保持连接。', '每天都值得一杯好水。', '小物件，大旅程。'],
    collection: '出发装备精选',
    upcoming: '下一件心仪好物，即将抵达。',
    upcomingBody: '探索五大装备系列，为即将开启的旅程做好准备。',
    exploreLine: '浏览全部系列',
    footer: '每天，都再走远一点。',
    footerNote: '为自在旅途挑选的独立好物。',
    language: '语言',
    catalogTitle: '精选装备。',
    catalogKicker: '为日常探索者精选',
    allGear: '全部装备',
    resultLabel: '件精选装备',
    sortLabel: '精选排序',
    reviewsLabel: '条评价',
    viewDetails: '快速查看',
    noResults: '这条路线暂时没有找到装备。',
    noResultsHint: '试试其他搜索词，或清除筛选条件。',
    resetFilters: '清除筛选',
    addToBag: '加入购物袋',
    inTheBag: '已在购物袋中',
    quantity: '数量',
    details: '商品详情',
    cartTitle: '你的出发装备',
    cartEmpty: '购物袋还在路上。',
    cartEmptyHint: '挑一件适合下一段旅程的好物吧。',
    continueShopping: '继续探索装备',
    subtotal: '商品小计',
    demoCheckout: '此演示暂不支持结账。',
    remove: '移除',
    added: '已加入购物袋',
  },
} satisfies Record<Locale, Record<string, string | string[]>>

const categoryIcons = [Backpack, Compass, Headphones, AudioLines, Watch]
const categoryColors = ['violet', 'cyan', 'pink', 'lime', 'blue']

function App() {
  const [locale, setLocale] = useState<Locale>(readSavedLocale)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [cart, dispatch] = useReducer(cartReducer, null, loadSavedCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailQuantity, setDetailQuantity] = useState(1)
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all')
  const [query, setQuery] = useState('')
  const t = copy[locale]

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
    try {
      window.localStorage.setItem('wayfarer-supply-locale', locale)
    } catch {
      // Keep the selected language for this session when storage is unavailable.
    }
  }, [locale])

  useEffect(() => saveCart(cart), [cart])

  const toggleLocale = () => setLocale((current) => (current === 'en' ? 'zh' : 'en'))
  const categories: Array<CategoryId | 'all'> = ['all', 'bags', 'travel', 'tech', 'drinkware', 'everyday']
  const categoryLabels = [t.allGear, ...(t.categories as string[])]
  const visibleProducts = products.filter((product) => {
    const text = `${product.name[locale]} ${product.description[locale]} ${product.name.en} ${product.description.en}`.toLocaleLowerCase()
    return (activeCategory === 'all' || product.category === activeCategory) && text.includes(query.trim().toLocaleLowerCase())
  })
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
  const formatPrice = (value: number) => new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'zh-CN', { style: 'currency', currency: 'USD' }).format(value)
  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: 'add', product, quantity })
    toast.success(`${product.name[locale]} — ${t.added}`)
    setSelectedProduct(null)
  }

  return (
    <main className="storefront">
      <div className="announcement"><Sparkles size={12} />{t.announcement}<Sparkles size={12} /></div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Wayfarer Supply home">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">WAYFARER<span>SUPPLY</span></span>
        </a>
        <nav className={`main-nav ${mobileMenu ? 'is-open' : ''}`} aria-label="Main navigation">
          {t.nav.map((item, index) => <a href="#collection" key={item} onClick={() => { setActiveCategory(categories[index + 1]); setMobileMenu(false) }}>{item}<span>0{index + 1}</span></a>)}
        </nav>
        <div className="header-actions">
          <label className="header-search"><Search size={15} /><Input aria-label={t.search} placeholder={t.search} value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <Button className="locale-toggle" variant="ghost" onClick={toggleLocale} aria-label={`${t.language}: ${locale === 'en' ? 'English' : '中文'}`}>
            <Globe2 size={15} /><span>{locale === 'en' ? 'EN' : '中文'}</span><span className="locale-caret">⌄</span>
          </Button>
          <Button className="cart-trigger" variant="outline" aria-label={`${locale === 'en' ? 'Shopping bag' : '购物袋'}，${cartCount}`} onClick={() => setCartOpen(true)}>
            <ShoppingBag size={17} /><span className="cart-label">{locale === 'en' ? 'Bag' : '购物袋'}</span><span className="cart-count">{cartCount}</span>
          </Button>
          <Button className="mobile-menu-trigger" variant="ghost" aria-label={mobileMenu ? 'Close menu' : 'Open menu'} onClick={() => setMobileMenu((open) => !open)}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-scanline" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" />{t.heroEyebrow}</div>
          <p className="hero-edition">{t.edition}</p>
          <h1>{(t.heroTitle as string[]).map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="hero-description">{t.heroBody}</p>
          <div className="hero-actions">
            <Button className="primary-cta" asChild><a href="#portals">{t.shopNow}<ArrowUpRight size={17} /></a></Button>
            <a className="text-link" href="#collection">{t.explore}<ArrowRight size={15} /></a>
          </div>
          <div className="hero-index"><span>01</span><i />{t.discover}<ArrowDownRight size={14} /></div>
        </div>
        <div className="hero-art" aria-label={locale === 'en' ? 'Abstract neon travel portal artwork' : '霓虹旅行传送门装饰图'} role="img">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-portal"><div className="portal-core" /><div className="portal-glow" /></div>
          <div className="art-crosshair crosshair-one" /><div className="art-crosshair crosshair-two" />
          <span className="art-coordinate coordinate-one">40° 43′ 55.3″ N</span>
          <span className="art-coordinate coordinate-two">FIELD KIT / 001</span>
          <span className="art-label">{t.orbit}</span>
          <div className="art-stamp"><span>W</span><small>GO<br />FURTHER</small></div>
        </div>
        <div className="hero-bottomline"><span>WS—001</span><span>BUILT FOR THE IN-BETWEEN</span><span>EST. MMXXIV</span></div>
      </section>

      <section id="portals" className="portal-section section-wrap">
        <div className="section-heading">
          <div><p className="section-kicker">{t.portal}</p><h2>{t.categoryTitle}</h2></div>
          <p className="section-intro">{t.categoryBody}</p>
        </div>
        <div className="category-grid">
          {(t.categories as string[]).map((category, index) => {
            const Icon = categoryIcons[index]
            return <a className={`category-card tone-${categoryColors[index]}`} href="#collection" key={category} onClick={() => setActiveCategory(categories[index + 1])}>
              <div className="category-topline"><span>PORTAL / 0{index + 1}</span><ArrowUpRight size={15} /></div>
              <div className="category-icon"><Icon strokeWidth={1.4} size={26} /></div>
              <div className="category-bottom"><div><h3>{category}</h3><p>{(t.categorySub as string[])[index]}</p></div><span className="category-arrow"><ArrowRight size={15} /></span></div>
              <span className="category-glow" aria-hidden="true" />
            </a>
          })}
        </div>
      </section>

      <section id="collection" className="collection-section section-wrap">
        <div className="collection-topline"><div><p className="section-kicker">{t.catalogKicker}</p><h2>{t.catalogTitle}</h2></div><span>{visibleProducts.length.toString().padStart(2, '0')} / 10 {t.resultLabel}</span></div>
        <div className="catalog-toolbar">
          <label className="catalog-search"><Search size={15} /><Input aria-label={t.search} placeholder={t.search} value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <div className="filter-pills" role="group" aria-label={t.categoryTitle}>
            {categories.map((category, index) => <button key={category} className={`filter-pill ${activeCategory === category ? 'is-active' : ''}`} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{categoryLabels[index]}</button>)}
          </div>
          <div className="catalog-sort"><ArrowDownUp size={13} /><span>{t.sortLabel}</span></div>
        </div>
        {visibleProducts.length > 0 ? <div className="product-grid">
          {visibleProducts.map((product, index) => <article className="product-card" key={product.id}>
            <div className={`product-image-stage stage-${product.tone}`}>
              <div className="product-image-orbit" aria-hidden="true" />
              <img src={product.image} alt={product.name[locale]} loading={index > 3 ? 'lazy' : 'eager'} onError={(event) => { event.currentTarget.style.display = 'none' }} />
              <span className="product-label">{product.label[locale]}</span>
              <span className="product-index">WS / {String(index + 1).padStart(2, '0')}</span>
              <button className="quick-view" aria-label={`${t.viewDetails}: ${product.name[locale]}`} onClick={() => { setSelectedProduct(product); setDetailQuantity(1) }}><ArrowUpRight size={17} /></button>
            </div>
            <div className="product-info">
              <div className="product-category">{(t.categories as string[])[categories.indexOf(product.category) - 1]}</div>
              <h3>{product.name[locale]}</h3>
              <p className="product-description">{product.description[locale]}</p>
              <div className="product-meta"><span className="product-rating"><Star size={12} fill="currentColor" />{product.rating.toFixed(1)} <small>({product.reviews} {t.reviewsLabel})</small></span><strong>{formatPrice(product.price)}</strong></div>
              <Button className="product-add" onClick={() => addToCart(product)}><Plus size={14} />{t.addToBag}</Button>
            </div>
          </article>)}
        </div> : <div className="catalog-empty"><div className="empty-signal"><Search size={20} /></div><h3>{t.noResults}</h3><p>{t.noResultsHint}</p><Button variant="outline" onClick={() => { setQuery(''); setActiveCategory('all') }}>{t.resetFilters}</Button></div>}
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-mark"><span /></span><span>WAYFARER SUPPLY</span></div>
        <p>{t.footer}</p><span>{t.footerNote}</span><span className="footer-coordinate">40° 43′ N&nbsp;&nbsp; 73° 59′ W</span>
      </footer>

      <Dialog open={selectedProduct !== null} onOpenChange={(open) => { if (!open) setSelectedProduct(null) }}>
        {selectedProduct && <DialogContent className="product-dialog" showCloseButton={false}>
          <Button className="dialog-close" variant="ghost" size="icon" aria-label={locale === 'en' ? 'Close details' : '关闭详情'} onClick={() => setSelectedProduct(null)}><X size={18} /></Button>
          <div className={`dialog-image stage-${selectedProduct.tone}`}><div className="product-image-orbit" aria-hidden="true" /><img src={selectedProduct.image} alt={selectedProduct.name[locale]} onError={(event) => { event.currentTarget.style.display = 'none' }} /><span>{selectedProduct.label[locale]}</span></div>
          <div className="dialog-info"><p className="section-kicker">{(t.categories as string[])[categories.indexOf(selectedProduct.category) - 1]} / {t.details}</p><DialogTitle>{selectedProduct.name[locale]}</DialogTitle><DialogDescription>{selectedProduct.description[locale]}</DialogDescription>
            <div className="dialog-rating"><Star size={14} fill="currentColor" />{selectedProduct.rating.toFixed(1)} <span>({selectedProduct.reviews} {t.reviewsLabel})</span></div>
            <strong className="dialog-price">{formatPrice(selectedProduct.price)}</strong>
            <div className="detail-quantity"><span>{t.quantity}</span><div><Button variant="outline" size="icon" aria-label={locale === 'en' ? 'Decrease quantity' : '减少数量'} onClick={() => setDetailQuantity((value) => Math.max(1, value - 1))}><Minus size={14} /></Button><output>{detailQuantity}</output><Button variant="outline" size="icon" aria-label={locale === 'en' ? 'Increase quantity' : '增加数量'} onClick={() => setDetailQuantity((value) => value + 1)}><Plus size={14} /></Button></div></div>
            <Button className="dialog-add" onClick={() => addToCart(selectedProduct, detailQuantity)}><ShoppingBag size={16} />{t.addToBag} · {formatPrice(selectedProduct.price * detailQuantity)}</Button>
          </div>
        </DialogContent>}
      </Dialog>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="cart-sheet" showCloseButton={false}>
          <div className="cart-header"><div><p className="section-kicker">WS / PACKING SLIP</p><SheetTitle>{t.cartTitle}</SheetTitle><span>{cartCount} {locale === 'en' ? (cartCount === 1 ? 'item' : 'items') : '件商品'}</span></div><Button variant="ghost" size="icon" aria-label={locale === 'en' ? 'Close bag' : '关闭购物袋'} onClick={() => setCartOpen(false)}><X size={19} /></Button></div>
          {cart.length === 0 ? <div className="cart-empty"><div className="cart-empty-icon"><ShoppingCart size={22} /></div><h3>{t.cartEmpty}</h3><p>{t.cartEmptyHint}</p><Button className="primary-cta" onClick={() => setCartOpen(false)}>{t.continueShopping}<ArrowRight size={16} /></Button></div> : <>
            <div className="cart-lines">{cart.map((line) => <article className="cart-line" key={line.product.id}>
              <div className={`cart-line-image stage-${line.product.tone}`}><div className="product-image-orbit" aria-hidden="true" /><img src={line.product.image} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} /></div>
              <div className="cart-line-info"><span className="product-category">{(t.categories as string[])[categories.indexOf(line.product.category) - 1]}</span><h3>{line.product.name[locale]}</h3><strong>{formatPrice(line.product.price)}</strong>
                <div className="cart-line-actions"><div className="cart-stepper"><button aria-label={locale === 'en' ? 'Decrease quantity' : '减少数量'} onClick={() => dispatch({ type: 'decrement', productId: line.product.id })}><Minus size={12} /></button><span>{line.quantity}</span><button aria-label={locale === 'en' ? 'Increase quantity' : '增加数量'} onClick={() => dispatch({ type: 'increment', productId: line.product.id })}><Plus size={12} /></button></div><button className="remove-item" onClick={() => dispatch({ type: 'remove', productId: line.product.id })}><Trash2 size={13} />{t.remove}</button></div>
              </div>
              <strong className="line-total">{formatPrice(line.product.price * line.quantity)}</strong>
            </article>)}</div>
            <div className="cart-summary"><div><span>{t.subtotal}</span><strong>{formatPrice(subtotal)}</strong></div><p>{t.demoCheckout}</p></div>
          </>}
        </SheetContent>
      </Sheet>
      <Toaster position="top-center" />
    </main>
  )
}

export default App
