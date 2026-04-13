export class VercelDeployer {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public async deployNewStore(
    siteName: string,
    apiKey: string,
    githubRepoFullName: string
  ): Promise<{ url: string; projectId: string }> {
    console.log(`[VercelDeployer] Criando projeto ${siteName} na Vercel...`);
    
    // 1. Criar o Projeto vinculado ao GitHub
    const createProjectRes = await fetch('https://api.vercel.com/v9/projects', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: siteName,
        framework: 'nextjs',
        gitRepository: {
          type: 'github',
          repo: githubRepoFullName,
        },
      }),
    });

    if (!createProjectRes.ok) {
      const errData = await createProjectRes.text();
      console.error('[VercelDeployer] Erro ao criar projeto na Vercel:', errData);
      throw new Error(`Falha ao criar projeto na Vercel: ${errData}`);
    }

    const projectData = await createProjectRes.json();
    const projectId = projectData.id;

    // A Vercel adiciona automaticamente um domínio no formato nome-do-projeto.vercel.app
    // Mas precisamos iterar sobre os domínios para encontrar o oficial
    let siteUrl = `https://${siteName}.vercel.app`;
    if (projectData.targets?.production?.url) {
      siteUrl = `https://${projectData.targets.production.url}`;
    }

    // 2. Injetar Variáveis de Ambiente Essenciais
    const envVars = [
      { key: 'NEXT_PUBLIC_SCALE_SHOP_API_KEY', value: apiKey, target: ['production', 'preview', 'development'] },
      { key: 'NEXT_PUBLIC_API_URL', value: process.env.NEXT_PUBLIC_API_URL || 'https://scaleoficial.site', target: ['production', 'preview', 'development'] },
      { key: 'NEXT_PUBLIC_ROOT_DOMAIN', value: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'scaleoficial.site', target: ['production', 'preview', 'development'] },
      { key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL || '', target: ['production', 'preview', 'development'] },
      { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', target: ['production', 'preview', 'development'] },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', value: process.env.SUPABASE_SERVICE_ROLE_KEY || '', target: ['production', 'preview', 'development'] },
      { key: 'NEXT_PUBLIC_VAPID_PUBLIC_KEY', value: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '', target: ['production', 'preview', 'development'] },
      { key: 'VAPID_PRIVATE_KEY', value: process.env.VAPID_PRIVATE_KEY || '', target: ['production', 'preview', 'development'] },
      { key: 'VAPID_SUBJECT', value: process.env.VAPID_SUBJECT || '', target: ['production', 'preview', 'development'] },
    ];

    await this.setEnvVars(projectId, envVars);

    console.log(`[VercelDeployer] Projeto ${siteName} configurado com sucesso!`);
    
    return { url: siteUrl, projectId };
  }

  private async setEnvVars(projectId: string, envs: Array<{key: string, value: string, target: string[]}>) {
    if (!envs || envs.length === 0) return;

    console.log(`[VercelDeployer] Injetando ${envs.length} variáveis de ambiente no projeto ${projectId}...`);

    for (const env of envs) {
      const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env?upsert=true`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: env.key,
          value: env.value,
          target: env.target,
          type: 'plain'
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[VercelDeployer] Falha ao injetar ENV ${env.key}:`, errText);
        // Não jogamos erro aqui para tentar injetar as próximas, 
        // a menos que seja algo crítico
      }
    }
  }
}
