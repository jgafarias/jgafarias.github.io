import csv
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
TEMPLATE_PATH = ROOT_DIR / "img" / "Mensagem.jpeg"
OUTPUT_DIR = ROOT_DIR / "img" / "msgs"
DEFAULT_OUTPUT_MODE = "template"
WINDOWS_ARIAL = Path("C:/Windows/Fonts/arial.ttf")
WINDOWS_ARIAL_ALT = Path("C:/Windows/Fonts/Arial.ttf")


def _safe_part(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "", (value or "").strip())
    return cleaned or "Anonimo"


def _load_font(size: int):
    try:
        from PIL import ImageFont
    except Exception:
        return None

    candidates: list[str] = ["arial.ttf"]
    if WINDOWS_ARIAL.exists():
        candidates.append(str(WINDOWS_ARIAL))
    if WINDOWS_ARIAL_ALT.exists():
        candidates.append(str(WINDOWS_ARIAL_ALT))

    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue

    try:
        return ImageFont.load_default()
    except Exception:
        return None


@dataclass(frozen=True)
class MessageRow:
    nome: str
    valor: str
    mensagem: str
    data: str


def _read_csv(path: Path) -> list[MessageRow]:
    rows: list[MessageRow] = []
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        all_rows = list(csv.reader(f))

    if not all_rows:
        return rows

    first = [c.strip() for c in all_rows[0]]
    first_lower = [c.lower() for c in first]
    has_header = "nome" in first_lower and "mensagem" in first_lower and "data" in first_lower

    if has_header:
        with path.open("r", encoding="utf-8-sig", newline="") as f:
            reader = csv.DictReader(f)
            for item in reader:
                rows.append(
                    MessageRow(
                        nome=str(item.get("nome", "")).strip(),
                        valor=str(item.get("valor", "")).strip(),
                        mensagem=str(item.get("mensagem", "")).strip(),
                        data=str(item.get("data", "")).strip(),
                    )
                )
        return rows

    for values in all_rows:
        if not values:
            continue
        if len(values) >= 5:
            nome, _telefone, valor, mensagem, data = values[0], values[1], values[2], values[3], values[4]
        elif len(values) == 4:
            nome, valor, mensagem, data = values[0], values[1], values[2], values[3]
        else:
            continue

        rows.append(
            MessageRow(
                nome=str(nome).strip(),
                valor=str(valor).strip(),
                mensagem=str(mensagem).strip(),
                data=str(data).strip(),
            )
        )

    return rows


def _wrap_text(draw, font, text: str, max_width: int) -> list[str]:
    lines: list[str] = []
    raw_lines = (text or "").splitlines() or [""]
    for raw in raw_lines:
        words = [w for w in raw.split(" ") if w != ""]
        current = ""
        for word in words:
            candidate = f"{current} {word}".strip()
            width = draw.textlength(candidate, font=font)
            if width <= max_width:
                current = candidate
            else:
                if current:
                    lines.append(current)
                current = word
        lines.append(current)
    return lines


def _truncate_one_line(draw, font, text: str, max_width: int) -> str:
    raw = (text or "").strip()
    if not raw:
        return ""
    if draw.textlength(raw, font=font) <= max_width:
        return raw

    ell = "..."
    current = raw
    while current and draw.textlength(current + ell, font=font) > max_width:
        current = current[:-1].rstrip()
    return (current + ell) if current else ell


def _abbreviate_name_variants(name: str) -> list[str]:
    parts = [p for p in (name or "").split() if p.strip()]
    if len(parts) <= 2:
        return [" ".join(parts)]

    first = parts[0]
    last = parts[-1]
    middle = parts[1:-1]

    variants: list[str] = []
    variants.append(" ".join(parts))

    if len(parts) >= 4:
        second = parts[1]
        middle_after_second = parts[2:-1]
        initials = " ".join(f"{p[0].upper()}." for p in middle_after_second if p)
        variants.append(" ".join([first, second, initials, last]).replace("  ", " ").strip())

    initials_all = " ".join(f"{p[0].upper()}." for p in middle if p)
    variants.append(" ".join([first, initials_all, last]).replace("  ", " ").strip())

    if len(parts) >= 3:
        variants.append(" ".join([first, f"{parts[1][0].upper()}. ", last]).replace("  ", " ").strip())

    seen: set[str] = set()
    out: list[str] = []
    for v in variants:
        v = " ".join(v.split())
        if v and v not in seen:
            seen.add(v)
            out.append(v)
    return out


