"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MapPin, ShieldCheck, Check, Zap, Package, X, Smile } from "lucide-react";

interface CheckoutLayoutProps {
   storeData: any;
   kitData?: any;
   selectedKit?: number;
   cartItems?: any[];
   cartTotal?: number;
   timeLeft: string;
   formattedPrice: string;
   originalPrice: number;
   discountAmount: number;
   savingAmount: number;
   isLoading: boolean;
   onPlaceOrder: (e: React.MouseEvent) => void;
   onBack: () => void;
   address: any;
   isAddressValid: boolean;
   isClient: boolean;
   setShowAddressList: (show: boolean) => void;
   maskPhone: (phone: string) => string;
   updateQuantity?: (id: string, delta: number) => void;
   isDirectKitLink?: boolean;
   isPreview?: boolean;
   // Overlays
   showAddressList?: boolean;
   showAddressForm?: boolean;
   setShowAddressForm?: (show: boolean) => void;
   setAddress?: (addr: any) => void;
   handlePhoneChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   handleCepChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   handlePlaceOrder?: () => void;
}

export function CheckoutLayout({
   storeData,
   kitData,
   selectedKit,
   cartItems = [],
   cartTotal,
   timeLeft,
   formattedPrice,
   originalPrice,
   discountAmount,
   savingAmount,
   isLoading,
   onPlaceOrder,
   onBack,
   address,
   isAddressValid,
   isClient,
   setShowAddressList,
   maskPhone,
   updateQuantity,
   isDirectKitLink = false,
   isPreview = false,
   // Overlays props
   showAddressList = false,
   showAddressForm = false,
   setShowAddressForm,
   setAddress,
   handlePhoneChange,
   handleCepChange,
   handlePlaceOrder
}: CheckoutLayoutProps) {
    const [showPixOnlyModal, setShowPixOnlyModal] = React.useState(false);

    if (!storeData && !isPreview) return null;

    // Se tivermos itens no carrinho, usamos eles. Caso contrário, o carrinho fica vazio
    const displayItems = cartItems || [];

    const totalQuantity = displayItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

   return (
      <>
      <div className={`flex flex-col bg-[#f5f5f5] font-sans relative w-full overflow-hidden ${!isPreview ? 'max-w-[480px] mx-auto min-h-screen' : 'h-full'}`}>
         {/* Conteúdo Rolável */}
         <div className={`flex-1 overflow-y-auto custom-scrollbar scroll-smooth w-full ${!isPreview ? '' : 'h-full'}`}>

         {/* Top Nav */}
         <div className="bg-white px-4 py-4 sticky top-0 z-50 flex flex-col items-center border-b border-gray-100 shrink-0">
            <div className="w-full flex items-center justify-between">
               <button onClick={onBack} className="p-1 -ml-1">
                  <ChevronLeft className="w-6 h-6 text-[#161823]" />
               </button>
               <h1 className="text-[17px] font-bold text-[#161823]">Resumo do pedido</h1>
               <div className="w-6" />
            </div>
            <div className="flex items-center gap-1 mt-1">
               <ShieldCheck className="w-[14px] h-[14px] text-[#00c9a7] fill-[#00c9a7]/20 stroke-[2]" />
               <span className="text-[12px] text-[#00c9a7] font-bold">Seus dados estão seguros conosco</span>
            </div>
         </div>

         <div className="flex flex-col px-3 gap-[6px] pt-3 flex-1 min-h-0">

            {/* Address Block */}
            <div className="bg-white rounded-[14px] shadow-sm flex flex-col pt-0 overflow-hidden">
               <div className="p-4 pl-3">
                  {isClient && isAddressValid ? (
                     <div
                        onClick={() => setShowAddressList(true)}
                        className="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
                     >
                        <div className="flex items-start gap-2">
                           <MapPin className="w-5 h-5 text-[#161823] mt-0.5 flex-shrink-0" />
                           <div className="flex flex-col flex-1">
                              <div className="flex items-center gap-1 mb-0.5">
                                 <span className="font-bold text-[#161823] text-[14px]">{address.fullName},</span>
                                 <span className="text-[14px] text-[#161823] font-bold">{maskPhone(address.phone)}</span>
                              </div>
                              <p className="text-[13.5px] text-[#161823] leading-[1.4] opacity-80 pr-6">
                                 {address.addressLine}, {address.number}{address.complement ? ` - ${address.complement}` : ''}, {address.neighborhood}, {address.city}, {address.state}, {address.cep}
                              </p>
                           </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                     </div>
                  ) : (
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-[#161823]" />
                           <h2 className="text-[15px] font-bold text-[#161823]">Endereço de envio</h2>
                        </div>
                         <button
                            onClick={() => {
                               setAddress?.({
                                  fullName: "", phone: "", email: "", cep: "", 
                                  addressLine: "", number: "", complement: "", 
                                  neighborhood: "", city: "", state: "", isDefault: false
                               });
                               setShowAddressForm?.(true);
                            }}
                            className="text-[14px] font-bold text-[#fe2c55]"
                         >
                            + Adicionar endereço
                         </button>
                     </div>
                  )}
               </div>
            </div>
            <div className="h-[3px] -mx-3 w-[calc(100%+1.5rem)] bg-[repeating-linear-gradient(90deg,#D94462_0px,#D94462_24px,transparent_24px,transparent_30px,#36C4CE_30px,#36C4CE_54px,transparent_54px,transparent_60px)]"></div>

            {/* Product Components */}
            <div className="bg-white rounded-[14px] p-4 shadow-sm flex flex-col gap-4">
               <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-[14px] text-[#161823] uppercase tracking-tight">{storeData?.storeName || "LOJA OFICIAL"}</span>
                     <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-1 text-[13px] text-gray-500 cursor-pointer">
                     <span>Adicionar nota</span>
                     <ChevronRight className="w-3.5 h-3.5" />
                  </div>
               </div>

               {displayItems.length > 0 ? displayItems.map((item, idx) => (
                <div key={item.id + (item.variantName || idx)} className="flex gap-3 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="w-[84px] h-[84px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100/50 shrink-0 relative">
                     {!storeData && isPreview ? (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                     ) : (
                        <img
                           src={item.image || undefined}
                           alt={item.name}
                           className="w-full h-full object-cover"
                        />
                     )}
                  </div>
                  <div className="flex flex-col flex-1 relative min-w-0">
                     <h3 className="text-[14px] text-[#161823] font-bold leading-[1.3] line-clamp-2 pr-10">
                        {item.name}
                     </h3>
                     <span className="text-[12px] text-gray-500 mt-1 uppercase">{item.variantName}</span>
                     
                     {(item.color || item.size) && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                           {item.color && (
                              <span className="text-[9px] font-black text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded uppercase tracking-wider">COR: {item.color.toUpperCase()}</span>
                           )}
                           {item.size && (
                              <span className="text-[9px] font-black text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded uppercase tracking-wider">TAM: {item.size.toUpperCase()}</span>
                           )}
                        </div>
                     )}

                     <div className="flex gap-1 items-end mt-2">
                        <span className="text-[16px] font-black text-[#fe2c55] tracking-tight">
                           R$ {((item.price || 0) * (item.quantity || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[12px] text-gray-400 line-through font-normal ml-0.5">
                            R$ {((item.originalPrice || 0) * (item.quantity || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-0 right-0 flex items-center rounded-lg text-[15px] font-medium border border-gray-200 overflow-hidden bg-white">
                         <button 
                           onClick={() => updateQuantity?.(item.id, (item.quantity || 1) - 1)}
                           className="w-9 h-9 flex items-center justify-center transition-colors active:bg-gray-100 border-r border-gray-200 text-gray-500 hover:text-gray-800"
                         >−</button>
                         <span className="w-9 h-9 flex items-center justify-center text-[#161823] font-bold text-[14px]">{item.quantity || 1}</span>
                         <button 
                           onClick={() => updateQuantity?.(item.id, (item.quantity || 1) + 1)}
                           className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-black active:bg-gray-100 transition-colors border-l border-gray-200"
                         >+</button>
                      </div>
                  </div>
                </div>
               )) : (
                  <div className="py-10 flex flex-col items-center justify-center text-center opacity-60">
                    <Package className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-[14px] text-gray-500 font-medium">Seu carrinho está vazio</p>
                    <button 
                      onClick={onBack}
                      className="mt-4 text-[#fe2c55] font-bold text-[14px]"
                    >
                      Voltar para a loja
                    </button>
                  </div>
                )}

               <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                     <h2 className="text-[14px] font-bold text-[#161823]">Envio</h2>
                     <div className="flex items-center gap-1 cursor-pointer">
                        <span className="text-[13px] text-[#161823]">Envio padrão</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                     </div>
                  </div>
                  <div className="flex items-center justify-between text-[13px] mt-1">
                     <span className="text-gray-500 font-normal">
                        {(() => {
                           const d1 = new Date();
                           const d2 = new Date();
                           const min = Number(storeData?.deliveryMin) || 4;
                           const max = Number(storeData?.deliveryMax) || 7;
                           d1.setDate(d1.getDate() + min);
                           d2.setDate(d2.getDate() + max);
                           const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
                           return `Receba até ${d1.getDate()}-${d2.getDate()} de ${months[d2.getMonth()]}`;
                        })()}
                     </span>
                     <div className="flex items-center gap-1">
                        <span className="text-gray-400 line-through text-[11px]">R$ 14,50</span>
                        <span className="text-[#00c9a7] font-bold">Grátis</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Loyalty and Discount Block */}
            <div className="bg-white rounded-[14px] p-4 py-3 shadow-sm flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity">
               <div className="flex items-center gap-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FE2C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
                     <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                     <path d="M9 12l2 2 4-4" />
                  </svg>
                  <span className="text-[14px] font-bold text-[#161823]">Desconto Ativado</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#00c9a7]">Frete Grátis</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
               </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-white rounded-[14px] p-4 shadow-sm flex flex-col pt-4">
               <h2 className="text-[16px] font-bold text-[#161823] mb-4">Resumo do pedido</h2>

               <div className="flex flex-col gap-3">
                  <div className="space-y-2.5">
                     <div className="flex justify-between items-center text-[13.5px]">
                        <div className="flex items-center gap-1 cursor-pointer">
                           <span className="text-[#161823] font-bold">Subtotal do produto</span>
                           <ChevronRight className="w-3.5 h-3.5 text-gray-500 -rotate-90" />
                        </div>
                        <span className="text-[#161823]">R$ {formattedPrice}</span>
                     </div>

                     <div className="pl-0 flex flex-col gap-1.5 opacity-90">
                        <div className="flex justify-between items-center text-[13px]">
                           <span className="text-gray-500 font-normal">Preço original</span>
                           <span className="text-gray-600 font-normal">R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                           <span className="text-gray-500 font-normal">Desconto no produto</span>
                           <span className="text-[#fe2c55] font-normal">- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2.5">
                     <div className="flex justify-between items-center text-[13.5px]">
                        <div className="flex items-center gap-1 cursor-pointer">
                           <span className="text-[#161823] font-bold">Subtotal do envio</span>
                           <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-180" />
                        </div>
                        <span className="text-[#161823] font-bold">R$ 0,00</span>
                     </div>
                     <div className="pl-0 flex flex-col gap-1.5 opacity-90">
                        <div className="flex justify-between items-center text-[13px]">
                           <span className="text-gray-500 font-normal">Taxa de envio</span>
                           <span className="text-gray-400 line-through">R$ 14,50</span>
                        </div>
                     </div>
                  </div>

                  <div className="h-[1px] bg-gray-100 w-full my-1"></div>

                  <div className="flex justify-between items-start">
                     <span className="text-[15px] font-bold text-[#161823]">Total</span>
                     <div className="flex flex-col items-end">
                        <span className="text-[16px] font-bold text-[#161823]">R$ {formattedPrice}</span>
                        <span className="text-[11px] text-gray-400 mt-0.5">Impostos inclusos</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="bg-white rounded-[14px] p-4 shadow-sm mb-4">
               <h2 className="text-[15px] font-bold text-[#161823] mb-4">Forma de pagamento</h2>

               <div className="flex flex-col gap-6">
                  {/* Cartão de Crédito */}
                  <div
                     onClick={() => setShowPixOnlyModal(true)}
                     className="flex items-center justify-between w-full cursor-pointer active:opacity-70 transition-opacity"
                  >
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-gray-400 text-xl font-light">
                           +
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[15px] font-normal text-[#161823]">Cartão de crédito</span>
                           <div className="flex flex-col mt-2">
                              <div className="flex gap-0 items-center -ml-0.5">
                                 <div className="w-[46px] h-[30px] bg-white border border-gray-100 rounded flex items-center justify-center p-0.5 overflow-hidden z-[4]">
                                    <img src="/Mastercard.svg" className="h-[20px] w-auto object-contain" alt="Mastercard" />
                                 </div>
                                 <div className="w-[46px] h-[30px] bg-white border border-gray-100 rounded flex items-center justify-center p-0.5 overflow-hidden -ml-[12px] z-[3]">
                                    <img src="/Visa.svg" className="h-[20px] w-auto object-contain" alt="Visa" />
                                 </div>
                                 <div className="w-[46px] h-[30px] bg-white border border-gray-100 rounded flex items-center justify-center p-0.5 overflow-hidden -ml-[12px] z-[2]">
                                    <img src="/ELO.webp" className="h-[20px] w-auto object-contain" alt="Elo" />
                                 </div>
                                 <div className="w-[46px] h-[30px] bg-white border border-gray-100 rounded flex items-center justify-center p-0.5 overflow-hidden -ml-[12px] z-[1]">
                                    <img src="/American_Express.svg" className="h-[20px] w-auto object-contain" alt="Amex" />
                                 </div>
                              </div>
                              <span className="text-[12.5px] text-gray-400 mt-2.5 font-normal tracking-tight">Pague em até 3 parcelas</span>
                           </div>
                        </div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Apple Pay */}
                  <div
                     onClick={() => setShowPixOnlyModal(true)}
                     className="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-[52px] h-[34px] flex items-center justify-center border border-gray-100 rounded bg-gray-100 overflow-hidden">
                           <img src="/apple-pay.jpg" className="h-4.5 object-contain" alt="Apple Pay" />
                        </div>
                        <span className="text-[18px] font-normal text-[#161823]">Apple Pay</span>
                     </div>
                     <div className="w-[24px] h-[24px] rounded-full border-[1.5px] border-gray-200"></div>
                  </div>

                  {/* PIX - New Icon Style */}
                  <div className="flex items-center justify-between cursor-pointer py-1.5 border-t border-gray-50 mt-1">
                     <div className="flex items-start gap-3">
                        <div className="w-[52px] h-[34px] flex items-center justify-center rounded bg-[#f2f2f7] overflow-hidden px-1 mt-0.5">
                           <img src="/PIX_NEW.png" alt="Pix" className="h-4 object-contain" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                           <span className="text-[17px] font-normal text-[#1d1d1f]">Pix</span>
                           <span className="text-[12.5px] text-gray-500 font-normal leading-tight mt-0.5">
                              Pague em até 24 horas e obtenha confirmação instantânea.
                           </span>
                        </div>
                     </div>
                     <div className="flex items-center pt-1 pl-4">
                        <div className="w-[20px] h-[20px] rounded-full border-[6px] border-[#fe2c55] bg-white shadow-sm"></div>
                     </div>
                  </div>

                  {/* Ver Todos */}
                  <button className="flex items-center justify-between pt-3 w-full text-left cursor-pointer active:opacity-70 transition-opacity">
                     <span className="text-[18px] font-normal text-[#161823]">Ver todos</span>
                     <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
               </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="px-1 py-4">
               <p className="text-[12px] text-gray-400 leading-[1.4]">
                  Ao fazer um pedido, você concorda com os <span className="font-bold text-gray-700">Termos de uso e venda</span> e reconhece que leu e concordou com a <span className="font-bold text-gray-700">Política de privacidade</span> da nossa loja oficial.
               </p>
            </div>
            <div className="h-64" />
         </div>
         </div>

         {/* Bottom Action Bar */}
         <div className={`z-40 bg-white border-t border-gray-100 flex flex-col ${!isPreview ? 'fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto' : 'absolute bottom-0 left-0 right-0'}`}>
            <div className="bg-[#fff0f3] py-2 px-3 flex items-center gap-1.5">
               <Smile className="w-[15px] h-[15px] text-[#fe2c55]" />
               <span className="text-[12px] text-[#fe2c55] font-bold">Você está economizando R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} nesse pedido.</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
               <span className="text-[14px] text-[#161823] font-bold">Total ({totalQuantity} {totalQuantity === 1 ? 'item' : 'itens'})</span>
               <span className="text-[18px] font-black text-[#fe2c55]">R$ {formattedPrice}</span>
            </div>
            <div className="px-4 pb-10 pt-2">
               <button
                  id="placeOrderButton"
                  onClick={onPlaceOrder}
                  disabled={isLoading}
                  className={`w-full bg-[#fe2c55] text-white py-[13px] rounded-full shadow-lg shadow-[#fe2c55]/20 font-bold text-[17px] transition-all flex flex-col items-center justify-center leading-tight active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
               >
                  <span>{isLoading ? 'Processando...' : 'Fazer pedido'}</span>
                  <div className="text-[11px] font-normal opacity-95 tracking-tight mt-0.5">
                     O cupom expira em {timeLeft} | Frete grátis
                  </div>
               </button>
            </div>
         </div>
      </div>

      {/* Overlays embutidos no Layout para Fidelidade 1:1 no Preview */}
      {showAddressList && (
         <div className={`${isPreview ? 'absolute' : 'fixed'} inset-0 z-[110] bg-[#f5f5f5] flex flex-col min-h-screen max-w-[480px] mx-auto animate-in slide-in-from-right duration-300 shadow-2xl`}>
            <div className="bg-white px-4 py-4 sticky top-0 z-[111] flex items-center justify-between border-b border-gray-100 shadow-sm">
               <button onClick={() => setShowAddressList(false)} className="p-1 -ml-1">
                  <ChevronLeft className="w-6 h-6 text-[#161823]" />
               </button>
               <h1 className="text-[16px] font-bold text-[#161823]">Endereço de envio</h1>
               <div className="w-6" />
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
               {isAddressValid ? (
                  <div
                     onClick={() => setShowAddressList(false)}
                     className="bg-white rounded-xl p-4 shadow-sm border border-[#fe2c55]/20 flex items-start gap-3 relative"
                  >
                     <div className="min-w-[20px] pt-1">
                        <Check className="w-5 h-5 text-[#fe2c55] stroke-[3px]" />
                     </div>
                     <div className="flex flex-col flex-1 pr-10">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-[#161823] text-[15px]">{address.fullName}</span>
                           <span className="text-[13px] text-gray-500 font-medium">{address.phone}</span>
                        </div>
                        <p className="text-[13px] text-gray-600 leading-[1.4]">
                           {address.addressLine}, {address.number}{address.complement ? ` - ${address.complement}` : ''}<br />
                           {address.neighborhood}, {address.city}, {address.state}, {address.cep}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                           <span className="bg-[#00c9a7] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Padrão</span>
                        </div>
                     </div>
                     <button
                        onClick={(e) => { e.stopPropagation(); setShowAddressForm?.(true); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#fe2c55] font-bold"
                     >
                        Editar
                     </button>
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                     <p className="text-gray-400 text-[14px]">Nenhum endereço adicionado ainda.</p>
                  </div>
               )}
            </div>

            <div className="bg-white px-4 py-4 pb-16 border-t border-gray-100 sticky bottom-0">
                <button
                   onClick={() => {
                      setAddress?.({
                         fullName: "", phone: "", email: "", cep: "", 
                         addressLine: "", number: "", complement: "", 
                         neighborhood: "", city: "", state: "", isDefault: false
                      });
                      setShowAddressForm?.(true);
                   }}
                   className="w-full py-4 border border-[#fe2c55] text-[#fe2c55] rounded-md font-bold text-[16px] active:bg-pink-50 transition-colors"
                >
                   Adicionar endereço de envio
                </button>
            </div>
         </div>
      )}

      {showAddressForm && (
         <div className={`${isPreview ? 'absolute' : 'fixed'} inset-0 z-[120] bg-[#f5f5f5] flex flex-col min-h-screen max-w-[480px] mx-auto animate-in slide-in-from-bottom-6 duration-300 shadow-2xl`}>
            <div className="bg-white px-4 py-4 sticky top-0 z-[121] flex items-center justify-between border-b border-gray-100 shadow-sm">
               <button onClick={() => setShowAddressForm?.(false)} className="p-1 -ml-1">
                  <ChevronLeft className="w-6 h-6 text-[#161823]" />
               </button>
               <h1 className="text-[17px] font-bold text-[#161823]">Adicionar o novo endereço</h1>
               <div className="w-6" />
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
               <div className="px-4 py-3">
                  <h3 className="text-[13px] text-gray-500 mb-2 font-medium">Informações de contato</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                     <input
                        placeholder="Nome completo"
                        value={address.fullName}
                        onChange={(e) => setAddress?.({ ...address, fullName: e.target.value })}
                        className="w-full px-4 py-3.5 text-[15px] text-[#161823] outline-none border-b border-gray-200 focus:bg-gray-50 transition-all placeholder:text-gray-400"
                     />
                     <div className="flex items-center px-4 border-b border-gray-200">
                        <span className="text-[15px] text-[#161823] pr-3 border-r border-gray-200 font-medium">BR +55</span>
                        <input
                           placeholder="Número de telefone"
                           value={address.phone}
                           onChange={handlePhoneChange}
                           inputMode="tel"
                           className="flex-1 py-3.5 pl-3 text-[15px] text-[#161823] outline-none focus:bg-gray-50 transition-all placeholder:text-gray-400"
                        />
                     </div>
                     <input
                        placeholder="Endereço de e-mail"
                        type="email"
                        value={address.email}
                        onChange={(e) => setAddress?.({ ...address, email: e.target.value })}
                        className="w-full px-4 py-3.5 text-[15px] text-[#161823] outline-none focus:bg-gray-50 transition-all placeholder:text-gray-400"
                     />
                  </div>
               </div>

               <div className="px-4 py-3">
                  <h3 className="text-[13px] text-gray-500 mb-2 font-medium">Informações de endereço</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                     <input
                        placeholder="CEP/Código postal"
                        value={address.cep}
                        onChange={handleCepChange}
                        inputMode="numeric"
                        className="w-full px-4 py-3.5 text-[15px] text-[#161823] outline-none border-b border-gray-200 focus:bg-gray-50 transition-all placeholder:text-gray-400"
                     />
                     <div className="flex border-b border-gray-200">
                        <div className="flex-1 flex items-center px-4 justify-between border-r border-gray-200">
                           <span className={address.state ? "text-[#161823]" : "text-gray-400"}>
                              {address.state || "Estado/UF"}
                           </span>
                           <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                        </div>
                        <div className="flex-1 flex items-center px-4 justify-between">
                           <span className={address.city ? "text-[#161823]" : "text-gray-400"}>
                              {address.city || "Cidade"}
                           </span>
                           <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                        </div>
                     </div>
                     <input
                        placeholder="Bairro/Distrito"
                        value={address.neighborhood}
                        onChange={(e) => setAddress?.({ ...address, neighborhood: e.target.value })}
                        className="w-full px-4 py-3.5 text-[15px] text-[#161823] outline-none border-b border-gray-200 focus:bg-gray-50 transition-all placeholder:text-gray-400"
                     />
                     <input
                        placeholder="Endereço"
                        value={address.addressLine}
                        onChange={(e) => setAddress?.({ ...address, addressLine: e.target.value })}
                        className="w-full px-4 py-3.5 text-[15px] text-[#161823] outline-none border-b border-gray-200 focus:bg-gray-50 transition-all placeholder:text-gray-400"
                     />
                     <input
                        placeholder='Nº da residência. Use "s/n" se nenhum'
                        value={address.number}
                        onChange={(e) => setAddress?.({ ...address, number: e.target.value })}
                        className="w-full px-4 py-3.5 text-[15px] text-[#161823] outline-none border-b border-gray-200 focus:bg-gray-50 transition-all placeholder:text-gray-400"
                     />
                     <input
                        placeholder="Apartamento, bloco, etc. (opcional)"
                        value={address.complement}
                        onChange={(e) => setAddress?.({ ...address, complement: e.target.value })}
                        className="w-full px-4 py-3.5 text-[15px] text-[#161823] outline-none focus:bg-gray-50 transition-all placeholder:text-gray-400"
                     />
                  </div>
               </div>

               <div className="px-4 py-3">
                  <h3 className="text-[13px] text-gray-500 mb-2">Configurações</h3>
                  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden px-4 py-3.5 flex items-center justify-between">
                     <span className="text-[15px] text-[#161823]">Definir como padrão</span>
                     <button
                        onClick={() => setAddress?.({ ...address, isDefault: !address.isDefault })}
                        className={`w-12 h-6 rounded-full transition-all relative ${address.isDefault ? 'bg-[#00c9a7]' : 'bg-gray-200'}`}
                     >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${address.isDefault ? 'left-7' : 'left-1'}`} />
                     </button>
                  </div>
               </div>
            </div>

            <div className={`${isPreview ? 'absolute' : 'fixed'} bg-white px-4 pt-2 pb-14 border-t border-gray-100 bottom-0 left-0 right-0 max-w-[480px] mx-auto z-[122] flex flex-col items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]`}>
               <button
                  onClick={() => {
                     setShowAddressForm?.(false);
                     setShowAddressList(false);
                  }}
                  className={`w-full py-3 rounded-md font-bold text-[16px] transition-all ${isAddressValid ? 'bg-[#fe2c55] text-white' : 'bg-[#fe2c55]/40 text-white cursor-not-allowed'}`}
               >
                  Salvar
               </button>
            </div>
         </div>
      )}

      {/* Modal de Aviso de Pix */}
      {showPixOnlyModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] w-full max-w-[340px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-full flex justify-end -mt-2 -mr-2">
                <button 
                  onClick={() => setShowPixOnlyModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6 mt-2">
                 <img 
                   src="/tiktok-shop-logo.jpg" 
                   alt="TikTok Shop" 
                   className="h-9 object-contain"
                 />
              </div>

              <div className="bg-[#fe2c55]/10 p-4 rounded-full mb-5">
                <Zap className="w-7 h-7 text-[#fe2c55] fill-[#fe2c55]" />
              </div>

              <h3 className="text-[19px] font-bold text-[#161823] leading-tight mb-3 px-4">
                Garanta seu desconto agora
              </h3>
              
              <p className="text-[14.5px] text-gray-600 leading-[1.5] mb-7 px-2">
                Para garantir o <span className="font-bold text-[#fe2c55]">preço promocional e frete grátis</span> nesta oferta exclusiva, as reservas são feitas apenas via <span className="font-bold text-[#161823]">Pix</span>. Esta medida garante a segurança e a prioridade no envio do seu pedido.
              </p>

              <button
                onClick={() => setShowPixOnlyModal(false)}
                className="w-full bg-[#fe2c55] text-white py-[15px] rounded-xl font-bold text-[16px] shadow-lg shadow-[#fe2c55]/20 active:scale-[0.98] transition-all"
              >
                Entendi, pagar com Pix
              </button>
            </div>
          </div>
        </div>
      )}
    </>
   );
}
