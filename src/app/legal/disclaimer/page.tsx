import React from "react";
import { LegalLayout } from "@/components/ui/legal-layout";

export default function DisclaimerPage() {
  return (
    <LegalLayout 
      title="Aviso Legal" 
      subtitle="Isenção de responsabilidade e diretrizes éticas do ScaleShop."
    >
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">1. Natureza da Plataforma (SaaS)</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          O ScaleShop é uma plataforma de fornecimento de infraestrutura tecnológica sob o modelo SaaS (Software as a Service). Nossa função é exclusivamente disponibilizar ferramentas de software para que terceiros (merchants) criem suas próprias interfaces de vendas. 
          <strong className="text-white font-bold"> Não operamos como intermediários de vendas, processadores diretos de envios ou garantidores de transações de varejo.</strong>
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">2. Responsabilidade por Terceiros</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          O conteúdo das lojas criadas através do ScaleShop, incluindo descrições de produtos, preços, ofertas e atendimento ao cliente, é de responsabilidade total e irrestrita do Usuário (Merchant) que contratou a ferramenta. O ScaleShop:
        </p>
        <ul className="list-disc list-inside space-y-3 text-white/60 text-lg">
          <li>Não exerce controle editorial prévio sobre os conteúdos publicados pelos usuários.</li>
          <li>Não endossa marcas, produtos ou serviços vendidos por terceiros que utilizam nossa tecnologia.</li>
          <li>Não se responsabiliza por prejuízos causados por práticas comerciais inadequadas de seus usuários.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">3. Combate ao Uso Indevido</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Temos uma política de <strong className="text-[#ff0050] font-black uppercase tracking-tighter">tolerância zero</strong> contra o uso de nossa tecnologia para a prática de golpes, "phishing", vendas fraudulentas ou qualquer atividade criminosa. Colaboramos ativamente com as autoridades competentes no fornecimento de dados para identificação de infratores que utilizarem nossa infraestrutura de forma ilícita.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">4. Links Externos e Parceiros</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Nossa plataforma pode conter links para serviços de terceiros (gateways de pagamento, etc). Não nos responsabilizamos pelas políticas de privacidade ou práticas desses serviços externos.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">5. Isenção de Garantias Técnicas</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Embora busquemos a máxima disponibilidade e performance, o serviço é fornecido "como está", sem garantias explícitas de que será ininterrupto ou livre de erros técnicos decorrentes de fatores externos ou manutenção necessária.
        </p>
      </section>

      <section className="flex flex-col gap-6 p-8 rounded-3xl bg-white/[0.03] border border-[#ff0050]/20">
        <h2 className="text-2xl font-black tracking-tight text-[#ff0050] italic mb-4">6. Contato Legal</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Para notificações extrajudiciais, denúncias de abuso ou questões relacionadas a direitos autorais por parte de usuários da nossa plataforma, entre em contato através do e-mail: <strong className="text-white">legal@scaleshop.click</strong>.
        </p>
      </section>
    </LegalLayout>
  );
}
