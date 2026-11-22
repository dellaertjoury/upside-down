"""Unpack an exported bug/idea report file into screenshots + a readable list.

Usage:  python3 tools/unpack_reports.py upside-down-reports-....json [out_folder]

Writes out_folder/report-01.jpg ... and out_folder/REPORTS.md (comment, build,
mode, distance, player state, what was on screen, errors) per report.
"""
import base64, json, os, sys

src = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(src)[0]
os.makedirs(out, exist_ok=True)
data = json.load(open(src, encoding="utf-8"))
lines = [f"# {data.get('game', 'Reports')}: {data.get('count', 0)} reports (exported {data.get('exported', '?')})\n"]
for i, r in enumerate(data.get("reports", []), 1):
    c = r.get("ctx") or {}; s = c.get("state") or {}; p = c.get("player") or {}
    img = ""
    if r.get("shot", "").startswith("data:image"):
        head, b64 = r["shot"].split(",", 1); ext = "png" if "png" in head else "jpg"
        img = f"report-{i:02d}.{ext}"
        open(os.path.join(out, img), "wb").write(base64.b64decode(b64))
    lines.append(f"## #{i} {'IDEA' if r.get('kind') == 'idea' else 'BUG'}: {r.get('comment', '').strip()}\n")
    if img: lines.append(f"![screenshot]({img})\n")
    lines.append(f"- when {c.get('when', r.get('created'))} · build {c.get('build')} · lang {c.get('lang')} · {c.get('ua', '')[:80]}")
    lines.append(f"- mode {c.get('mode')} · class {c.get('cls')} · upgrades {c.get('upgrades')} · lights {c.get('lights')}")
    lines.append(f"- run: {s.get('dist')} m · speed {s.get('speed')} · score {s.get('score')} · hearts {s.get('hearts')} · dread {s.get('dread')} · fps {s.get('fps')}")
    lines.append(f"- player: {p}")
    if c.get("onScreen"): lines.append(f"- on screen: {', '.join(c['onScreen'])}")
    if c.get("errors"): lines.append(f"- errors: {' | '.join(e.get('msg', '') for e in c['errors'])}")
    lines.append("")
open(os.path.join(out, "REPORTS.md"), "w", encoding="utf-8").write("\n".join(lines))
print(f"{len(data.get('reports', []))} reports -> {out}/REPORTS.md")
