// Minimal, dependency-free Markdown → HTML converter. Handles the constructs our
// docs use: headings, fenced code, lists, tables, blockquotes, and inline
// code/bold/links. Not a full CommonMark implementation — just enough, on purpose.

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, href) => {
    // Rewrite links to sibling Markdown files to their generated .html page.
    const h = href.replace(/^\.\//, "").replace(/\.md(#.*)?$/, ".html$1");
    return `<a href="${h}">${t}</a>`;
  });
  return s;
}

export function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  let inList = null; // "ul" | "ol" | null
  let para = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const closeList = () => {
    if (inList) {
      out.push(`</${inList}>`);
      inList = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code
    if (/^```/.test(line)) {
      flushPara();
      closeList();
      i++;
      const code = [];
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++; // closing fence
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    // Table: header row of pipes followed by a |---| separator
    if (
      /\|/.test(line) &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) &&
      /-/.test(lines[i + 1])
    ) {
      flushPara();
      closeList();
      const cells = (row) =>
        row
          .replace(/^\s*\|/, "")
          .replace(/\|\s*$/, "")
          .split("|")
          .map((c) => c.trim());
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /\|/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(
        "<table><thead><tr>" +
          head.map((c) => `<th>${inline(c)}</th>`).join("") +
          "</tr></thead><tbody>",
      );
      for (const r of rows)
        out.push("<tr>" + r.map((c) => `<td>${inline(c)}</td>`).join("") + "</tr>");
      out.push("</tbody></table>");
      continue;
    }

    // Heading
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flushPara();
      closeList();
      out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      flushPara();
      closeList();
      out.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`);
      i++;
      continue;
    }

    // Lists
    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ul || ol) {
      flushPara();
      const kind = ul ? "ul" : "ol";
      if (inList !== kind) {
        closeList();
        out.push(`<${kind}>`);
        inList = kind;
      }
      out.push(`<li>${inline((ul || ol)[1])}</li>`);
      i++;
      continue;
    }

    // Blank line
    if (/^\s*$/.test(line)) {
      flushPara();
      closeList();
      i++;
      continue;
    }

    // Paragraph text
    closeList();
    para.push(line.trim());
    i++;
  }
  flushPara();
  closeList();
  return out.join("\n");
}
