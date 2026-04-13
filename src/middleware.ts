import { NextRequest, NextResponse } from "next/server";
import { IS_HEADLESS } from "@/lib/config";

export const config = {
  matcher: [
    "/((?!_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

/**
 * ROUTING LOGIC:
 *
 * Case 0: IS_HEADLESS
 *   → Allow all routes. Headless stores manage their own routing.
 * 
 * Case 1: Main domain (seusaas.com or localhost:3000)
 *   → Normal app routes: landing, login, register, dashboard, admin, etc.
 *   → Subdomains on the main domain BLOCKED — redirect to dashboard
 *
 * Case 2: Subdomain of main domain (loja.seusaas.com)
 *   → Redirect to /dashboard with a message: "Add a custom domain to run traffic"
 *   → Subdomains are internal only (used during /store/[subdomain] in admin preview)
 *
 * Case 3: External / custom domain (meuproduto.com.br, etc.)
 *   → Route to store renderer: /store-by-domain (looks up store by custom_domain field)
 */
export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;
  const hostname = req.headers.get("host") || "";

  // ── Case 0.1: API & CORS Bypass (AGRESSIVO) ────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const origin = req.headers.get("origin") || "*";
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Scale-Shop-Api-Key, Accept, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Se for uma loja Headless (deploiada externamente), pulamos toda a lógica de subdomínios do SaaS
  if (IS_HEADLESS) {
    return NextResponse.next();
  }

  const isLocalhost = hostname.includes("localhost");
  const rootDomain = isLocalhost ? "localhost:3000" : (process.env.NEXT_PUBLIC_ROOT_DOMAIN || hostname.replace("www.", ""));
  
  if (process.env.NODE_ENV === "development" || hostname.includes("localhost")) {
    console.log(`[Middleware] Host: ${hostname} | Root: ${rootDomain}`);
  }

  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // ── Case 2: Subdomain Lockdown ──────────────────────────────────────────
  // Bloqueio total de subdomínios públicos (*.scaleshop.click)
  // Isso protege o domínio raiz de denúncias e blacklist.
  const isSubdomainOfRoot =
    hostname !== rootDomain &&
    hostname !== `www.${rootDomain}` &&
    hostname.endsWith(`.${rootDomain}`);

  if (isSubdomainOfRoot) {
    const slug = hostname.replace(`.${rootDomain}`, "");

    // Bypass para Preview Interno Fechado
    const hasPreviewParam = url.searchParams.get("preview") === "true";
    const hasPreviewCookie = req.cookies.has("scale_internal_preview");

    if (hasPreviewParam || hasPreviewCookie) {
      const purePath = url.pathname.endsWith('/') && url.pathname.length > 1 ? url.pathname.slice(0, -1) : url.pathname;
      const isSpecialRoute = 
         purePath === "/checkout" || 
         purePath === "/pix" || 
         purePath === "/checkout/success";

      let response;
      if (isSpecialRoute) {
         response = NextResponse.rewrite(new URL(`${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`, req.url));
      } else {
         response = NextResponse.rewrite(new URL(`/store/${slug}${searchParams.length > 0 ? `?${searchParams}` : ''}`, req.url));
      }

      if (hasPreviewParam && !hasPreviewCookie) {
         // Salva o cookie com durabilidade de 24 horas para o admin ver abas sem o param na URL
         response.cookies.set("scale_internal_preview", "1", { path: "/", maxAge: 86400, httpOnly: true });
      }
      return response;
    }

    // Redireciona Visitantes comuns/curiosos de subdomínios internos para o dashboard com mensagem de bloqueio
    const redirectUrl = new URL(
      `/dashboard?blocked_subdomain=${slug}`,
      `${req.nextUrl.protocol}//${rootDomain}`
    );
    return NextResponse.redirect(redirectUrl);
  }

  // ── Case 3: External custom domain ────────────────────────────────────────
  // Se não for o domínio principal nem um subdomínio bloqueado, tratamos como Custom Domain.
  const isNetlify = hostname.includes("netlify.app");
  const isVercel = hostname.includes("vercel.app");
  const isMainDomain =
    hostname === rootDomain || hostname === `www.${rootDomain}` || isNetlify || isVercel;

  if (!isMainDomain) {
    // Rotas especiais que devem ser servidas no domínio customizado
    const isSpecialRoute = 
      url.pathname === "/checkout" || 
      url.pathname === "/pix" || 
      url.pathname === "/checkout/success";

    if (isSpecialRoute) {
      // Deixa o Next.js renderizar a rota normal (checkout, pix, etc) mantendo o Host
      return NextResponse.next();
    }

    // Rewrite para o renderizador de landing pages de lojas
    return NextResponse.rewrite(
      new URL(`/store-by-domain${path}`, req.url)
    );
  }

  // ── Case 1: Main domain ───────────────────────────────────────────────────
  // Normal Next.js routing for: /, /login, /register, /dashboard, etc.
  
  // Protect /admin from direct access on main domain
  if (url.pathname === "/admin") {
    const isLocalhost = hostname.includes("localhost");
    if (!isLocalhost && !url.searchParams.has("subdomain")) {
       return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}
