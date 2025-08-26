// KODUN TAM VE DOĞRU HALİ

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Geist, Geist_Mono } from "next/font/google";
import axios from 'axios';

// İkon kütüphanelerini import edin
import { 
  FaCoffee, FaCocktail, FaBlenderPhone, FaEgg, 
  FaHamburger, FaLeaf, FaCookieBite, FaIceCream, FaChevronRight, 
  FaSearch, FaTimes, FaBars
} from 'react-icons/fa';
import { GiCakeSlice } from 'react-icons/gi';
import { TbCurrencyLira } from 'react-icons/tb';

import kule from '../assets/kule.jpeg';

// Fontları tanımla
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Ürünler için TypeScript arayüzleri
interface Product {
  title: string;
  category: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  oldPrice?: string; // Eski fiyat opsiyonel olarak eklendi
}

interface ProductDataBySubcategory {
  [key: string]: Product[];
}

interface Subcategory {
  name: string;
  icon: React.ReactNode;
}

interface MenuData {
  [key: string]: {
    title: string;
    subcategories: Subcategory[];
  };
}

// Props arayüzleri
interface HeaderProps {
  onBackClick: () => void;
  onSearchToggle: () => void;
  isSearchActive: boolean;
  onSearchChange: (value: string) => void;
  searchQuery: string;
  onMenuToggle: () => void;
  onAboutClick: () => void;
}

interface MobileMenuProps {
  isMenuOpen: boolean;
  onMenuClose: () => void;
  onBackClick: () => void;
  onAboutClick: () => void;
}

interface CategoryItemProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

// İkon ve alt kategori eşleşmesi
const categoryIcons: Record<string, React.ReactNode> = {
  'Sıcak İçecekler': <FaCoffee  />,
  'Soğuk İçecekler': <FaCocktail />,
  'Smoothies': <FaBlenderPhone />,
  'Kahvaltı': <FaEgg />,
  'Sandiviç': <FaHamburger />,
  'Salata': <FaLeaf />,
  'Atıştırmalık': <FaCookieBite />,
  'Kekler': <GiCakeSlice />,
  'Dondurma': <FaIceCream />,
};

// Header Bileşeni
const Header: React.FC<HeaderProps> = ({ onBackClick, onSearchToggle, isSearchActive, onSearchChange, searchQuery, onMenuToggle, onAboutClick }) => (
  <header className="sticky top-0 z-50 bg-white shadow-md">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
      <div className={`md:hidden flex items-center justify-between w-full relative z-10 ${isSearchActive ? 'opacity-0 pointer-events-none' : ''}`}>
        <button onClick={onMenuToggle} className="text-gray-600 hover:text-gray-900 focus:outline-none">
          <FaBars className="w-6 h-6" />
        </button>
        <h1
          className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors cursor-pointer absolute left-1/2 -translate-x-1/2"
          onClick={onBackClick}
        >
          Kafe Menü
        </h1>
        <button 
          onClick={onSearchToggle} 
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <FaSearch className="w-5 h-5" />
        </button>
      </div>
      <div className={`hidden md:flex items-center justify-between w-full relative z-10 ${isSearchActive ? 'opacity-0 pointer-events-none' : ''}`}>
        <h1
          className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors cursor-pointer"
          onClick={onBackClick}
        >
          Kafe Menü
        </h1>
        <div className="flex items-center space-x-6">
          <nav className="flex items-center space-x-6 text-gray-600 font-medium">
            <button onClick={onBackClick} className="hover:text-gray-900 transition-colors">Menü</button>
            <button onClick={onAboutClick} className="hover:text-gray-900 transition-colors">Hakkımızda</button>
            <a href="#" className="hover:text-gray-900 transition-colors">İletişim</a>
          </nav>
          <button 
            onClick={onSearchToggle} 
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className={`flex items-center absolute inset-x-4 md:right-4 md:left-auto overflow-hidden transition-all duration-300 ${isSearchActive ? 'opacity-100 w-auto md:w-96' : 'opacity-0 w-0'}`}>
        <div className="relative w-full max-w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 py-2 text-gray-800 border-b border-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-transparent"
            onChange={(e) => onSearchChange(e.target.value)}
            value={searchQuery}
            autoFocus
          />
        </div>
        <button onClick={onSearchToggle} className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none">
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
);

