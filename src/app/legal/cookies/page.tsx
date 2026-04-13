import React from "react";
import { LegalLayout } from "@/components/ui/legal-layout";

export default function CookiesPolicy() {
  return (
    <LegalLayout 
      title="Política de Cookies" 
      subtitle="Como utilizamos cookies para melhorar sua experiência no ScaleShop."
    >
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">1. O que são Cookies?</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita nossa plataforma. Eles servem para lembrar suas preferências, garantir a segurança da conta e analisar o tráfego do site.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">2. Tipos de Cookies que Utilizamos</h2>
        <ul className="list-disc list-inside space-y-3 text-white/60 text-lg">
          <li><strong className="text-white">Cookies Essenciais:</strong> Necessários para o funcionamento básico da plataforma, como login e segurança. Sem eles, o serviço SaaS não pode funcionar corretamente.</li>
          <li><strong className="text-white">Cookies de Performance:</strong> Ajudam-nos a entender como os usuários interagem com a plataforma através de ferramentas como o Microsoft Clarity, permitindo-nos otimizar a velocidade e usabilidade.</li>
          <li><strong className="text-white">Cookies de Funcionalidade:</strong> Lembram escolhas que você faz (como idioma ou tema) para proporcionar uma experiência personalizada.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">3. Uso de Cookies de Terceiros</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Utilizamos serviços de terceiros para análise de dados (ex: Microsoft Clarity). Esses parceiros podem definir seus próprios cookies para coletar informações anônimas sobre sua navegação.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">4. Como Gerenciar Cookies</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Você pode desativar ou excluir cookies através das configurações do seu navegador a qualquer momento. No entanto, observe que a desativação de cookies essenciais pode afetar a funcionalidade de áreas críticas da nossa plataforma SaaS.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-black tracking-tight text-white italic underline decoration-[#ff0050] decoration-2 underline-offset-8">5. Atualizações desta Política</h2>
        <p className="text-lg text-white/60 leading-relaxed">
          Esta política pode ser atualizada conforme novas funcionalidades forem adicionadas à plataforma. Recomendamos a revisão periódica.
        </p>
      </section>
    </LegalLayout>
  );
}
