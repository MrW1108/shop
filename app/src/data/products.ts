export type CategoryId = 'bags' | 'travel' | 'tech' | 'drinkware' | 'everyday'

export type Product = {
  id: string
  category: CategoryId
  name: { en: string; zh: string }
  description: { en: string; zh: string }
  price: number
  rating: number
  reviews: number
  label: { en: string; zh: string }
  image: string
  tone: string
}

export const products: Product[] = [
  {
    id: 'transit-pack', category: 'bags', name: { en: 'Transit 24L Pack', zh: 'Transit 24L 城市背包' },
    description: { en: 'A clean, considered carry for the everyday commute and the long way home.', zh: '为日常通勤和下班后的绕路而设计，利落有序，轻松收纳。' },
    price: 118, rating: 4.9, reviews: 128, label: { en: 'BEST SELLER', zh: '人气之选' },
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85', tone: 'mint',
  },
  {
    id: 'weekender-duffel', category: 'bags', name: { en: 'Weekender Duffel', zh: '周末旅行包' },
    description: { en: 'Room for two nights, with a shape that still slips under the seat.', zh: '装下两晚行李，依然能轻松放进座椅下方。' },
    price: 146, rating: 4.8, reviews: 84, label: { en: 'FIELD FAVORITE', zh: '旅途常伴' },
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85', tone: 'sand',
  },
  {
    id: 'packing-cubes', category: 'travel', name: { en: 'Modular Packing Cubes', zh: '模块化收纳袋' },
    description: { en: 'A three-piece set that brings a little calm to the open suitcase.', zh: '三件套收纳组合，让打开的行李箱也井然有序。' },
    price: 42, rating: 4.7, reviews: 63, label: { en: '3-PIECE SET', zh: '三件套' },
    image: 'https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?auto=format&fit=crop&w=900&q=85', tone: 'lavender',
  },
  {
    id: 'passport-wallet', category: 'travel', name: { en: 'Passport Folio', zh: '护照收纳夹' },
    description: { en: 'Keep the small essentials together, from check-in to the other side.', zh: '从值机到抵达，把护照和出行小物收在一处。' },
    price: 38, rating: 4.8, reviews: 51, label: { en: 'TRAVEL LIGHT', zh: '轻装出行' },
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85', tone: 'rose',
  },
  {
    id: 'studio-headphones', category: 'tech', name: { en: 'Studio Wireless Headphones', zh: 'Studio 无线耳机' },
    description: { en: 'A quiet pocket of focus for crowded trains and slow Sunday mornings.', zh: '在人潮与慢悠悠的周日清晨，留一片自己的安静。' },
    price: 179, rating: 4.9, reviews: 207, label: { en: 'NEW ARRIVAL', zh: '新近上架' },
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85', tone: 'blue',
  },
  {
    id: 'power-bank', category: 'tech', name: { en: 'Pocket Power 10K', zh: 'Pocket Power 10000mAh 充电宝' },
    description: { en: 'A slim, dependable top-up for the maps, playlists, and moments in between.', zh: '轻薄可靠，为导航、歌单和旅途中每个片刻补足电量。' },
    price: 54, rating: 4.6, reviews: 96, label: { en: 'POCKET SIZE', zh: '轻巧随行' },
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=85', tone: 'silver',
  },
  {
    id: 'all-day-bottle', category: 'drinkware', name: { en: 'All-Day Bottle 750', zh: '全天候随行杯 750ml' },
    description: { en: 'Cold water stays cold. Your desk-to-trail ritual stays simple.', zh: '冰饮持久清凉，让从办公桌到山野的补水习惯更简单。' },
    price: 36, rating: 4.8, reviews: 143, label: { en: '24H COLD', zh: '24 小时保冷' },
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85', tone: 'aqua',
  },
  {
    id: 'camp-mug', category: 'drinkware', name: { en: 'Enamel Camp Mug', zh: '搪瓷露营杯' },
    description: { en: 'A sturdy little reminder to take the scenic route and stop for coffee.', zh: '结实耐用的小杯子，提醒你绕点远路，也别忘了喝咖啡。' },
    price: 24, rating: 4.7, reviews: 76, label: { en: 'CAMP CLASSIC', zh: '露营经典' },
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85', tone: 'coral',
  },
  {
    id: 'everyday-sling', category: 'everyday', name: { en: 'Sidekick Sling', zh: 'Sidekick 斜挎小包' },
    description: { en: 'Phone, keys, one more thing. The hands-free sidekick for daily detours.', zh: '手机、钥匙，还有一件小物。为日常绕路准备的解放双手伙伴。' },
    price: 68, rating: 4.8, reviews: 110, label: { en: 'DAILY DRIVER', zh: '每日搭档' },
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85', tone: 'amber',
  },
  {
    id: 'field-notebook', category: 'everyday', name: { en: 'Field Notes Set', zh: '旅途手记本套装' },
    description: { en: 'Three pocket notebooks for good ideas, new places, and everything else.', zh: '三本口袋手记本，记录好点子、新地方和一路上的其他故事。' },
    price: 18, rating: 4.9, reviews: 58, label: { en: '3-PACK', zh: '三本装' },
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85', tone: 'lilac',
  },
]