// Mobil Menü Bileşeni
const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, onMenuClose, onBackClick, onAboutClick }) => (
  <aside 
    className={`fixed top-0 left-0 w-64 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
  >
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-xl font-bold text-gray-800">Menü</h2>
      <button onClick={onMenuClose} className="text-gray-600 hover:text-gray-900 focus:outline-none">
        <FaTimes className="w-5 h-5" />
      </button>
    </div>
    <nav className="p-4 flex flex-col space-y-4 text-lg">
      <button 
        onClick={() => { onBackClick(); onMenuClose(); }} 
        className="text-gray-800 hover:text-gray-600 font-medium text-left"
      >
        Menü
      </button>
      <button 
        onClick={() => { onAboutClick(); onMenuClose(); }} 
        className="text-gray-800 hover:text-gray-600 font-medium text-left"
      >
        Hakkımızda
      </button>
      <a href="#" className="text-gray-800 hover:text-gray-600 font-medium">İletişim</a>
    </nav>
  </aside>
);

// Footer Bileşeni
const Footer = () => (
  <footer className="bg-white text-center py-8 text-gray-500 shadow-inner mt-auto">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-center md:space-x-8 text-sm mb-2">
        <a href="#" className="hover:underline">Yusuf Osmanoğlu</a>
        <a href="#" className="hover:underline">yusufosmanoglu2003@gmail.com</a>
      </div>
      <p className="text-sm">@2025 Kafe Menü. Tüm Hakları Saklıdır.</p>
    </div>
  </footer>
);

// Kategori Kartı Bileşeni
const CategoryItem: React.FC<CategoryItemProps> = ({ name, icon, onClick }) => (
  <div
    className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="mb-2 text-2xl text-gray-700">{icon}</div>
    <span className="text-sm font-medium text-gray-800">{name}</span>
  </div>
);

// Ürün Kartı Bileşeni
const ProductItem: React.FC<{ product: Product; onClick: (p: Product) => void }> = ({ product, onClick }) => {
  const itemSrc = (product.imageUrl || '').trim();
  let imageUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f5e3df"/></svg>';
  if (/^https?:\/\//i.test(itemSrc)) {
    // Drive veya googleusercontent ise proxy üzerinden geçir
    if (itemSrc.includes('drive.google.com') || itemSrc.includes('googleusercontent.com') || itemSrc.includes('docs.google.com')) {
      imageUrl = `/api/proxy-image?url=${encodeURIComponent(itemSrc)}`;
    } else {
      imageUrl = itemSrc;
    }
  }

  return (
    <div
      className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="w-16 h-16 relative mb-2">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-lg"
          unoptimized
        />
      </div>
      <h3 className="text-sm font-medium text-gray-800 mt-2">{product.name}</h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
      <div className="flex items-center mt-2">
        {product.oldPrice && (
          <span className="mr-2 text-xs line-through text-gray-500">
            <TbCurrencyLira className="inline-block mr-0.5" />{product.oldPrice}
          </span>
        )}
        {product.price && (
          <span className="text-sm font-bold text-gray-800">
            <TbCurrencyLira className="inline-block mr-0.5" />{product.price}
          </span>
        )}
      </div>
    </div>
  );
};

// Ürün Detay Modal'ı Bileşeni
const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const modalSrc = (product.imageUrl || '').trim();
  let imageUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%23f5e3df"/></svg>';
  if (/^https?:\/\//i.test(modalSrc)) {
    if (modalSrc.includes('drive.google.com') || modalSrc.includes('googleusercontent.com') || modalSrc.includes('docs.google.com')) {
      imageUrl = `/api/proxy-image?url=${encodeURIComponent(modalSrc)}`;
    } else {
      imageUrl = modalSrc;
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
          <FaTimes className="h-6 w-6" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 h-40 w-40 rounded-lg">
            <Image 
              src={imageUrl} 
              alt={product.name} 
              fill
              style={{ objectFit: 'cover' }} 
              className="rounded-lg" 
              unoptimized
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <p className="mt-2 text-sm text-gray-600">{product.description}</p>
          <div className="flex items-center mt-4">
            {product.oldPrice && (
              <span className="mr-2 text-lg line-through text-gray-500">
                <TbCurrencyLira className="inline-block mr-0.5" />{product.oldPrice}
              </span>
            )}
            {product.price && (
              <span className="text-xl font-bold text-gray-800">
                <TbCurrencyLira className="inline-block mr-0.5" />{product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hakkımızda bileşeni
const AboutUs = () => (
  <div className="max-w-4xl mx-auto py-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Hakkımızda</h1>
    <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg">
      <Image
        src={kule} 
        alt="Cafe Interior"
        layout="fill"
        objectFit="cover"
      />
    </div>
    
    <div className="prose max-w-none text-gray-700">
      <p className="mb-4">
        Kafe Kafe&apos;e hoş geldiniz, şehir merkezinin kalbinde yer alan şirin bir kafe. 2015 yılında kapılarımızı açtığımızdan beri, sıcak ve davetkar bir atmosferde en kaliteli kahveyi, lezzetli hamur işlerini ve doyurucu yemekleri sunmaya kendimizi adadık. Misyonumuz, topluluğun bir araya gelip bağlantı kurabildiği ve kaliteli yiyecek ve içeceklerin tadını çıkarabileceği bir alan yaratmaktır.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Hikayemiz</h2>
      <p className="mb-4">
        Kafe Kafe, ikinci evi gibi hissedilen bir kafe açma hayali olan tutkulu bir barista olan X tarafından kuruldu. Küçük bir mekan ve büyük bir tutkuyla başladığımız yolculuğumuzda, samimi hizmetimiz ve olağanüstü ürünlerimizle sevilen bir yerel mekan haline geldik. Kahve çekirdeklerimizi yerel kavuruculardan temin ediyor ve tüm yemeklerimizde taze, yüksek kaliteli malzemeler kullanıyoruz.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Bize Ulaşın</h2>
      <p className="mb-2">
        Email: <a href="mailto:info@thedailygrind.com" className="text-blue-600 hover:underline">info@Kafe.com</a>
      </p>
      <p className="mb-2">
        Telefon: (555) 123-4567
      </p>
      <p>
        Adres: Sarıyer, İstanbul
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Saatler</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Hafta İçi: 7:00  - 21:00</li>
        <li>Cumartesi: 10:00 - 21:00</li>
        <li>Pazar: 10:00 - 20:00</li>
      </ul>
    </div>
  </div>
);


const CafeMenu = () => {
  const [currentView, setCurrentView] = useState('main');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<ProductDataBySubcategory>({});
  const [menuData, setMenuData] = useState<MenuData>({});
  const [allProductsArray, setAllProductsArray] = useState<Product[]>([]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await axios.get('/api/sheets');
        const rawData: Product[] = res.data.data;
        
        if (!rawData || rawData.length === 0) {
          setError('Google Sheets\'te veri bulunamadı.');
          setLoading(false);
          return;
        }

        const transformedProductData: ProductDataBySubcategory = {};
        const transformedMenuData: MenuData = {};

        rawData.forEach(item => {
          const mainCategoryTitle = item.title;
          const subcategoryName = item.category;
          
          if (!transformedProductData[subcategoryName]) {
            transformedProductData[subcategoryName] = [];
          }
          transformedProductData[subcategoryName].push(item);

          if (!transformedMenuData[mainCategoryTitle]) {
            transformedMenuData[mainCategoryTitle] = {
              title: mainCategoryTitle,
              subcategories: [],
            };
          }
          if (!transformedMenuData[mainCategoryTitle].subcategories.find(sub => sub.name === subcategoryName)) {
            transformedMenuData[mainCategoryTitle].subcategories.push({
              name: subcategoryName,
              icon: categoryIcons[subcategoryName] || null,
            });
          }
        });

        setProductData(transformedProductData);
        setMenuData(transformedMenuData);
        setAllProductsArray(rawData);
        // Debug: imageUrl durumunu logla
        try {
          console.log('[DEBUG] /api/sheets sample imageUrls:', rawData.slice(0, 5).map(p => p.imageUrl));
        } catch {}
        setLoading(false);

      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error("Veri çekme hatası:", e.response ? e.response.data : e.message);
          setError('Veri çekilirken bir hata oluştu: ' + (e.response ? e.response.data.error : e.message));
        } else {
          console.error('Veri çekme hatası:', e);
          setError('Veri çekilirken beklenmeyen bir hata oluştu.');
        }
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setCurrentView(categoryName);
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSearchQuery('');
    setIsSearchActive(false);
  };

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };
  
  const handleAboutClick = () => {
    setCurrentView('about');
    handleMenuClose();
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isSearchActive) {
          setIsSearchActive(false);
          setSearchQuery('');
        }
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
        if (selectedProduct) {
          setSelectedProduct(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchActive, isMenuOpen, selectedProduct]);

  const filteredProducts = allProductsArray.filter(product =>
    (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-600">Menü verileri yükleniyor...</div>;
    }

    if (error) {
      return <div className="text-center text-red-600">Hata: {error}</div>;
    }
    
    if (isSearchActive) {
      return (
        <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Arama Sonuçları</h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductItem key={product.name} product={product} onClick={handleProductClick} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Ürün bulunamadı.</p>
          )}
        </div>
      );
    }
    
    if (currentView === 'about') {
      return <AboutUs />;
    }
    
    const isSubcategoryView = Object.values(menuData).some(mainCat => mainCat.subcategories.some(sub => sub.name === currentView));
    if (isSubcategoryView) {
      const parentCategory = Object.keys(menuData).find(key => menuData[key].subcategories.some(sub => sub.name === currentView));
      return (
        <div className="mt-8">
          <div className="text-sm text-gray-500 mb-4 flex items-center">
            <span 
              className="cursor-pointer hover:underline" 
              onClick={handleBackToMain}
            >
              Menü
            </span>
            <FaChevronRight className="w-3 h-3 mx-2 text-gray-400" />
            <span 
              className="cursor-pointer hover:underline" 
              onClick={() => handleCategoryClick(parentCategory!)}
            >
              {menuData[parentCategory!].title}
            </span>
            <FaChevronRight className="w-3 h-3 mx-2 text-gray-400" />
            <span>{currentView}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">{currentView}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {productData[currentView]?.map((product) => (
              <ProductItem key={product.name} product={product} onClick={handleProductClick} />
            ))}
          </div>
        </div>
      );
    }
    
    if (menuData[currentView]) {
      const category = menuData[currentView];
      return (
        <div className="mt-8">
          <div className="text-sm text-gray-500 mb-4 flex items-center">
            <span 
              className="cursor-pointer hover:underline" 
              onClick={handleBackToMain}
            >
              Menü
            </span>
            <FaChevronRight className="w-3 h-3 mx-2 text-gray-400" />
            <span>{category.title}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">{category.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {category.subcategories.map((item) => (
              <CategoryItem
                key={item.name}
                name={item.name}
                icon={item.icon}
                onClick={() => handleCategoryClick(item.name)}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Menü</h2>
        {Object.keys(menuData).map((key) => (
          <section key={key} className="mb-8">
            <h3 className="text-xl md:text-2xl font-medium text-gray-700 mb-4">{menuData[key].title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {menuData[key].subcategories.map((item) => (
                <CategoryItem
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  onClick={() => handleCategoryClick(item.name)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gray-50 font-sans flex flex-col overflow-x-hidden`}>
      <Header 
        onBackClick={handleBackToMain}
        onSearchToggle={handleSearchToggle}
        isSearchActive={isSearchActive}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onMenuToggle={handleMenuToggle}
        onAboutClick={handleAboutClick}
      />
      <MobileMenu 
        isMenuOpen={isMenuOpen} 
        onMenuClose={handleMenuClose} 
        onBackClick={handleBackToMain} 
        onAboutClick={handleAboutClick}
      />
      <main className="container mx-auto px-4 py-8 md:py-16 flex-grow">
        {renderContent()}
      </main>
      <Footer />
      <ProductModal product={selectedProduct} onClose={handleModalClose} />
    </div>
  );
};

export default CafeMenu;