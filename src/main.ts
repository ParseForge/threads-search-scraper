import { Actor, log } from 'apify';
import c from 'chalk';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Camoufox } = require('camoufox');

interface Input {
    maxItems?: number;
    usernames?: string[];
    proxyConfiguration?: any;
}

const STARTUP = ['🧵 Pulling Threads profiles…', '🐦 Crawling Meta Threads…', '📱 Reading the latest posts…'];
const DONE = ['🎉 Threads delivered.', '✅ Posts ready.', '🚀 Feed captured.'];
const pick = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)] ?? arr[0]!;

function sleep(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

await Actor.init();
const input = (await Actor.getInput<Input>()) ?? {};
const userIsPaying = Boolean(Actor.getEnv()?.userIsPaying);
const isPayPerEvent = Actor.getChargingManager().getPricingInfo().isPayPerEvent;

let effectiveMaxItems = input.maxItems ?? 10;
if (!userIsPaying) {
    if (!effectiveMaxItems || effectiveMaxItems > 10) {
        effectiveMaxItems = 10;
        log.warning([
            '',
            `${c.dim('        *  .  ✦        .    *       .')}`,
            `${c.dim('  .        *')}    🛰️  ${c.dim('.        *   .    ✦')}`,
            `${c.dim('     ✦  .        .       *        .')}`,
            '',
            `${c.yellow("  You're on a free plan — limited to 10 items.")}`,
            `${c.cyan('  Upgrade to a paid plan for up to 1,000,000 items.')}`,
            '',
            `  ✦ ${c.green.underline('https://console.apify.com/sign-up?fpr=vmoqkp')}`,
            '',
        ].join('\n'));
    }
}

const usernames = (input.usernames && input.usernames.length > 0) ? input.usernames : ['zuck'];

console.log(c.cyan('\n🛰️  Arguments:'));
console.log(c.green(`   🟩 usernames : ${usernames.join(', ')}`));
console.log(c.green(`   🟩 maxItems : ${effectiveMaxItems}`));
console.log('');
console.log(c.magenta(`📬 ${pick(STARTUP)}\n`));

const proxy = await Actor.createProxyConfiguration(input.proxyConfiguration ?? {
    useApifyProxy: true,
    apifyProxyGroups: ['RESIDENTIAL'],
    apifyProxyCountry: 'US',
});
const proxyUrl = proxy ? await proxy.newUrl(`session_${Date.now()}`) : undefined;

log.info('🦊 Spawning Camoufox…');
const browser = await Camoufox({
    headless: 'virtual',
    proxy: proxyUrl ? { server: proxyUrl } : undefined,
    humanize: true,
    geoip: true,
});
const context = browser.contexts?.()[0] || browser;
const page = context.pages?.()[0] || (await browser.newPage());

const captured: any[] = [];
page.on('response', async (response: any) => {
    try {
        const url = response.url();
        if (url.includes('/api/graphql') || url.includes('barcelona_search') || url.includes('barcelona_profile')) {
            const body = await response.text().catch(() => null);
            if (body && body.length > 100) {
                captured.push({ url, body });
            }
        }
    } catch {}
});

async function fetchProfile(username: string): Promise<any[]> {
    const url = `https://www.threads.net/@${username}`;
    log.info(`📡 ${url}`);
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await sleep(5000);
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

        const posts = await page.evaluate(() => {
            const out: any[] = [];
            const articles = document.querySelectorAll('div[data-pressable-container="true"], article, div[role="article"]');
            articles.forEach((el) => {
                const text = (el as HTMLElement).innerText?.trim() ?? '';
                if (!text || text.length < 5) return;
                const link = el.querySelector('a[href*="/post/"]') as HTMLAnchorElement | null;
                const href = link?.href ?? null;
                const time = el.querySelector('time')?.getAttribute('datetime') ?? null;
                out.push({ text: text.slice(0, 1500), url: href, postedAt: time });
            });
            return out;
        });
        return posts;
    } catch (err: any) {
        log.warning(`   ${username}: ${err.message}`);
        return [];
    }
}

let pushed = 0;
try {
    for (const username of usernames) {
        if (pushed >= effectiveMaxItems) break;
        const posts = await fetchProfile(username);
        log.info(`   ${posts.length} posts found for @${username}`);
        for (const p of posts) {
            if (pushed >= effectiveMaxItems) break;
            const codeMatch = p.url ? p.url.match(/\/post\/([^/?#]+)/) : null;
            const record = {
                username,
                postCode: codeMatch ? codeMatch[1] : null,
                postUrl: p.url,
                text: p.text,
                postedAt: p.postedAt,
                profileUrl: `https://www.threads.net/@${username}`,
                scrapedAt: new Date().toISOString(),
            };
            if (isPayPerEvent) await Actor.pushData([record], 'result-item');
            else await Actor.pushData([record]);
            pushed += 1;
        }
        await sleep(1500);
    }
} catch (err: any) {
    log.error(err.message);
    await Actor.pushData([{ error: err.message }]);
}

try { await browser.close(); } catch {}

if (pushed === 0) await Actor.pushData([{ error: 'No posts extracted.' }]);
log.info(c.green(`✅ Pushed ${pushed} posts`));
console.log(c.magenta(`\n${pick(DONE)}`));
await Actor.exit();
