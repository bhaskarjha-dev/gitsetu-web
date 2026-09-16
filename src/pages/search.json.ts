export const GET = async () => {
  try {
    // Use Vite's import.meta.glob to read all markdown files at build-time.
    const allDocs = import.meta.glob('./docs/**/*.md', { eager: true });
    // Use '?raw' to get the raw uncompiled markdown text since rawContent() was removed in Astro 5+
    const rawDocs = import.meta.glob('./docs/**/*.md', { query: '?raw', import: 'default', eager: true });
    
    const results = Object.keys(allDocs).map((path) => {
      const doc = allDocs[path] as any;
      const rawContent = (rawDocs[path] as string) || '';
      
      const normPath = path.replace(/\\/g, '/');

      // Convert relative file path to an absolute URL path.
      // e.g. './docs/getting-started/quickstart.md' -> '/docs/getting-started/quickstart'
      let url = normPath.replace('./docs/', '/docs/').replace('.md', '');
      if (url === '/docs/index') url = '/docs';

      const relPath = normPath.replace('./docs/', '').replace('.md', '');
      const slug = relPath === 'index' ? 'index' : relPath;
      
      // Enhanced markdown and HTML stripping for clean search index payload
      const cleanContent = rawContent
        .replace(/---[\s\S]*?---/, '') // Strip frontmatter
        .replace(/<[^>]*>?/gm, '')     // Strip HTML tags
        .replace(/!\[.*?\]\(.*?\)/g, '') // Strip images
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract text from links
        .replace(/[#*`_~=|>]/g, '')    // Strip basic markdown syntax
        .replace(/\s+/g, ' ')          // Collapse whitespace
        .trim();

      const category = doc.frontmatter?.category || (slug.includes('/') ? slug.split('/')[0] : 'overview');
      const description = (doc.frontmatter?.description || cleanContent.slice(0, 160)).trim();

      // Semantic keyword mapping to supercharge developer search recall for CLI flags, platforms, and concepts
      const keywordMap: Record<string, string> = {
        'getting-started/installation': 'winget scoop homebrew brew nix flake aur yay pacman npx powershell curl bash git for windows prerequisite setup package managers',
        'getting-started/quickstart': 'setup init first profile work personal tutorial fast start onboarding three minutes',
        'getting-started/introduction': 'prerequisites zero trust zero dependencies architecture baseline',
        'core-engines/identity-routing': 'includeif conditional routing gitdir directory boundary longest match case insensitive windows msys cygwin macos coexistence manual',
        'core-engines/ssh-orchestrator': 'ssh config include ed25519 identityfile multiple keys host alias isolation adr 0002',
        'core-engines/credential-broker': 'credential helper pat git token os keychain secret-tool credential manager windows gcm personal access token',
        'core-engines/precommit-guard': 'pre-commit hook guard fail closed email mismatch author commit blocking gitsetu guard',
        'guides/hardware-keys': 'yubikey fido2 ed25519-sk security key gpg commit signing hardware token touch verification',
        'guides/wsl-integration': 'wsl wsl2 windows subsystem linux crossover isolation ssh agent interop',
        'guides/vault-backups': 'vault backup restore encrypted aes-256 openssl export migration envelope encryption',
        'guides/shell-prompt': 'starship oh-my-zsh bash prompt prompt integration status active identity zsh fish',
        'reference/faq': 'manual includeif migration coexistence existing ssh keys preserve overwrite backup clobber safety non-destructive',
        'reference/cli-commands': 'commands options flags setup init status doctor guard vault remove force non-interactive',
        'reference/troubleshooting': 'debug doctor ssh permission denied git config check error fix common issues',
        'reference/manual-qa': 'sandbox testing matrix vm clean-room audit test playbook assertions',
        'overview/comparisons': 'gitego karn gh cli gcm git credential manager comparison benchmark vs alternatives matrix'
      };

      const semanticKeywords = keywordMap[slug] || '';
      const enrichedContent = semanticKeywords ? `${cleanContent} [Keywords: ${semanticKeywords}]` : cleanContent;

      return {
        id: slug,
        title: doc.frontmatter?.title || url,
        category: category,
        slug: slug,
        url: url,
        description: description,
        content: enrichedContent
      };
    });

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache strongly as the index won't change between builds
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
