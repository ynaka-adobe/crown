const COLUMNS = ['Article', 'Date', 'Short Description', 'Expire Date', 'Link'];

function getJsonUrl(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const firstRow = rows[0];
  if (!firstRow) return null;
  const link = firstRow.querySelector('a[href]');
  if (link?.href) return link.href;
  const text = firstRow.textContent?.trim();
  if (text && /^https?:\/\//.test(text)) return text;
  return null;
}

function buildTable(data) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  for (const col of COLUMNS) {
    const th = document.createElement('th');
    th.textContent = col;
    headRow.append(th);
  }
  thead.append(headRow);
  table.append(thead);

  const tbody = document.createElement('tbody');
  for (const row of data) {
    const tr = document.createElement('tr');
    for (const col of COLUMNS) {
      const td = document.createElement('td');
      const val = row[col];
      if (col === 'Link' && val) {
        const a = document.createElement('a');
        a.href = val;
        a.textContent = val;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        td.append(a);
      } else {
        td.textContent = val ?? '';
      }
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  return table;
}

export default async function init(el) {
  const url = getJsonUrl(el);
  if (!url) {
    el.innerHTML = '<p>Download block requires a JSON URL in row 1.</p>';
    return;
  }
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status}`);
    const json = await resp.json();
    const data = json?.data ?? json;
    const rows = Array.isArray(data) ? data : [];
    if (rows.length === 0) {
      el.innerHTML = '<p>No data to display.</p>';
      return;
    }
    el.innerHTML = '';
    el.append(buildTable(rows));
  } catch (err) {
    el.innerHTML = `<p>Could not load data: ${err.message}</p>`;
  }
}
