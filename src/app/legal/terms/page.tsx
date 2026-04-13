import React from "react";
import { LegalLayout } from "@/components/ui/legal-layout";

export default function TermsOfUse() {
  return (
    <LegalLayout 
      title="Termos de Uso" 
      subtitle="Regras e diretrizes para o uso da plataforma ScaleShop."
    >
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">1. Aceitação dos Termos</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Ao acessar e utilizar a plataforma ScaleShop, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">2. Definição do Serviço (SaaS)</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          O ScaleShop é um provedor de infraestrutura tecnológica (Software as a Service - SaaS). Nossa plataforma fornece ferramentas para a criação e gestão de interfaces de vendas online. 
          <strong className="text-white font-bold"> O ScaleShop NÃO é um marketplace nem uma loja de varejo.</strong> Não possuímos, vendemos ou despachamos os produtos anunciados pelos nossos usuários (merchants).
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">3. Isenção de Responsabilidade sobre Produtos</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Toda e qualquer transação comercial realizada através das interfaces criadas na plataforma é de responsabilidade exclusiva do Usuário (Merchant) e do Comprador Final. O ScaleShop não se responsabiliza por:
        </p>
        <ul className="list-disc list-inside space-y-3 text-white/60 text-lg">
          <li>Qualidade, segurança ou legalidade dos produtos anunciados.</li>
          <li>Entrega ou logística de envio.</li>
          <li>Suporte ao cliente final após a venda.</li>
          <li>Discrepâncias entre o produto anunciado e o recebido.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">4. Proibição de Atividades Ilegais e Golpes</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          É estritamente proibido o uso da plataforma para a prática de atividades ilícitas, incluindo, mas não se limitando a: golpes, fraudes financeiras, venda de produtos proibidos por lei ou pirataria. 
          <strong className="text-white font-bold underline decoration-[#ff0050]">O ScaleShop reserva-se o direito de suspender ou banir imediatamente qualquer conta que viole estas diretrizes, sem aviso prévio.</strong>
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">5. Propriedade Intelectual</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          O software, design visual, logotipos e algoritmos da plataforma são de propriedade exclusiva do ScaleShop. O uso da plataforma concede uma licença de uso limitada e revogável, não configurando transferência de propriedade intelectual.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">6. Limitação de Responsabilidade</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Em nenhuma circunstância o ScaleShop será responsável por quaisquer danos indiretos, incidentais ou consequentes decorrentes do uso inadequado da plataforma por seus usuários ou por falhas técnicas de terceiros (provedores de pagamento, hospedagem, etc).
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">7. Alterações nos Termos</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Podemos atualizar estes termos periodicamente. A continuação do uso da plataforma após as alterações constitui aceitação dos novos termos.
        </p>
      </section>
    </LegalLayout>
  );
}
