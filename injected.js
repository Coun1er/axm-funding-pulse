(() => {
  "use strict";

  // ── CSS ──────────────────────────────────────────────────────────────────
  function ensureStyle() {
    if (document.getElementById("axiom-funding-style")) return;
    const style = document.createElement("style");
    style.id = "axiom-funding-style";
    style.textContent = `
      .axf-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 5px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 500;
        color: #94a3b8;
        border: 1px solid rgba(148,163,184,0.20);
        background: var(--color-backgroundSecondary, rgba(30,32,40,0.8));
        white-space: nowrap;
        pointer-events: none;
        flex-shrink: 0;
      }
      .axf-badge-tracker {
        border-color: rgba(125,211,252,0.25);
        background: rgba(125,211,252,0.06);
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // ── Exchange wallet → name map (loaded dynamically from Axiom's bundle) ──
  // Fallback hardcoded map used if dynamic loading fails
  const FALLBACK_MAP = {
    "5Xm6nU1Bi6UewCrhJQFk1CAV97ZJaRiFw4tFNhUbXy3u": "Alameda Research",
    "8SiWXTpcTUovS2LxCvxcPdTnS5f5CCYjzmNRmB1JVEJo": "Alameda Research",
    "7DyZQw3iV5zhHssnNA6Nopi5zc8NGLbYjHMcaok6NN66": "Allbridge",
    "3huamNpghPSPbgQSLX56B18Sj1hq5SE4KGxwTvhwJGnC": "Arkham",
    "43DbAvKxhXh1oSxkJSqGosNw3HpBnmsWiak6tB5wpecN": "Backpack",
    "97UQvPXbadGSsVaGuJCBLRm3Mkm7A5DVJ2HktRzrnDTB": "BC.Game",
    "8YxUm2CgA67gSxu3Vdeij1cEpfbVRurCFHQnUC2sytFz": "Betpanda",
    "7BCp5XUXtKzZWYCvGR2fzFqoyKiJ7ozN8eCEHscpSMnB": "BigONE",
    "2ojv9BAiHUrvsm9gxDe7fJSzbNZSJcxZvf8dqmWGHG8S": "Binance",
    "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9": "Binance",
    "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM": "Binance",
    "6QJzieMYfp7yr3EdrePaQoG3Ghxs2wM98xSLRu8Xh56U": "Binance",
    "3yFwqXBfZY4jBVUafQ1YEXw189y2dN3V5KQq9uzBDy1E": "Binance",
    "53unSgGWqEWANcPYRF35B2Bgf8BkszUtcccKiXwGGLyr": "Binance",
    "8Mm46CsqxiyAputDUp2cXHg41HE3BfynTeMBDwzrMZQH": "Bithumb",
    "7RmkMNQerKaVioRnmqZsHM5Gm8F3gngQG8umLNoK97q4": "Bitrue",
    "9D8xSHWqF9NJWqCtn3rNxYEox63aCbWxYzTMfMur7Cc9": "Bitstamp",
    "2h8JJq1kAsJvKYVrsEqwhQTcy99p465esHUFcJA94QY2": "Bitvavo",
    "8vfXiUAfrpR8N2pceMc1ttruMS6AUurcjPXJkXuuNr9c": "Bitvavo",
    "5dSArCafNYy3AhWYMAY7VT7greBYzsJ4TDfU7jyESBB8": "Bitvavo",
    "7ks326H4LbMVaUC8nW5FpC5EoAf5eK5pf4Dsx4HDQLpq": "Bloxroute",
    "2Kr5MG6mkBXWUGXkYVJxmgSR5sLaFmkkHGEQDUujmNKS": "Blockchain.com",
    "94xmX5J92nZLanLvRstmxhgiS8kN8SVfFQ2zPKYB3Ynb": "Blofin",
    "3B7XAQrLoEMDEGvX8569F9GRb9PcXXocJmj5wvhhei9z": "BtcTurk",
    "42brAgAVNzMBP7aaktPvAmBSPEkehnFQejiZc53EpJFd": "Bybit",
    "5SDrsMNTYdhmApjfqYHDvjoW92f2S42vcc7zNDVcQ9Ej": "Ceffu",
    "28nYGHJyUVcVdxZtzKByBXEj127XnrUkrE3VaGuWj1ZU": "Ceffu",
    "6qbzTgBcu7xtoQBrhnPdfCbDxKhWpDhn4vtc3Cbse75W": "Chainup Custody",
    "2jwP4cuugAAYiGMjVuqvwaRS2Axe6H6GvXv3PxMPQNeC": "Changenow",
    "6dUaYX9Z6aQPY66BgD4yzu1saifGAZLrhQqF9BugJxJ1": "Cobo.com",
    "9obNtb5GyUegcs3a1CbBkLuc5hEWynWfJC6gjz5uWQkE": "Coinbase",
    "2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm": "Coinbase",
    "59L2oxymiQQ9Hvhh92nt8Y7nDYjsauFkdb3SybdnsG6h": "Coinbase",
    "3qP77PzrHxSrW1S8dH4Ss1dmpJDHpC6ATVgwy5FmXDEf": "Coinbase",
    "85cPov8nuRCkJ88VNMcHaHZ26Ux85PbSrHW4jg7izW4h": "Coinbase",
    "146yGthSmnTPuCo6Zfbmr56YbAyWZ3rzAhRcT7tTF5ha": "Coinbase",
    "4NyK1AdJBNbgaJ9EsKz3J4rfeHsuYdjkTPg3JaNdLeFw": "Coinbase",
    "5g7yNHyGLJ7fiQ9SN9mf47opDnMjc585kqXWt6d7aBWs": "Coinbase",
    "4pHKEisSmAr5CSump4dJnTJgG6eugmtieXcUxDBcQcG5": "Coinbase",
    "2PoMLnppbphUWkNReF15BJ4a6c4B348GnStSEv9tFsY1": "Coinbase",
    "6LzKPJ1Y6wdYTLfGDxe9WwoKpwAVMLHwXxmQpRgdD6ng": "Coinbase",
    "8mQnMuApYmNouGvj9wVL2Sh21DFsrzb3sbbFL3rUHXr5": "Coinbase",
    "3vxheE5C46XzK4XftziRhwAf8QAfipD7HXXWj25mgkom": "Coinbase",
    "4GC3a1RkRXx5shwGP8pTY6cxXgSWkbfc66vM53a6qSKj": "CoinSpot",
    "4DgunMfBb19GaMZ1Z48oqcymZ4eBA4v5SUdRnapzj66G": "Coinsquare",
    "8JWVtS21nfQddQR5thDQ8bL5ykHKAGLcYSdR3uQqBvoG": "CoinW",
    "6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy": "Crypto.com",
    "22Wnk8PwyWZV7BfkZGJEKT9jGGdtvu7xY6EXeRh7zkBa": "Crypto.com",
    "2snHHreXbpJ7UwZxPe37gnUNf7Wx7wv6UKDSR2JckKuS": "Debridge",
    "3XxnAURKbUfUc881Rw5tsXCkhRUHM5uDiEy7KSt1G488": "DigiFinex",
    "5kuefsvsowE6Sty2PEGJUjjZ4M9UqezCW1zcx67AjzMX": "Firi",
    "5ndLnEYqSFiA5yUFHo6LVZ1eWc6Rhh11K5CfJNkoHEPs": "Fixedfloat",
    "6b4aypBhH337qSzzkbeoHWzTLt4DjG2aG8GkrrTQJfQA": "FTX",
    "9uyDy9VDBw4K7xoSkhmCAm8NAFCwu4pkF6JeHUCtVKcX": "FTX",
    "78TDoKGTeS7RRoqUrSijS1QVFVmxJvwE2NxYicHFHh3N": "Hotcoin",
    "9cNE6KBg2Xmf34FPMMvzDF8yUHMrgLRzBV3vD7b1JnUS": "Kraken",
    "6LY1JzAFVZsP2a2xKrtU6znQMQ5h4i7tocWdgrkZzkzF": "Kraken",
    "57vSaRTqN9iXaemgh4AoDsZ63mcaoshfMK8NP3Z5QNbs": "Kucoin",
    "8s9j5qUtuE9PGA5s7QeAXEh5oc2UGr71pmJXgyiZMHkt": "LBank",
    "9YFeuz8q9WMSJpeNhNHj6LSbZnQ6BvDt5u9CV2ALhPWv": "Mayan Bridge",
    "5PAhQiYdLBd6SVdjzBQDxUAEFyDdF5ExNPQfcscnPRj5": "MEXC",
    "5F1seMKUqSNhv45f6FhB2cFmgJbk8U1avJw7M6TexUq1": "Moonpay",
    "9un5wqE3q4oCjyrDkwsdD48KteCJitQX5978Vh7KKxHo": "OKX",
    "5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD": "OKX",
    "7UhjbynicBP8rqcobwsAJDfRMjwgHSgdxcYNJmLwxfms": "Ourbit",
    "3pjwKq9yuzpVYfD4h5jMZLLfV8oSd8YiwpoAaB5oZS3H": "Ourbit",
    "8psNvWTrdNTiVRNzAgsou9kETXNJm2SXZyaKuJraVRtf": "Phantom",
    "5HQZd9ovzAF1TLnHRAq1zcSnXC9HAp3EwhoxMHvo8rxB": "Rainbet",
    "3yHvm5kFrEqYURBekXAXEpEWggpb8q51VRWDZtjZRQpT": "Rapira",
    "2hZyBdWzempMnbXoUK4yBGDeYyjd7sVgPM2cxrWFza8p": "Razed",
    "5z7gxL5u4jCW9D6acu28LEw4RKTiBSG1EmXbtCX7efg2": "Revolut",
    "9bc61xemFMSZBsQZp59zQppw3sGXrPhRkxrdVBtip6om": "Robinhood",
    "6brjeZNfSpqjWoo16z1YbywKguAruXZhNz9bJMVZE8pD": "Robinhood",
    "8Tp9fFkZ2KcRBLYDTUNXo98Ez6ojGb6MZEPXfGDdeBzG": "Robinhood",
    "9FtGm6hJULCpA8An4sFg5ysHUExDZBtMeDCxsYnTnWh5": "Robinhood",
    "76iXe9yKFDjGv3HicUVVy8AYxHLC71L1wYa12zaZzHHp": "Shuffle.com",
    "2E1UKoiiZPwsp4vn6tUh5k61kG2UqYpT7oBrFaJUJXXd": "SwissBorg",
    "3Ki4GvAZRTdA8M4CCQL6LwD4BY5dRhMworHmXLVxxY5f": "Tapbit",
    "5cLi5RaZ6MN14rC4KJNygDnenyEyfqQat8Tcm9DfAPo9": "TG.Casino",
    "5NwbN8fCaVED6aHUvAVm5BFi9Kapfvoemw5gvX4Y3PnG": "Upbit",
    "6aGCDGHahjF9uW9qJFJabbyMoEk8STfXgdDpptnUFUcf": "Upbit",
    "2zSrPoPCpJAypmdjmuSwbsx9RAqTRJCiRXCnQkUkN9rj": "Upbit",
    "3oZxURCVerpPDynp5H1b2EWHzqvSbgjtcALcVytynRFK": "Upbit",
    "6DGBBq2JFb3Lt3NWWAE5FC36B9489H6dg6zae9jxLSkf": "Upbit",
    "79xFArDVvZMU7uvLgAPFKB3hT2vUCCoytmxsrxyx5oBJ": "Upbit",
    "836euAuAeEWdjHFZ87vKhR6n4Vu1V22yMvj1MyzCdVU3": "Upbit",
    "29wUEjNoAG6Jv93ctmqxRRANZqeaheeDLJqKkVPQi14t": "Upbit",
    "3jn81xbBK95zf5A1K4jRMzTicWxKM6X8BzYWzhPtFjuF": "Upbit",
    "33sN6GeTukyyfp4WqUD7NauTHo1xKfFPrHuudz31GXaA": "Upbit",
    "7mhcgF1DVsj5iv4CxZDgp51H6MBBwqamsH1KnqXhSRc5": "Upbit",
    "2kmT6TAgwy2aPt4wtiSmmosyTZ8kVRSXwXxtbgJ8QfLM": "Upbit",
    "2nE99H3e9gfbxKaGodnTwixMgZwgTtKg45aoCFwdEfJS": "Upbit",
    "8jjpnSUhm5UYghznhcdkwwEUFyke6z5TchHEtUUgW8hX": "Upbit",
    "6mearRPb9Bma9Ad9wCKnGtVbTeqDyZQ6PPxDRpBUNdJU": "Upbit",
    "2YERiDP8JqbmKDDUhPQtEfWozafQm1cdwi6KrmYo2app": "Upbit",
    "6VGNcrNuhwCwWZDQoA9QoyJxKtb4FEGLnieScUnLbeKJ": "Upbit",
    "73BCsWDxqNbXgnjHKqZPtN5buGpzF4SNGf4ueP44D4v2": "Weex",
    "8mowmVCEewZ9W2cEaQyQeQEeSxhGr1hvRviLwozwNtBt": "Whitebit",
    "7sMiW38oLg5q9SKNoyPaH2Ee1VhpGdMCDrC4Lo4uLBBE": "Wintermute",
    "4FDKx3S3k9eD7HeAhjQxHeYNLXHtreCD1GTUWktiYUvR": "Wintermute",
    "5sTQ5ih7xtctBhMXHr3f1aWdaXazWrWfoehqWdqWnTFP": "Wintermute",
    "44P5Ct5JkPz76Rs2K6juC65zXMpFRDrHatxcASJ4Dyra": "Wintermute",
    "6H56d5EH5kWYHyTcRz7Skb1VbBQuQ6k5gwkQwFSLSJCE": "WOO",
    "41uCv6a1JPwZT4pDAN4AGvPosHVx2ndkNFEFgKLzd5wx": "XT.com",
  };

  let SOL_FUNDING_MAP = FALLBACK_MAP;

  // Probe address always present in Axiom's funding map chunk
  const MAP_PROBE = "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9";
  const MAP_CACHE_KEY = "axf_map_v1";

  async function loadFundingMap() {
    try {
      const cached = sessionStorage.getItem(MAP_CACHE_KEY);
      if (cached) { SOL_FUNDING_MAP = JSON.parse(cached); return; }
    } catch {}

    const urls = performance.getEntriesByType("resource")
      .filter(r => r.name.includes("axiom.trade") && r.name.includes(".js"))
      .map(r => r.name);

    for (const url of urls) {
      try {
        const text = await fetch(url).then(r => r.text());
        if (!text.includes(MAP_PROBE)) continue;

        const idx = text.indexOf(MAP_PROBE);
        let start = idx;
        while (start > 0 && text[start] !== "{") start--;
        let depth = 0, end = start;
        while (end < text.length) {
          if (text[end] === "{") depth++;
          else if (text[end] === "}") { depth--; if (depth === 0) break; }
          end++;
        }
        const slice = text.substring(start, end + 1);
        const re = /"?([A-HJ-NP-Za-km-z1-9]{32,44})"?\s*:\s*"([^"]+)"/g;
        const map = {};
        let m;
        while ((m = re.exec(slice)) !== null) map[m[1]] = m[2];

        if (Object.keys(map).length > 50) {
          SOL_FUNDING_MAP = map;
          try { sessionStorage.setItem(MAP_CACHE_KEY, JSON.stringify(map)); } catch {}
          return;
        }
      } catch {}
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function getExchangeIconUrl(name) {
    if (!name) return null;
    return `https://axiom-assets-v2.axiom-cdn.io/images/funding-logos/${encodeURIComponent(name.toLowerCase())}.webp`;
  }

  function getFundingLabel(addr) {
    if (!addr) return null;
    // Exchange wallets win even if the address also happens to be in the
    // Wallet Tracker list, matching Axiom's own DevFundingTooltipContent.
    const ex = SOL_FUNDING_MAP[addr];
    if (ex) return { label: ex, isTracker: false, iconUrl: getExchangeIconUrl(ex), iconEmoji: null };
    const tracked = trackedWalletsMap.get(addr.toLowerCase());
    if (tracked) return { label: tracked.name, isTracker: true, iconUrl: null, iconEmoji: tracked.emoji };
    return null;
  }

  function formatFundingAge(fundedAt) {
    if (!fundedAt) return null;
    const ms = Date.now() - new Date(fundedAt).getTime();
    if (ms < 0) return null;
    const min = ms / 60000;
    if (min < 60) return `${Math.floor(min)}min`;
    const h = min / 60;
    if (h < 24) return `${Math.floor(h)}h`;
    const d = h / 24;
    if (d < 30) return `${Math.floor(d)}d`;
    const mo = d / 30.4;
    if (mo < 12) return `${Math.floor(mo)}mo`;
    return `${Math.floor(mo / 12)}y`;
  }

  function getDevFundingFromFiber(chefEl) {
    const fk = Object.keys(chefEl).find(k => k.startsWith("__reactFiber"));
    if (!fk) return null;
    let f = chefEl[fk];
    for (let i = 0; i < 12 && f; i++) {
      const p = f.memoizedProps;
      if (p && typeof p === "object" && "devWalletFunding" in p) return p.devWalletFunding || null;
      f = f.return;
    }
    return null;
  }

  // ── Wallet Tracker labels - read directly from Axiom's Jotai store ───────
  // Axiom's own "Funded" tooltip (DevFundingTooltipContent) resolves Wallet
  // Tracker names/emoji via two Jotai atoms (module 946683, exports `gQ` and
  // `UC` - "my tracked wallets" and the curated/shared tracker list), read
  // through `useAtomValue` (module 472484 export `md`). Both are plain
  // objects holding arrays of `{trackedWalletAddress, name, emoji}`.
  //
  // We grab Jotai's global store (module 562092 export `zp`, i.e.
  // `getDefaultStore()`) and read those atoms directly with `store.get()`,
  // so no synthetic hover is needed at all - which is what was disrupting
  // Axiom's own "pause new rows while hovering" behaviour on Pulse.
  //
  // `__webpack_require__` itself isn't exposed globally, but pushing an
  // empty chunk with a runtime callback onto `webpackChunk_N_E` hands it to
  // us synchronously (standard Next.js webpack trick) - safe and side-effect
  // free since the pushed chunk contains no modules.
  let axiomInternals = null;
  function getAxiomInternals() {
    if (axiomInternals) return axiomInternals;
    try {
      let req = null;
      window.webpackChunk_N_E.push([["axf_" + Math.random().toString(36).slice(2)], {}, r => { req = r; }]);
      if (!req) return null;
      const store = req(562092).zp();
      const { gQ, UC } = req(946683);
      if (!store?.get || !gQ || !UC) return null;
      axiomInternals = { store, gQ, UC };
      return axiomInternals;
    } catch {
      return null;
    }
  }

  let trackedWalletsMap = new Map();
  let lastGQ = null, lastUC = null;

  function refreshTrackedWallets() {
    const internals = getAxiomInternals();
    if (!internals) return;
    try {
      const gqVal = internals.store.get(internals.gQ);
      const ucVal = internals.store.get(internals.UC);
      if (gqVal === lastGQ && ucVal === lastUC) return;
      lastGQ = gqVal;
      lastUC = ucVal;
      const map = new Map();
      for (const list of [gqVal, ucVal]) {
        if (!Array.isArray(list)) continue;
        for (const w of list) {
          if (w?.trackedWalletAddress && w?.name) {
            map.set(w.trackedWalletAddress.toLowerCase(), { name: w.name, emoji: w.emoji || null });
          }
        }
      }
      trackedWalletsMap = map;
    } catch {}
  }

  // ── Badge renderer ───────────────────────────────────────────────────────
  function updateBadgeForChef(chefEl) {
    const funding = getDevFundingFromFiber(chefEl);

    // Find the rounded-full pill container wrapping the chef hat
    let pill = chefEl.parentElement;
    while (pill && !pill.className?.includes?.("rounded-full")) pill = pill.parentElement;
    if (!pill) return;

    let badge = pill.nextElementSibling;
    const isMine = badge?.classList?.contains("axf-badge");

    if (!funding || typeof funding !== "object") {
      if (isMine) badge.remove();
      return;
    }

    const amountSol = funding.amountSol ?? funding.amountNative ?? null;
    const age = formatFundingAge(funding.fundedAt);
    const labelInfo = getFundingLabel(funding.fundingWalletAddress);

    if (!amountSol && !age && !labelInfo) {
      if (isMine) badge.remove();
      return;
    }

    ensureStyle();

    if (!isMine) {
      badge = document.createElement("div");
      badge.className = "axf-badge";
      pill.insertAdjacentElement("afterend", badge);
    }

    if (labelInfo?.isTracker) badge.classList.add("axf-badge-tracker");
    else badge.classList.remove("axf-badge-tracker");

    const contentKey = `${amountSol}|${age}|${labelInfo?.label}|${labelInfo?.iconEmoji}|${labelInfo?.isTracker}`;
    if (badge.dataset.ck === contentKey) return;
    badge.dataset.ck = contentKey;
    badge.textContent = "";

    // SOL icon + amount
    const solImg = document.createElement("img");
    solImg.src = "https://axiom-assets-v2.axiom-cdn.io/images/sol-fill.svg";
    solImg.style.cssText = "width:11px;height:11px;vertical-align:middle;flex-shrink:0;";
    badge.appendChild(solImg);
    if (amountSol != null) badge.appendChild(document.createTextNode(Number(amountSol).toFixed(2)));

    // Age
    if (age) badge.appendChild(document.createTextNode(` · ${age}`));

    // Exchange icon / tracker emoji + name
    if (labelInfo) {
      badge.appendChild(document.createTextNode(" · "));
      const labelSpan = document.createElement("span");
      labelSpan.style.cssText = "display:inline-flex;align-items:center;";
      // Matches the color Axiom's own tooltip uses for tracked funding
      // wallets (text-primaryYellow = rgb(220,193,60)); untracked/exchange
      // wallets keep the badge's default gray.
      if (labelInfo.isTracker) labelSpan.classList.add("text-primaryYellow");
      if (labelInfo.iconEmoji) {
        labelSpan.appendChild(document.createTextNode(`${labelInfo.iconEmoji} `));
      } else if (labelInfo.iconUrl) {
        const img = document.createElement("img");
        img.src = labelInfo.iconUrl;
        img.style.cssText = "width:12px;height:12px;border-radius:2px;vertical-align:middle;margin-right:2px;flex-shrink:0;";
        img.onerror = () => img.remove();
        labelSpan.appendChild(img);
      }
      labelSpan.appendChild(document.createTextNode(labelInfo.label));
      badge.appendChild(labelSpan);
    }
  }

  // ── Scanner ──────────────────────────────────────────────────────────────
  let scanTimer = null;

  function scan() {
    refreshTrackedWallets();
    document.querySelectorAll("i.icon-chef-hat").forEach(updateBadgeForChef);
  }

  function scheduleScan() {
    if (scanTimer) return;
    scanTimer = requestAnimationFrame(() => {
      scanTimer = null;
      scan();
    });
  }

  // ── MutationObserver ─────────────────────────────────────────────────────
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.querySelector?.("i.icon-chef-hat") || node.classList?.contains?.("icon-chef-hat")) {
          scheduleScan();
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Periodic re-scan to catch React re-renders
  setInterval(scan, 1500);

  // Load Axiom's live funding map, then scan
  // Scan once immediately with fallback map, then re-scan after map loads
  scan();
  loadFundingMap().then(() => scan());
})();
