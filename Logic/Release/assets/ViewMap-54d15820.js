import{g as s,a as o}from"./getElementByXpath-3b38d01d.js";import{c as e}from"./Click-59d5e1cf.js";const b=async c=>await chrome.storage.local.remove(c),f=(c,d)=>{const l=document.evaluate(c,d??document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);if(l.snapshotLength===0)return null;const u=Math.floor(Math.random()*l.snapshotLength);return l.snapshotItem(u)},p=["loynis","coronius","succubus","septienna","zubin","dioxippe","octavia","conflux_storage","storage_"],v=async()=>{const c=await s("masterkey"),d=await s("map.status"),l=await s("map.highestFirst"),u=await s("map.randomEnemies"),i=await s("map.attackMarked"),h=await s("map.collectIcons"),w=await s("avoid_enemies_filter")??[],y=await s("prioritize_enemies_filter")??[],k=await s("storage.status"),E=await s("storage.ready"),g=await s("storage.location"),B=o("//div[@class = 'list small']/strong").textContent.toLowerCase()===(g==null?void 0:g.toLowerCase()),_=await s("bosses.status"),m=await s("bosses.selectedBoss"),a=w.map(t=>`not(contains(@src, "${t}"))`).join(" and "),r=y.map(t=>`contains(@src, "${t}")`).join(" or ");if(!c)return null;if(k&&B)if(!E)e(o("//img[contains(@src, 'portal')]"))||o("//a[contains(text(), '»')]").click();else for(let t=0;t<p.length;t++){const n=getElementByXpath(`//img[contains(@src,'${p[t]}')]`);if(e(n))break}if(_&&m){const t=m.name.replace(/\s+/g,"_").toLowerCase(),n=getElementByXpath(`
    //img[
      contains(@src, '${t}')
      and contains(@src, 'r=${m.rank}')
    ]`);if(n)return e(n);const $=getElementByXpath(`//img[
        @class='unit shadow-lg round'
        and(contains(@src, '${t}'))
      ]/parent::td/parent::tr/td[2]/span[contains(text(), '(${m.rank})')]`);return $?$.click():(await b("selectedBoss"),location.href="https://blackdragon.mobi/quests/index/",null)}if(h&&e(getElementByXpath("//img[@alt = '+']")))return!0;if(!d)return null;if(u){const t=f(`//img[
            @alt="*"
            ${i?"":"and (contains(@class, 'unit'))"}
            ${r?`and (${r})`:""}
            ${a?`and (${a})`:""}
          ]`);if(t)return e(t);if(!t){const n=f(`//img[
                  @alt="*"
                  ${i?"":"and (contains(@class, 'unit'))"}
                  ${a?`and (${a})`:""}
                ]`);return n?e(n):e(o(`//img[
        @class='unit shadow-lg round'
        ${a?`and (${a})`:""}
      ]`))}}if(l){for(let t=10;t>=0;t--){const n=o(`//img[
            @alt="*"
            ${i?"":"and (contains(@class, 'unit'))"}
            ${r?`and (${r})`:""}
            ${a?`and (${a})`:""}
            and contains(@src, 'r=${t}')
        ]`);if(n)return e(n)}for(let t=10;t>=0;t--){const n=o(`//img[
            @alt="*"
            ${i?"":"and (contains(@class, 'unit'))"}
            ${a?`and (${a})`:""}
            and contains(@src, 'r=${t}')
        ]`);if(n)return e(n)}return e(o(`//img[
      @class='unit shadow-lg round'
      ${a?`and (${a})`:""}
    ]`))}for(let t=0;t<=10;t++){const n=o(`//img[
            @alt="*"
            ${i?"":"and (contains(@class, 'unit'))"}
            ${r?`and (${r})`:""}
            ${a?`and (${a})`:""}
            and contains(@src, 'r=${t}')
        ]`);if(n)return e(n)}for(let t=0;t<=10;t++){const n=o(`//img[
            @alt="*"
            ${i?"":"and (contains(@class, 'unit'))"}
            ${a?`and (${a})`:""}
            and contains(@src, 'r=${t}')
        ]`);if(n)return e(n)}return e(o(`//img[
    @class='unit shadow-lg round'
    ${a?`and (${a})`:""}
  ]`))};v();