def _best_fit_name(draw, font, name: str, max_width: int) -> str:
    for candidate in _abbreviate_name_variants(name):
        if draw.textlength(candidate, font=font) <= max_width:
            return candidate
    return _truncate_one_line(draw, font, name, max_width)


def _chunk_lines(lines: list[str], chunk_size: int) -> list[list[str]]:
    if chunk_size <= 0:
        return []
    if not lines:
        return [[""]]
    return [lines[i : i + chunk_size] for i in range(0, len(lines), chunk_size)]


def _layout_message(draw, *, text: str, font, font_path: str, max_width: int, max_height: int, line_spacing: float, min_size: int):
    if not hasattr(font, "size"):
        line_height = 44
        max_lines = max(1, max_height // line_height) if max_height > 0 else 1
        lines = _wrap_text(draw, font, text, max_width)
        return font, lines, line_height, max_lines

    try:
        from PIL import ImageFont
    except Exception:
        line_height = 44
        max_lines = max(1, max_height // line_height) if max_height > 0 else 1
        lines = _wrap_text(draw, font, text, max_width)
        return font, lines, line_height, max_lines

    base_size = int(getattr(font, "size", 14) or 14)
    best = None
    for size in range(base_size, min_size - 1, -1):
        candidate_font = _load_font(size) or font

        lines = _wrap_text(draw, candidate_font, text, max_width)
        line_height = int(round(size * line_spacing))
        max_lines = max(1, max_height // max(1, line_height)) if max_height > 0 else 1
        pages = (len(lines) + max_lines - 1) // max_lines

        if best is None or pages < best[0] or (pages == best[0] and size > best[1]):
            best = (pages, size, candidate_font, lines, line_height, max_lines)
        if pages == 1:
            break

    if best is None:
        lines = _wrap_text(draw, font, text, max_width)
        line_height = int(round(base_size * line_spacing))
        max_lines = max(1, max_height // max(1, line_height)) if max_height > 0 else 1
        return font, lines, line_height, max_lines

    _, _, best_font, best_lines, best_line_height, best_max_lines = best
    return best_font, best_lines, best_line_height, best_max_lines


def _resize_no_stretch(image, target_size: tuple[int, int], mode: str):
    from PIL import Image

    target_w, target_h = target_size
    src_w, src_h = image.size

    if (src_w, src_h) == (target_w, target_h):
        return image

    if mode == "template":
        return image

    if mode not in {"contain", "cover"}:
        raise ValueError("invalid_resize_mode")

    scale_contain = min(target_w / src_w, target_h / src_h)
    scale_cover = max(target_w / src_w, target_h / src_h)
    scale = scale_contain if mode == "contain" else scale_cover

    new_w = int(round(src_w * scale))
    new_h = int(round(src_h * scale))
    resized = image.resize((new_w, new_h), resample=Image.Resampling.LANCZOS)

    if mode == "contain":
        canvas = Image.new("RGB", (target_w, target_h), (255, 255, 255))
        x = (target_w - new_w) // 2
        y = (target_h - new_h) // 2
        canvas.paste(resized, (x, y))
        return canvas

    left = max(0, (new_w - target_w) // 2)
    top = max(0, (new_h - target_h) // 2)
    return resized.crop((left, top, left + target_w, top + target_h))


def _draw_one(row: MessageRow, out_path: Path, *, width: int | None, height: int | None, mode: str) -> list[Path]:
    try:
        from PIL import Image, ImageDraw, ImageFont
    except Exception:
        raise SystemExit("Instale Pillow: pip install pillow")

    if not TEMPLATE_PATH.exists():
        raise SystemExit(f"Template nao encontrado: {TEMPLATE_PATH}")

    base_image = Image.open(TEMPLATE_PATH).convert("RGB")
    target_w = width or base_image.size[0]
    target_h = height or base_image.size[1]
    base_image = _resize_no_stretch(base_image, (target_w, target_h), mode)
    measure = ImageDraw.Draw(base_image)

    try:
        base = max(22, int(round(min(base_image.size) * 0.055)))
        font_from = _load_font(int(round(base * 0.85))) or ImageFont.load_default()
        font_msg = _load_font(int(round(base * 1.1))) or ImageFont.load_default()
    except Exception:
        font_from = ImageFont.load_default()
        font_msg = ImageFont.load_default()

    w, h = base_image.size
    name_color = (64, 156, 202)
    message_color = (64, 156, 202)

    name_text = (row.nome or "").strip()
    message_text = (row.mensagem or "").strip()

    name_y = int(round(h * 0.415))
    if name_text and hasattr(font_from, "size"):
        name_box_left = int(round(w * 0.20))
        name_box_right = int(round(w * 0.54))
        max_name_width = max(10, name_box_right - name_box_left)
        base_size = int(getattr(font_from, "size", 14) or 14)
        min_size = max(16, base_size - 2)
        current_size = base_size
        while current_size > min_size and measure.textlength(name_text, font=font_from) > max_name_width:
            current_size -= 1
            try:
                font_from = _load_font(current_size) or font_from
            except Exception:
                break

        name_text = _best_fit_name(measure, font_from, name_text, max_name_width)

    name_width = measure.textlength(name_text, font=font_from) if name_text else 0
    name_box_left = int(round(w * 0.20))
    name_box_right = int(round(w * 0.54))
    name_box_w = max(10, name_box_right - name_box_left)
    name_x = name_box_left + int(round((name_box_w - name_width) / 2)) + int(round(w * 0.01))

    message_box_left = int(round(w * 0.06))
    message_box_right = int(round(w * 0.94))
    message_box_top = int(round(h * 0.60))
    message_box_bottom = int(round(h * 0.88))
    max_width = max(10, message_box_right - message_box_left)
    max_height = max(10, message_box_bottom - message_box_top)

    font_msg, lines, line_height, max_lines = _layout_message(
        measure,
        text=message_text,
        font=font_msg,
        font_path="arial.ttf",
        max_width=max_width,
        max_height=max_height,
        line_spacing=1.35,
        min_size=26,
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    pages = _chunk_lines(lines, max_lines)
    out_paths: list[Path] = []
    for idx, page_lines in enumerate(pages, start=1):
        page_image = base_image.copy()
        draw = ImageDraw.Draw(page_image)

        draw.text((name_x, name_y), name_text, fill=name_color, font=font_from)

        start_y = message_box_top
        for i, line in enumerate(page_lines):
            text_width = draw.textlength(line, font=font_msg)
            if text_width > max_width:
                x = message_box_left
            else:
                x = message_box_left + int(round((max_width - text_width) / 2))
            y = start_y + i * line_height
            draw.text((x, y), line, fill=message_color, font=font_msg)

        if len(pages) == 1:
            page_out_path = out_path
        else:
            page_out_path = out_path.with_name(f"{out_path.stem}_p{idx}{out_path.suffix}")

        ext = page_out_path.suffix.lower()
        if ext in {".png"}:
            page_image.save(page_out_path, format="PNG", optimize=True)
        else:
            page_image.save(page_out_path, format="JPEG", quality=92)

        out_paths.append(page_out_path)

    return out_paths


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", required=True, help="CSV com colunas: nome,valor,mensagem,data")
    parser.add_argument("--width", type=int, default=None, help="Largura do output. Padrao: largura do template")
    parser.add_argument("--height", type=int, default=None, help="Altura do output. Padrao: altura do template")
    parser.add_argument(
        "--mode",
        choices=["template", "contain", "cover"],
        default=DEFAULT_OUTPUT_MODE,
        help="Como ajustar o template sem achatar: template|contain|cover",
    )
    args = parser.parse_args()

    source = Path(args.csv).resolve()

    if not source.exists():
        raise SystemExit(
            "CSV nao encontrado.\n"
            f"Procurado em: {source}"
        )

    print(f"Lendo CSV de: {source}")
    rows = _read_csv(source)
    if not rows:
        raise SystemExit("CSV sem linhas.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    created = 0
    for row in rows:
        date_part = _safe_part(row.data) or datetime.now().strftime("%Y%m%d")
        filename = f"{_safe_part(row.nome)}{date_part}{_safe_part(row.valor)}.jpeg"
        out_path = OUTPUT_DIR / filename
        out_paths = _draw_one(row, out_path, width=args.width, height=args.height, mode=args.mode)
        created += len(out_paths)

    print(f"Geradas {created} imagens em: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
