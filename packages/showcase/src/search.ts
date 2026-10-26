import type { ComponentDoc } from './catalog';

// Ranked, typo-light search over the catalog. Every whitespace-separated term
// must match somewhere (AND); a term scores by WHERE it matched, so "sel" puts
// Select and StyledSelect (name) above a page that only mentions "selected" in
// its description.

export type SearchHit = { doc: ComponentDoc; score: number };

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** True when every char of `needle` appears in `hay` in order ("pscd" ⊂ "passcode"). */
function isSubsequence(needle: string, hay: string): boolean {
  let i = 0;
  for (const ch of hay) if (ch === needle[i]) i++;
  return i === needle.length;
}

function scoreTerm(term: string, doc: ComponentDoc): number {
  const name = normalize(doc.name);
  const compactName = name.replace(/ /g, '');
  if (name === term || compactName === term) return 100;
  if (name.startsWith(term) || compactName.startsWith(term)) return 80;
  if (name.split(' ').some((w) => w.startsWith(term))) return 70;
  if (name.includes(term) || compactName.includes(term)) return 60;
  if (doc.exports.some((e) => normalize(e).replace(/ /g, '').includes(term))) return 50;
  if (doc.keywords.some((k) => normalize(k).includes(term))) return 40;
  if (normalize(doc.category).includes(term)) return 30;
  if (doc.props.some((p) => normalize(p.name).includes(term))) return 20;
  if (normalize(doc.description).includes(term)) return 10;
  if (term.length >= 3 && isSubsequence(term, compactName)) return 5;
  return 0;
}

export function searchComponents(query: string, docs: readonly ComponentDoc[]): SearchHit[] {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (terms.length === 0) return docs.map((doc) => ({ doc, score: 0 }));
  const hits: SearchHit[] = [];
  for (const doc of docs) {
    let total = 0;
    let all = true;
    for (const term of terms) {
      const s = scoreTerm(term, doc);
      if (s === 0) {
        all = false;
        break;
      }
      total += s;
    }
    if (all) hits.push({ doc, score: total });
  }
  // Stable: equal scores keep catalog order.
  return hits.sort((a, b) => b.score - a.score);
}
