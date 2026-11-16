export const THEME_STORAGE_KEY = 'midnite.theme';

// Inline, render-blocking script for the document <head>: resolves and applies
// the stored theme BEFORE first paint so there's no light/dark flash. Inject it
// via `dangerouslySetInnerHTML` / a raw <script> tag (it runs before React).
export const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);var p=(s==='light'||s==='dawn'||s==='dusk'||s==='dark'||s==='time')?s:'system';var r;if(p==='system'){r=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}else if(p==='time'){var d=new Date();var h=d.getHours()+d.getMinutes()/60;r=(h>=5.75&&h<6.5)?'dawn':(h>=6.5&&h<18)?'light':(h>=18&&h<18.75)?'dusk':'dark';}else{r=p;}var root=document.documentElement;var isDark=r==='dark'||r==='dusk';if(isDark)root.classList.add('dark');else root.classList.remove('dark');if(r==='dawn'||r==='dusk')root.setAttribute('data-theme',r);else root.removeAttribute('data-theme');root.style.colorScheme=isDark?'dark':'light';}catch(e){}})();`;
