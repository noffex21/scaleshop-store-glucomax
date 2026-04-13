import React from "react";
import { LegalLayout } from "@/components/ui/legal-layout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout 
      title="Política de Privacidade" 
      subtitle="Como protegemos e tratamos seus dados pessoais no ScaleShop."
    >
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">1. Introdução</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          O ScaleShop está comprometido com a transparência e a segurança dos dados de seus usuários. Esta política descreve como coletamos, usamos e protegemos as informações em conformidade com a Lei Geral de Proteção de Dados (LGPD).
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">2. Coleta de Dados</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Coletamos informações necessárias para a prestação de nossos serviços SaaS, incluindo:
        </p>
        <ul className="list-disc list-inside space-y-3 text-white/60 text-lg">
          <li><strong className="text-white">Dados cadastrais:</strong> Nome, e-mail e informações de faturamento dos Merchants.</li>
          <li><strong className="text-white">Dados de uso:</strong> Logs de acesso, endereço IP e comportamento de navegação na plataforma administrativa.</li>
          <li><strong className="text-white">Dados de clientes finais:</strong> Informações processadas em nome dos merchants (como nome, celular e endereço para fins de simulação de compra e checkout).</li>
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">3. Finalidade do Tratamento</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Os dados coletados são utilizados para:
        </p>
        <ul className="list-disc list-inside space-y-3 text-white/60 text-lg">
          <li>Prover e manter a infraestrutura técnica das lojas.</li>
          <li>Processar pagamentos de assinaturas do plano SaaS.</li>
          <li>Garantir a segurança contra fraudes e acessos não autorizados.</li>
          <li>Melhorar a experiência do usuário através de análises estatísticas.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">4. Compartilhamento de Dados</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          O ScaleShop não comercializa dados pessoais. O compartilhamento ocorre apenas com parceiros essenciais para a operação, como:
        </p>
        <ul className="list-disc list-inside space-y-3 text-white/60 text-lg">
          <li>Provedores de infraestrutura de nuvem (AWS/Google Cloud).</li>
          <li>Gateways de pagamento para processamento das mensalidades do SaaS.</li>
          <li>Ferramentas de suporte e comunicação interna.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">5. Direitos do Titular</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          De acordo com a LGPD, os usuários têm direito a:
        </p>
        <ul className="list-disc list-inside space-y-3 text-white/60 text-lg">
          <li>Confirmar a existência de tratamento de seus dados.</li>
          <li>Acessar, corrigir ou excluir seus dados pessoais.</li>
          <li>Revogar o consentimento a qualquer momento.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">6. Segurança</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Implementamos medidas técnicas e administrativas rigorosas para proteger os dados contra acessos não autorizados, perda, alteração ou qualquer outra forma de tratamento inadequado.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">7. Cookies</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Utilizamos cookies para melhorar a navegação e autenticação na plataforma. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
        </p>
      </section>
    </LegalLayout>
  );
}
