![ParseForge Banner](https://github.com/ParseForge/apify-assets/blob/ad35ccc13ddd068b9d6cba33f323962e39aed5b2/banner.jpg?raw=true)

# 🧵 Threads Profile Scraper

> 🚀 **Pull public Threads posts from any profile.** Text, post URL, posted date, author handle. Camoufox + residential proxy bypasses Meta anti-bot. No login.

> 🕒 **Last updated:** 2026-05-01 · **📊 7 fields** per post · **🧵 200M+ monthly users** · **📱 Meta-owned platform** · **🦊 Camoufox bypass**

The **Threads Profile Scraper** visits public Threads profiles using a Camoufox browser with residential proxy rotation and returns each post's text, post URL, post code, posted timestamp, profile URL, and author handle. Aggressive scrolling captures up to 25 posts per profile and the Actor walks multiple usernames in sequence to reach 100+ posts per run.

Threads has crossed 200 million monthly active users since launch and is Meta's competitor to X. It is increasingly the public posting surface for tech founders, journalists, and creators. Anonymous HTTP scraping returns only the SPA shell because Meta's anti-bot fingerprints the TLS handshake. This Actor uses Camoufox to mimic a real browser and serves the SSR-rendered profile feed.

| 🎯 Target Audience | 💡 Primary Use Cases |
|---|---|
| Social listening teams, brand monitoring, journalists, marketers, researchers | Social listening, influencer monitoring, trend research, content discovery |

---

## 📋 What the Threads Profile Scraper does

Three filtering workflows in a single run:

- 👤 **Multi-profile fanout.** Submit an array of usernames and the Actor visits each profile.
- 📜 **Aggressive scroll.** Up to 15 scroll rounds per profile loads more posts beyond the first viewport.
- 🛡️ **Anti-bot bypass.** Camoufox `headless: virtual` plus residential proxy serves the real SSR feed.

Each row reports the username, post short code (extracted from the post URL), full post URL, post text up to 1500 characters, posted timestamp from the `<time>` element, profile URL, and a scrape timestamp.

> 💡 **Why it matters:** Threads is now where many tech and media voices post first. Brand teams need to track mentions there, journalists watch it for breaking takes, and marketers measure influencer reach. The HTTP layer alone returns nothing useful, but a properly-fingerprinted browser session can read the public feed.

---

## 🎬 Full Demo

_🚧 Coming soon: a 3-minute walkthrough showing how to go from sign-up to a downloaded dataset._

---

## ⚙️ Input

<table>
<thead>
<tr><th>Input</th><th>Type</th><th>Default</th><th>Behavior</th></tr>
</thead>
<tbody>
<tr><td><code>maxItems</code></td><td>integer</td><td><code>10</code></td><td>Posts to return. Free plan caps at 10, paid plan at 1,000,000.</td></tr>
<tr><td><code>usernames</code></td><td>array of strings</td><td>14 default popular usernames</td><td>Threads usernames without the <code>@</code>.</td></tr>
<tr><td><code>proxyConfiguration</code></td><td>object</td><td>Apify residential, US</td><td>Proxy used for the Camoufox session.</td></tr>
</tbody>
</table>

**Example: 100 posts across 14 popular usernames.**

```json
{
    "maxItems": 100,
    "usernames": [
        "zuck", "mosseri", "openai", "mkbhd", "apify",
        "instagram", "threads", "nytimes", "cnn", "theverge",
        "techcrunch", "wired", "garyvee", "sahilbloom"
    ]
}
```

**Example: track a single brand handle.**

```json
{
    "maxItems": 25,
    "usernames": ["apify"]
}
```

> ⚠️ **Good to Know:** Threads enforces strong anti-bot, so this Actor uses Camoufox with `headless: virtual` and Apify residential proxy. Cold-start is around 4-6 seconds, then each profile takes 6-10 seconds depending on scroll depth.

---

## 📊 Output

Each post record contains **7 fields**. Download as CSV, Excel, JSON, or XML.

### 🧾 Schema

| Field | Type | Example |
|---|---|---|
| 👤 `username` | string | `"zuck"` |
| 🆔 `postCode` | string | `"DXt5n9UlLl-"` |
| 🔗 `postUrl` | string | `"https://www.threads.com/@zuck/post/DXt5n9UlLl-"` |
| 💬 `text` | string | `"As part of our philanthropic work to help cure all diseases..."` |
| 📅 `postedAt` | ISO 8601 \| null | `"2026-04-29T13:26:07.000Z"` |
| 🔗 `profileUrl` | string | `"https://www.threads.net/@zuck"` |
| 🕒 `scrapedAt` | ISO 8601 | `"2026-05-01T01:55:30.000Z"` |

### 📦 Sample records

<details>
<summary><strong>👤 Mark Zuckerberg announcing a Biohub initiative</strong></summary>

```json
{
    "username": "zuck",
    "postCode": "DXt5n9UlLl-",
    "postUrl": "https://www.threads.com/@zuck/post/DXt5n9UlLl-",
    "text": "As part of our philanthropic work to help cure all diseases, our team @biohub is announcing the Virtual Biology Initiative -- a new effort to build the imaging tools, molecular tools, and open data infrastructure needed to build AI models that can reason about cells.\n1.2K\n256\n102\n36",
    "postedAt": "2026-04-29T13:26:07.000Z",
    "profileUrl": "https://www.threads.net/@zuck"
}
```

</details>

<details>
<summary><strong>🎙️ Tech reporter sharing a quick take</strong></summary>

```json
{
    "username": "mkbhd",
    "postCode": "DZxCv9VLk9",
    "postUrl": "https://www.threads.com/@mkbhd/post/DZxCv9VLk9",
    "text": "Quick take: the new haptics in this phone are the best I've felt in years.\n820\n45\n29\n12",
    "postedAt": "2026-04-30T14:11:02.000Z",
    "profileUrl": "https://www.threads.net/@mkbhd"
}
```

</details>

<details>
<summary><strong>📰 News org account with a published story link</strong></summary>

```json
{
    "username": "nytimes",
    "postCode": "DYa1nPlLm4",
    "postUrl": "https://www.threads.com/@nytimes/post/DYa1nPlLm4",
    "text": "Breaking: federal judge rules on data-broker case. Story: nytimes.com/...\n2.4K\n340\n812\n98",
    "postedAt": "2026-04-30T18:00:00.000Z",
    "profileUrl": "https://www.threads.net/@nytimes"
}
```

</details>

---

## ✨ Why choose this Actor

| | Capability |
|---|---|
| 🔓 | **No login required.** Public profile feed served via Camoufox session. |
| 🛡️ | **Anti-bot bypass.** Camoufox + residential proxy handles Meta's TLS fingerprinting. |
| 📜 | **Scroll for more.** Up to 15 scroll rounds per profile loads beyond the first viewport. |
| 👤 | **Multi-profile fanout.** Submit many usernames, get aggregated results in one run. |
| 📅 | **Exact timestamps.** Posted dates pulled from the `<time>` element, not relative strings. |
| 🆔 | **Stable post codes.** Each post carries the canonical short code Meta uses internally. |
| 🚀 | **Sub-2-minute runs.** Typical 100-post pulls finish in 80 to 120 seconds. |

> 📊 In a single 80-second run the Actor returned 71 posts across 14 popular Threads profiles.

---

## 📈 How it compares to alternatives

| Approach | Cost | Coverage | Refresh | Filters | Setup |
|---|---|---|---|---|---|
| Direct HTTP scraping | Free | Returns SPA shell only | n/a | None | n/a |
| Manual scroll + copy | Free | One profile at a time | Live | None | Hours |
| Paid social-listening tools | $$$ subscription | Aggregated | Daily | Built-in | Account setup |
| **⭐ Threads Profile Scraper** *(this Actor)* | Pay-per-event | Multi-profile, scrolled | Live | Username list | None |

Same SSR feed Meta serves to any logged-out browser, accessible via Camoufox session.

---

## 🚀 How to use

1. 🆓 **Create a free Apify account.** [Sign up here](https://console.apify.com/sign-up?fpr=vmoqkp) and get $5 in free credit.
2. 🔍 **Open the Actor.** Search for "Threads Profile" in the Apify Store.
3. ⚙️ **Add usernames.** One or many Threads handles without the `@`.
4. ▶️ **Click Start.** A 100-post run typically completes in 80 to 120 seconds.
5. 📥 **Download.** Export as CSV, Excel, JSON, or XML.

> ⏱️ Total time from sign-up to first dataset: under five minutes.

---

## 💼 Business use cases

<table>
<tr>
<td width="50%">

### 🛡️ Brand monitoring
- Track mentions of your brand across creator profiles
- Surface emerging conversations about your products
- Detect crisis signals early in news-org accounts
- Monitor competitor announcements posted on Threads

</td>
<td width="50%">

### 📊 Social listening
- Aggregate posts from a topic-relevant set of profiles
- Track tone shifts in influencer posts over time
- Pair Threads activity with X cross-posting analysis
- Build alert feeds for high-signal handles

</td>
</tr>
<tr>
<td width="50%">

### 📰 Journalism
- Capture quotes from public figures on Threads
- Verify timestamps with the canonical post URL
- Track founder commentary on their own products
- Build evidence trails citing post short codes

</td>
<td width="50%">

### 📈 Marketing intel
- Benchmark posting cadence of competitor brand accounts
- Mine top-performing post text for inspiration
- Track engagement signals embedded in post text
- Identify rising voices in your category

</td>
</tr>
</table>

---

## 🌟 Beyond business use cases

Data like this powers more than commercial workflows. The same structured records support research, education, civic projects, and personal initiatives.

<table>
<tr>
<td width="50%">

### 🎓 Research and academia
- Empirical datasets for papers, thesis work, and coursework
- Longitudinal studies tracking changes across snapshots
- Reproducible research with cited, versioned data pulls
- Classroom exercises on data analysis and ethical scraping

</td>
<td width="50%">

### 🎨 Personal and creative
- Side projects, portfolio demos, and indie app launches
- Data visualizations, dashboards, and infographics
- Content research for bloggers, YouTubers, and podcasters
- Hobbyist collections and personal trackers

</td>
</tr>
<tr>
<td width="50%">

### 🤝 Non-profit and civic
- Transparency reporting and accountability projects
- Advocacy campaigns backed by public-interest data
- Community-run databases for local issues
- Investigative journalism on public records

</td>
<td width="50%">

### 🧪 Experimentation
- Prototype AI and machine-learning pipelines with real data
- Validate product-market hypotheses before engineering spend
- Train small domain-specific models on niche corpora
- Test dashboard concepts with live input

</td>
</tr>
</table>

---

## 🔌 Automating Threads Profile Scraper

Run this Actor on a schedule, from your codebase, or inside another tool:

- **Node.js** SDK: see [Apify JavaScript client](https://docs.apify.com/api/client/js/) for programmatic runs.
- **Python** SDK: see [Apify Python client](https://docs.apify.com/api/client/python/) for the same flow in Python.
- **HTTP API**: see [Apify API docs](https://docs.apify.com/api/v2) for raw REST integration.

Schedule daily runs from the Apify Console to track new posts on a list of handles. Pipe results into Slack, Google Sheets, S3, BigQuery, or your own webhook with the built-in [integrations](https://docs.apify.com/platform/integrations).

---

## ❓ Frequently Asked Questions

<details>
<summary><strong>👤 What usernames are supported?</strong></summary>

Any public Threads handle without the `@` prefix. Private accounts return zero rows because the public profile feed is empty for them.

</details>

<details>
<summary><strong>📜 How many posts per profile?</strong></summary>

Threads typically loads 5-25 posts per profile in a single browser session, depending on profile activity. The Actor scrolls aggressively to reach the upper end.

</details>

<details>
<summary><strong>🛡️ Why does this need Camoufox?</strong></summary>

Meta fingerprints TLS handshakes, browser-API surfaces, and HTTP/2 frame ordering. Camoufox is built specifically to defeat that detection. Standard `fetch` or Playwright Chromium gets blocked.

</details>

<details>
<summary><strong>🔢 What does the postCode field contain?</strong></summary>

The 11-character base64-style ID Meta uses internally for each post. Stable, unique, and works as a primary key across runs.

</details>

<details>
<summary><strong>📅 Can I get likes, replies, and reposts?</strong></summary>

The post text often ends with engagement counters like `1.2K\n256\n102\n36` (likes, replies, reposts, quotes). v1 leaves them embedded in the text; structured parsing is on the roadmap.

</details>

<details>
<summary><strong>🔍 Can I search by hashtag or keyword?</strong></summary>

Currently profile-scoped only. Hashtag and keyword search require a different Threads URL pattern and are out of scope for v1.

</details>

<details>
<summary><strong>📦 How many posts can I pull?</strong></summary>

Free plan caps at 10. Paid plans up to 1,000,000. Per-run the multi-profile fanout reaches 70-100 posts depending on profile activity.

</details>

<details>
<summary><strong>🛡️ Will this break when Meta updates their site?</strong></summary>

Possibly. Camoufox keeps up with browser fingerprints, but Meta occasionally changes the post DOM selectors. The Actor monitors for selector drift and gets updated when needed.

</details>

<details>
<summary><strong>💼 Can I use this for commercial work?</strong></summary>

Yes for permissible purposes. The Actor reads only what Threads serves to any logged-out browser. Always honor Meta's terms when republishing post text.

</details>

<details>
<summary><strong>💳 Do I need a paid Apify plan?</strong></summary>

The free plan returns up to 10 posts per run. Paid plans return up to 1,000,000.

</details>

<details>
<summary><strong>⚠️ What if a profile returns zero posts?</strong></summary>

Most often it's a private account or a banned handle. Verify by visiting the profile in a logged-out browser. [Open a contact form](https://tally.so/r/BzdKgA) and include the run URL if a public account returns empty.

</details>

<details>
<summary><strong>⚖️ Is this legal?</strong></summary>

The Actor reads only data Meta publicly serves to every browser visitor. Posting public content is the explicit purpose of the platform. Always verify your specific use case complies with Meta's terms and your local law.

</details>

---

## 🔌 Integrate with any app

- [**Make**](https://apify.com/integrations/make) - drop run results into 1,800+ apps.
- [**Zapier**](https://apify.com/integrations/zapier) - trigger automations off completed runs.
- [**Slack**](https://apify.com/integrations/slack) - post run summaries to a channel.
- [**Google Sheets**](https://apify.com/integrations/google-sheets) - sync each run into a spreadsheet.
- [**Webhooks**](https://docs.apify.com/platform/integrations/webhooks) - notify your own services on run finish.
- [**Airbyte**](https://apify.com/integrations/airbyte) - load runs into Snowflake, BigQuery, or Postgres.

---

## 🔗 Recommended Actors

- [**🔍 Skip Trace People Search**](https://apify.com/parseforge/skip-trace-scraper) - lookup people behind handles you find.
- [**🅱️ Bing Search Scraper**](https://apify.com/parseforge/bing-search-scraper) - run web searches on viral Threads posts.
- [**🦆 DuckDuckGo Search Scraper**](https://apify.com/parseforge/duckduckgo-search-scraper) - alternative SERP signal alongside Threads activity.
- [**📚 Wikipedia Pageviews Scraper**](https://apify.com/parseforge/wikipedia-pageviews-scraper) - cross-reference Threads spikes with public-interest data.
- [**🐙 GitHub Trending Repos Scraper**](https://apify.com/parseforge/github-trending-scraper) - capture the developer-attention layer next to Threads activity.

> 💡 **Pro Tip:** browse the complete [ParseForge collection](https://apify.com/parseforge) for more pre-built scrapers and data tools.

---

**🆘 Need Help?** [**Open our contact form**](https://tally.so/r/BzdKgA) and we'll route the question to the right person.

---

> Threads is a registered trademark of Meta Platforms, Inc. This Actor is not affiliated with or endorsed by Meta. It reads only the public profile feed every logged-out browser can access.
