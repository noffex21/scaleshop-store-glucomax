import { Octokit } from 'octokit';
import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

export interface DeployOptions {
  storeId: string;
  repoName: string;
  storeData: any;
  subdomain: string;
  isPrivate?: boolean;
}

export class GithubAutomator {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  private async readLocalFile(pathStr: string): Promise<string | Buffer | null> {
    try {
      const fullPath = path.join(process.cwd(), pathStr);
      if (!fs.existsSync(fullPath)) {
        return null;
      }
      return fs.readFileSync(fullPath);
    } catch (error) {
      console.error(`Erro ao ler arquivo local ${pathStr}:`, error);
      return null;
    }
  }

  private sanitizeStoreData(data: any, apiUrl?: string): any {
    if (!data) return data;
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Lista de termos proibidos (Case Insensitive) que disparam o "Secret Scanning" do GitHub
    const sensitiveTerms = [
      'key', 'token', 'secret', 'password', 'auth', 'cred', 'api_key', 'private',
      'nitropag', 'paradise', 'mercadopago', 'mp_', 'sk_', 'pk_', 'live_', 'test_'
    ];
    
    const cleanObject = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          cleanObject(obj[key]);
        } else {
          const lowerKey = key.toLowerCase();
          const value = String(obj[key]);
          const lowerValue = value.toLowerCase();
          
          // Se for uma chave sensível, mas não for um caminho de imagem (contendo /uploads/ ou /images/)
          const isRelativeImage = (lowerValue.startsWith('/uploads/') || lowerValue.startsWith('/images/'));
          const isImageUrl = isRelativeImage || lowerValue.includes('http');
          
          if (isRelativeImage && apiUrl) {
            obj[key] = `${apiUrl}${obj[key]}`;
          }
          
          if (!isImageUrl && (sensitiveTerms.some(term => lowerKey.includes(term)) || 
              (lowerValue.length > 20 && (lowerValue.includes('sk_') || lowerValue.includes('live_'))))) {
            obj[key] = "[REMOVED_FOR_SECURITY]";
          }
        }
      }
    };
    cleanObject(sanitized);
    return sanitized;
  }

  private getAllFilesRecursive(dir: string): string[] {
    const results: string[] = [];
    const rootPath = process.cwd();
    const fullDir = path.join(rootPath, dir);
    
    if (!fs.existsSync(fullDir)) return [];

    const list = fs.readdirSync(fullDir);
    for (const file of list) {
        const relativePath = path.join(dir, file);
        const fullFilePath = path.join(rootPath, relativePath);
        
        if (!fullFilePath.startsWith(rootPath)) continue;

        const stat = fs.statSync(fullFilePath);
        
        if (stat && stat.isDirectory()) {
            // Pular pastas de build e sistema
            if (['node_modules', '.git', '.next', 'dist', 'out', 'build'].includes(file)) continue;
            // Pular pastas de autenticação/refs, APIs Backend e painéis administrativos/SaaS
            if (['refs', 'auth', 'admin', 'dashboard', 'api'].includes(file)) continue;
            
            results.push(...this.getAllFilesRecursive(relativePath));
        } else {
            // Pular logs e arquivos de ambiente locais
            if (file.endsWith('.log') || file.startsWith('.env') || file === '.gitignore') continue;
            results.push(relativePath.replace(/\\/g, '/'));
        }
    }
    return results;
  }

  async deployStore(options: DeployOptions) {
    const { storeId, repoName, storeData, subdomain, isPrivate = false } = options;
    console.log(`[GithubAutomator] 🚀 Iniciando Deploy Inteligente (Trees API) para: ${repoName}`);
    
    try {
      const { data: user } = await this.octokit.rest.users.getAuthenticated();
      const owner = user.login;

      // 1. Garantir existência do repositório
      console.log(`[GithubAutomator] Verificando existência de ${owner}/${repoName}...`);
      let repoExists = false;
      try {
        await this.octokit.rest.repos.get({ owner, repo: repoName });
        repoExists = true;
        console.log(`[GithubAutomator] ℹ️ Repositório ${repoName} já existe.`);
      } catch (e: any) {
        if (e.status === 404) {
          await this.octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            private: isPrivate,
            auto_init: true,
          });
          console.log(`[GithubAutomator] ✅ Repositório ${repoName} CRIADO.`);
          await new Promise(r => setTimeout(r, 1500)); 
        } else {
          throw e;
        }
      }

      // 1.5 Verificar se já tem conteúdo (Smart Push)
      let hasContent = false;
      let defaultBranch = 'main';
      let baseTreeSha: string | undefined;
      
      try {
        const { data: repoInfo } = await this.octokit.rest.repos.get({ owner, repo: repoName });
        defaultBranch = repoInfo.default_branch || 'main';
        
        const { data: refData } = await this.octokit.rest.git.getRef({
          owner, repo: repoName, ref: `heads/${defaultBranch}`
        });
        baseTreeSha = refData.object.sha;
        
        // Verificação de estrutura mínima (check if 'src' or 'package.json' exists in the tree)
        const { data: remoteTree } = await this.octokit.rest.git.getTree({
          owner, repo: repoName, tree_sha: baseTreeSha
        });
        
        const hasProjectStructure = remoteTree.tree.some(item => item.path === 'src' || item.path === 'package.json');
        
        if (hasProjectStructure) {
          hasContent = true;
          console.log(`[GithubAutomator] 🧠 Smart Push Ativado: Estrutura de projeto detectada em ${defaultBranch}.`);
        } else {
          console.log(`[GithubAutomator] ⚠️ Repositório possui conteúdo (ex: README), mas não a estrutura do projeto. Fazendo deploy completo.`);
          // Mantemos hasContent = false para forçar sincronização total
        }
      } catch (e) {
        console.log(`[GithubAutomator] 🆕 Repositório vazio ou novo. Fazendo deploy completo.`);
      }

      // 2. Definir arquivos para o commit
      const baseConfig = ['package.json', 'tsconfig.json', 'next.config.js', 'tailwind.config.js', 'postcss.config.js', '.gitignore'];

      // Arquivos críticos com correções de apiUrl que devem SEMPRE ser atualizados em redeploys
      const criticalFiles = [
        'src/components/checkout/CheckoutClient.tsx',
        'src/components/checkout/PixClient.tsx',
        'src/hooks/useStoreData.ts',
        'src/app/pix/page.tsx',
        'src/app/checkout/page.tsx',
      ];

      let filesToSync: string[] = [];

      if (hasContent) {
        // SMART PUSH: Redeploy apenas com arquivos dinâmicos + críticos (evita 504)
        filesToSync = [...baseConfig, ...criticalFiles];
      } else {
        // Deploy completo inicial: Registra TUDO
        filesToSync = [
          ...baseConfig,
          ...this.getAllFilesRecursive('src'),
          ...this.getAllFilesRecursive('public'),
        ].filter(f => f !== 'src/config/productData.ts' && f !== 'src/lib/config.ts' && f !== 'netlify.toml' && f !== 'vercel.json');
      }

      // 3. Processar arquivos (Otimizado para evitar 504)
      const treeItems: any[] = [];
      if (filesToSync.length > 0) {
        console.log(`[GithubAutomator] 📄 Processando ${filesToSync.length} arquivos (Híbrido)...`);
        
        // Separar arquivos binários de texto para otimizar chamadas de API
        const binaryFiles = filesToSync.filter(f => f.match(/\.(png|jpg|jpeg|gif|ico|webp|woff|woff2|ttf|otf|pdf)$/i));
        const textFiles = filesToSync.filter(f => !binaryFiles.includes(f));

        // A) Processar arquivos de TEXTO (Conteúdo direto no Tree - ultra-rápido)
        for (const pathStr of textFiles) {
          const content = await this.readLocalFile(pathStr);
          if (content) {
            treeItems.push({ path: pathStr, mode: '100644', type: 'blob', content: content.toString() });
          }
        }

        // B) Processar arquivos BINÁRIOS (Blobs necessários em lotes seguros para evitar timeout)
        console.log(`[GithubAutomator] Processando ${binaryFiles.length} arquivos binários em lotes...`);
        const batchSize = 10;
        for (let i = 0; i < binaryFiles.length; i += batchSize) {
          const batch = binaryFiles.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async (pathStr) => {
              const content = await this.readLocalFile(pathStr);
              if (content) {
                const { data: blob } = await this.octokit.rest.git.createBlob({
                  owner, repo: repoName, content: content.toString('base64'), encoding: 'base64'
                });
                return { path: pathStr, mode: '100644', type: 'blob', sha: blob.sha };
              }
              return null;
            })
          );
          treeItems.push(...batchResults.filter(Boolean));
        }
      }

      // B) Arquivos Injetados (Dinâmicos)
      let apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl || apiUrl.includes('localhost')) {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'scaleoficial.site';
        apiUrl = `https://${rootDomain}`;
      }
      if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);

      const sanitizedData = { ...this.sanitizeStoreData(storeData, apiUrl), isPlaceholder: false };
      const productDataContent = `export const PRODUCT_DATA = ${JSON.stringify(sanitizedData, null, 2)};\nexport default PRODUCT_DATA;`;
      treeItems.push({ path: 'src/config/productData.ts', mode: '100644', type: 'blob', content: productDataContent });

      const configContent = `// scale_shop_injected_config\nexport const INJECTED_STORE_ID = "${storeId}"; \nexport const INJECTED_API_URL = "${apiUrl}";\nexport const INJECTED_SUBDOMAIN = "${subdomain}";\nexport const IS_HEADLESS = true;\n`;
      treeItems.push({ path: 'src/lib/config.ts', mode: '100644', type: 'blob', content: configContent });

      // C) Infrastructure Config (Netlify & Vercel Proxies)
      treeItems.push({
        path: 'netlify.toml',
        mode: '100644',
        type: 'blob',
        content: `[build]\n  command = "npm run build"\n  publish = ".next"\n\n[[plugins]]\n  package = "@netlify/plugin-nextjs"\n\n[[redirects]]\n  from = "/api/*"\n  to = "${apiUrl}/api/:splat"\n  status = 200\n  force = true`
      });

      treeItems.push({
        path: 'vercel.json',
        mode: '100644',
        type: 'blob',
        content: JSON.stringify({
          rewrites: [
            {
              source: "/api/:path*",
              destination: `${apiUrl}/api/:path*`
            }
          ]
        }, null, 2)
      });

      // 4. Executar o Commit via Trees API
      console.log(`[GithubAutomator] 📦 Criando estrutura de commit (${treeItems.length} itens)...`);
      
      // IV. Criar a nova Tree
      const { data: newTree } = await this.octokit.rest.git.createTree({
        owner, repo: repoName,
        tree: treeItems,
        base_tree: baseTreeSha
      });

      // V. Criar o Commit
      const { data: newCommit } = await this.octokit.rest.git.createCommit({
        owner, repo: repoName,
        message: `Deployment ScaleShop Headless - ${new Date().toISOString()}`,
        tree: newTree.sha,
        parents: baseTreeSha ? [baseTreeSha] : []
      });

      // VI. Atualizar ou Criar a Referência (Branch)
      if (baseTreeSha) {
        console.log(`[GithubAutomator] Atualizando referência existente: heads/${defaultBranch}`);
        await this.octokit.rest.git.updateRef({
          owner, repo: repoName,
          ref: `heads/${defaultBranch}`,
          sha: newCommit.sha,
          force: true
        });
      } else {
        console.log(`[GithubAutomator] Criando nova referência: refs/heads/${defaultBranch}`);
        await this.octokit.rest.git.createRef({
          owner, repo: repoName,
          ref: `refs/heads/${defaultBranch}`,
          sha: newCommit.sha
        });
      }

      return { 
        success: true, 
        url: `https://github.com/${owner}/${repoName}`,
        repoFullName: `${owner}/${repoName}`,
        defaultBranch: defaultBranch
      };
    } catch (error: any) {
      console.error("[GithubAutomator] Erro fatal no deployStore:", error);
      throw error;
    }
  }


}
