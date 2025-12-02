
import React, { useState, useEffect } from 'react';
import { Product, CartItem, HistoryItem } from '../types';
import { ShoppingCart, Plus, Minus, X, Tag, Search, ShoppingBag, PackageSearch, ArrowRight, Filter, ShieldCheck } from 'lucide-react';

export const AutoPartsStore: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userLevel, setUserLevel] = useState<'Bronze' | 'Silver' | 'Gold'>('Bronze');
  const [discount, setDiscount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Expanded Products Database with Distinct Images
  const products: Product[] = [
    // --- AutoZone Style / Marcas Premium ---
    { id: 'az-1', name: 'Batería Duralast Gold', category: 'Batteries', price: 3400, image: 'https://images.unsplash.com/photo-1622557850711-372138a0a80e?auto=format&fit=crop&q=80&w=400', description: 'Máxima potencia de arranque, garantía 3 años (AutoZone).' },
    { id: 'az-2', name: 'Anticongelante Prestone 50/50', category: 'Cooling', price: 240, image: 'https://images.unsplash.com/photo-1607584144362-e6e879a83a31?auto=format&fit=crop&q=80&w=400', description: 'Protección extendida para todo vehículo.' },
    { id: 'az-3', name: 'Armor All Protector Original', category: 'Cleaning', price: 160, image: 'https://images.unsplash.com/photo-1600494603989-965046ddd3fc?auto=format&fit=crop&q=80&w=400', description: 'Protege vinil, hule y plástico contra UV.' },
    { id: 'az-4', name: 'Filtro Aceite STP Extendido', category: 'Engine', price: 145, image: 'https://images.unsplash.com/photo-1549117616-24a91438914b?auto=format&fit=crop&q=80&w=400', description: 'Filtración superior para aceite sintético.' },
    { id: 'az-5', name: 'Plumas Limpiaparabrisas Duralast', category: 'Accessories', price: 380, image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&q=80&w=400', description: 'Diseño Aero flexible (Par).' },
    { id: 'az-6', name: 'Cera Meguiar\'s Cleaner Wax', category: 'Cleaning', price: 320, image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=400', description: 'Limpia, pule y protege en un paso.' },
    { id: 'az-7', name: 'Kit Herramientas Duralast (50pz)', category: 'Accessories', price: 1450, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=400', description: 'Juego de dados y llaves básico.' },
    { id: 'az-8', name: 'Aditivo Lucas Oil Estabilizador', category: 'Oils', price: 290, image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=400', description: 'Alto rendimiento para motor cansado.' },

    // Oils & Fluids
    { id: '1', name: 'Aceite Sintético 5W-30', category: 'Oils', price: 950, image: 'https://images.unsplash.com/photo-1571597438372-540dd352df41?auto=format&fit=crop&q=80&w=400', description: 'Protección avanzada motor.' },
    { id: '2', name: 'Aceite Alto Kilometraje', category: 'Oils', price: 650, image: 'https://images.unsplash.com/photo-1627483262268-9c96d8a31892?auto=format&fit=crop&q=80&w=400', description: '+100,000 km.' },
    { id: '7', name: 'Anticongelante Económico', category: 'Cooling', price: 120, image: 'https://images.unsplash.com/photo-1563823251956-65529f52f354?auto=format&fit=crop&q=80&w=400', description: 'Uso directo.' },
    { id: '8', name: 'Líquido Dirección Hidráulica', category: 'Oils', price: 150, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400', description: 'Para volante suave.' },
    
    // Batteries & Electrical
    { id: '3', name: 'Batería LTH 12V Estándar', category: 'Batteries', price: 2800, image: 'https://images.unsplash.com/photo-1532585292415-3769c0258055?auto=format&fit=crop&q=80&w=400', description: 'Arranque confiable.' },
    { id: '9', name: 'Fusibles (Pack Surtido)', category: 'Electrical', price: 80, image: 'https://images.unsplash.com/photo-1542456073-61e8c9527f09?auto=format&fit=crop&q=80&w=400', description: '10pz diferentes amps.' },
    { id: '10', name: 'Foco H4 Halógeno', category: 'Electrical', price: 120, image: 'https://images.unsplash.com/photo-1610443026859-da407137f62c?auto=format&fit=crop&q=80&w=400', description: 'Luz blanca intensa.' },
    { id: '11', name: 'Terminales de Batería', category: 'Electrical', price: 90, image: 'https://images.unsplash.com/photo-1623992224683-8a308fc568e9?auto=format&fit=crop&q=80&w=400', description: 'Par plomo/cobre.' },

    // Brakes
    { id: '4', name: 'Líquido de Frenos DOT4', category: 'Brakes', price: 180, image: 'https://images.unsplash.com/photo-1621905430543-ad7750868a29?auto=format&fit=crop&q=80&w=400', description: 'Seguridad máxima.' },
    { id: '12', name: 'Balatas Cerámicas Delanteras', category: 'Brakes', price: 650, image: 'https://images.unsplash.com/photo-1589138406141-860f4e427d2c?auto=format&fit=crop&q=80&w=400', description: 'Bajo polvo y ruido.' },
    { id: '13', name: 'Limpiador de Frenos', category: 'Brakes', price: 110, image: 'https://images.unsplash.com/photo-1600494603989-965046ddd3fc?auto=format&fit=crop&q=80&w=400', description: 'Spray desengrasante.' },

    // Engine & Filters
    { id: '14', name: 'Bujía Iridio (Pieza)', category: 'Engine', price: 180, image: 'https://images.unsplash.com/photo-1635785986422-95f32b896945?auto=format&fit=crop&q=80&w=400', description: 'Larga duración.' },
    { id: '15', name: 'Filtro de Aire Universal', category: 'Engine', price: 200, image: 'https://images.unsplash.com/photo-1558452331-5c317589d71c?auto=format&fit=crop&q=80&w=400', description: 'Alto flujo.' },
    { id: '16', name: 'Aditivo Gasolina', category: 'Engine', price: 130, image: 'https://images.unsplash.com/photo-1599256829777-624647385a4a?auto=format&fit=crop&q=80&w=400', description: 'Limpiador inyectores.' },
    { id: '17', name: 'Banda de Accesorios', category: 'Engine', price: 350, image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400', description: 'Multicanal reforzada.' },

    // Suspension
    { id: '18', name: 'Amortiguador Trasero', category: 'Suspension', price: 850, image: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?auto=format&fit=crop&q=80&w=400', description: 'Gas reforzado.' },
    
    // Cleaning & Accessories
    { id: '5', name: 'Kit Limpieza Interior', category: 'Cleaning', price: 350, image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=400', description: 'Shampoo, abrillantador.' },
    { id: '6', name: 'Limpiaparabrisas (Par)', category: 'Accessories', price: 250, image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=400', description: 'Visibilidad lluvia.' },
    { id: '19', name: 'Aromatizante New Car', category: 'Accessories', price: 50, image: 'https://images.unsplash.com/photo-1559419820-2cb9d3cb6295?auto=format&fit=crop&q=80&w=400', description: 'Larga duración.' },
    { id: '20', name: 'Cera Líquida Express', category: 'Cleaning', price: 180, image: 'https://images.unsplash.com/photo-1520340356584-2996384bb44f?auto=format&fit=crop&q=80&w=400', description: 'Brillo instantáneo.' },
    
    // New Items
    { id: '21', name: 'Gato de Tijera 1Ton', category: 'Accessories', price: 450, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=400', description: 'Para emergencias.' },
    { id: '22', name: 'Cables Pasacorriente', category: 'Accessories', price: 300, image: 'https://images.unsplash.com/photo-1605218427306-635ba2439af2?auto=format&fit=crop&q=80&w=400', description: 'Calibre 4 reforzado.' },
    { id: '23', name: 'Tapetes Uso Rudo (4pz)', category: 'Accessories', price: 500, image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=400', description: 'Hule resistente.' },
    { id: '24', name: 'Funda Volante Sport', category: 'Accessories', price: 180, image: 'https://images.unsplash.com/photo-1506469717960-433cebe3f181?auto=format&fit=crop&q=80&w=400', description: 'Mejor agarre.' },
  ];

  useEffect(() => {
    // Calculate Loyalty Level based on service history
    const storedHistory = localStorage.getItem('serviceHistory');
    if (storedHistory) {
      try {
        const history: HistoryItem[] = JSON.parse(storedHistory);
        const count = history.length;
        if (count >= 6) {
          setUserLevel('Gold');
          setDiscount(0.10); // 10%
        } else if (count >= 3) {
          setUserLevel('Silver');
          setDiscount(0.05); // 5%
        } else {
            setUserLevel('Bronze');
            setDiscount(0);
        }
      } catch (e) {
        console.error("Error reading history for discounts", e);
      }
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const getFinalPrice = (price: number) => {
    return Math.floor(price * (1 - discount));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = cart.reduce((sum, item) => sum + (getFinalPrice(item.price) * item.quantity), 0);
  const totalSavings = subtotal - total;

  const checkoutWhatsApp = () => {
    let message = `Hola TalpaPits, quiero realizar un pedido de refacciones:\n\n`;
    cart.forEach(item => {
      message += `• ${item.quantity}x ${item.name} ($${getFinalPrice(item.price)} c/u)\n`;
    });
    message += `\nSubtotal Real: $${subtotal}`;
    if (discount > 0) {
      message += `\nDescuento Nivel ${userLevel}: -$${totalSavings}`;
    }
    message += `\n*TOTAL A PAGAR: $${total}*`;
    message += `\n\n¿Tienen entrega a domicilio disponible?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/523881039121?text=${encodedMessage}`, '_blank');
  };

  const requestSpecialPart = () => {
    const message = `Hola TalpaPits, no encontré "${searchTerm}" en su tienda. ¿Me podrían dar precio y disponibilidad para una pieza de AutoZone o similar?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/523881039121?text=${encodedMessage}`, '_blank');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-24 pt-6 px-4 bg-slate-50 min-h-screen relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Refacciones</h2>
            <p className="text-slate-500 text-xs">Catálogo TalpaPits & AutoZone</p>
        </div>
        <div className="relative">
            <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-3 bg-white rounded-full shadow-md border border-slate-100 relative text-slate-700 hover:bg-slate-50"
            >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                        {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                )}
            </button>
        </div>
      </div>

      {/* Loyalty Banner */}
      {discount > 0 && (
        <div className={`mb-6 p-4 rounded-xl flex items-center justify-between shadow-sm border ${
            userLevel === 'Gold' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-slate-200 border-slate-300 text-slate-700'
        }`}>
            <div className="flex items-center gap-3">
                <Tag size={20} />
                <div>
                    <h3 className="font-bold text-sm">Precio {userLevel === 'Gold' ? 'VIP Oro' : 'Plata'} Activado</h3>
                    <p className="text-xs opacity-80">-{discount * 100}% de descuento extra en todo.</p>
                </div>
            </div>
            <span className="text-lg font-black">-{discount * 100}%</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 mb-6 sticky top-0 z-20 bg-slate-50 py-2 shadow-sm -mx-4 px-4">
        <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
                type="text" 
                placeholder="¿Qué pieza o marca buscas?" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Oils', 'Batteries', 'Brakes', 'Engine', 'Cooling', 'Electrical', 'Suspension', 'Cleaning'].map((cat) => (
                <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                        categoryFilter === cat 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                    {cat === 'All' ? 'Todo' : 
                     cat === 'Oils' ? 'Aceites' : 
                     cat === 'Batteries' ? 'Baterías' :
                     cat === 'Brakes' ? 'Frenos' :
                     cat === 'Engine' ? 'Motor' :
                     cat === 'Cooling' ? 'Enfriamiento' :
                     cat === 'Electrical' ? 'Eléctrico' :
                     cat === 'Suspension' ? 'Suspensión' :
                     'Limpieza'}
                </button>
            ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:border-orange-200 transition-colors">
                    <div className="h-32 overflow-hidden bg-slate-100 relative group">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        {discount > 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                -{discount * 100}%
                            </div>
                        )}
                        {(product.name.includes('Duralast') || product.name.includes('AutoZone') || product.name.includes('Prestone')) && (
                             <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                                <ShieldCheck size={10} /> AutoZone
                            </div>
                        )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                        <h3 className="font-bold text-slate-800 text-xs leading-tight mb-1">{product.name}</h3>
                        <p className="text-[10px] text-slate-500 mb-2 line-clamp-2">{product.description}</p>
                        
                        <div className="mt-auto">
                            <div className="flex items-baseline gap-1 mb-2 flex-wrap">
                                {discount > 0 ? (
                                    <>
                                        <span className="text-[10px] text-slate-400 line-through">${product.price}</span>
                                        <span className="text-sm font-bold text-red-600">${getFinalPrice(product.price)}</span>
                                    </>
                                ) : (
                                    <span className="text-sm font-bold text-slate-800">${product.price}</span>
                                )}
                            </div>
                            <button 
                                onClick={() => addToCart(product)}
                                className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 shadow-sm active:scale-95"
                            >
                                <Plus size={14} /> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
          </div>
      ) : (
          /* Empty State / Custom Order CTA */
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white rounded-xl border border-dashed border-slate-300">
              <div className="bg-orange-50 p-4 rounded-full mb-4">
                 <PackageSearch size={40} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">¿No encuentras "{searchTerm}"?</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs">
                  Si es de AutoZone o especial, nosotros te la conseguimos.
              </p>
              <button 
                  onClick={requestSpecialPart}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
              >
                  Cotizar Pieza Especial por WhatsApp <ArrowRight size={16} />
              </button>
          </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div 
                className="bg-white w-full max-w-md mx-auto h-[80vh] sm:h-auto sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <ShoppingBag size={20} className="text-orange-600"/>
                        Tu Carrito
                    </h3>
                    <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-slate-200 rounded-full">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <ShoppingCart size={48} className="mb-4 opacity-20" />
                            <p>Tu carrito está vacío</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                                        <div className="flex items-center gap-1">
                                            {discount > 0 && (
                                                <span className="text-[10px] text-slate-400 line-through">${item.price}</span>
                                            )}
                                            <span className={`text-xs font-bold ${discount > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                                                ${getFinalPrice(item.price)} c/u
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                                    <button 
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-red-500 transition-colors"
                                    >
                                        {item.quantity === 1 ? <X size={12}/> : <Minus size={12} />}
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-green-600 transition-colors"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
                        <div className="space-y-2 mb-4 text-sm">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal</span>
                                <span>${subtotal}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>Ahorro Nivel {userLevel} ({discount * 100}%)</span>
                                    <span>-${totalSavings}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                                <span>Total</span>
                                <span>${total}</span>
                            </div>
                        </div>
                        <button 
                            onClick={checkoutWhatsApp}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={20} />
                            Pedir por WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
