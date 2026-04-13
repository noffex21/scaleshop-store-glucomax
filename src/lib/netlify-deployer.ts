import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";

/**
 * NetlifyDeployer
 *
 * Responsável por gerenciar sites no Netlify vinculados ao GitHub
 * ou realizar deploys via ZIP em casos excepcionais.
 */
export class NetlifyDeployer {
  private zip: AdmZip;
  private projectRoot: string;
  private token: string;

  constructor(token?: string) {
    this.zip = new AdmZip();
    this.projectRoot = process.cwd();
    this.token = token || '';
  }

  public async createDeployKey(): Promise<{ id: string; public_key: string }> {
    const res = await fetch('https://api.netlify.com/api/v1/deploy_keys', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Falha ao criar Deploy Key no Netlify: ${err}`);
    }

    const data = await res.json();
    return { id: data.id, public_key: data.public_key };
  }

  public async deployNewStore(
    siteName: string,
    apiKey: string,
    githubRepoFullName?: string,
    githubInstallationId?: string,
    deployKeyId?: string,
    branch: string = 'main'
  ): Promise<{ url: string; siteId: string }> {
    
    // Configuração base (sempre inclui as ENV vars)
    const createBody: Record<string, any> = {
      name: siteName,
      build_settings: {
        env: {
          NEXT_PUBLIC_SCALE_SHOP_API_KEY: apiKey,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://scaleoficial.site',
          NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'scaleoficial.site',
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
          VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY || '',
          VAPID_SUBJECT: process.env.VAPID_SUBJECT || ''
        },
      },
    };
 
    // Se tivermos repositório, configuramos o Continuous Deployment
    if (githubRepoFullName) {
      console.log(`[NetlifyDeployer] Configurando Continuous Deployment para ${githubRepoFullName} (branch: ${branch})`);
      createBody.repo = {
        provider: 'github',
        repo: githubRepoFullName,
        branch: branch,
        cmd: 'npm run build',
        dir: '.next',
        installation_id: githubInstallationId ? parseInt(githubInstallationId) : undefined,
        deploy_key_id: deployKeyId,
      };
    }

    const createRes = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createBody),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      let errData;
      try { errData = JSON.parse(errText); } catch(e) { errData = errText; }
      console.error('[NetlifyDeployer] Erro ao criar site:', errData);
      throw new Error(`Falha ao criar site no Netlify: ${typeof errData === 'object' ? JSON.stringify(errData) : errData}`);
    }

    const site = await createRes.json();
    const siteId = site.id;
    const siteUrl = site.ssl_url || site.url || `https://${siteName}.netlify.app`;

    // BLOQUEIO RECURSAL: Se não tem repo, NÃO fazemos ZIP deploy automático se houver risco de stale build
    // Apenas faremos ZIP deploy se o repositório for omitido E quisermos um deploy rápido (ex: preview temporário)
    // No nosso SaaS, SEMPRE queremos Git para 1:1.
    if (!githubRepoFullName) {
      console.warn('[NetlifyDeployer] Deploy sem GitHub detectado. Fallback ZIP desativado por segurança contra stale builds.');
      // O site foi criado, mas sem conteúdo inicial. O build do Netlify vai falhar ou ficar vazio
      // até que o usuário vincule algo ou dispare um deploy manual.
    }

    return { url: siteUrl, siteId };
  }

  public async setEnvVars(siteId: string, env: Record<string, string>) {
     // Implementação de update de variáveis em sites existentes
     const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ build_settings: { env: { ...env } } })
    });
    if (!response.ok) throw new Error("Falha ao atualizar ENVs");
    return await response.json();
  }

  public async findSiteByRepo(repoFullName: string): Promise<{ siteId?: string }> {
    const res = await fetch('https://api.netlify.com/api/v1/sites', {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    if (!res.ok) return {};
    const sites = await res.json();
    const site = sites.find((s: any) => s.build_settings?.repo_path === repoFullName);
    return { siteId: site?.id };
  }
}
