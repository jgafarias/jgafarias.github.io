import csv
import json
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from generate_msg_images import DEFAULT_OUTPUT_MODE, MessageRow, OUTPUT_DIR, _draw_one, _safe_part


ROOT_DIR = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT_DIR / "mensagens.csv"
FIELDNAMES = ["nome", "telefone", "valor", "mensagem", "data"]


def _append_csv(row: dict) -> None:
    write_header = not CSV_PATH.exists()
    CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    with CSV_PATH.open("a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if write_header:
            writer.writeheader()
        writer.writerow({key: row.get(key, "") for key in FIELDNAMES})


def _generate_images(row: dict) -> bool:
    try:
        message_row = MessageRow(
            nome=str(row.get("nome", "") or ""),
            valor=str(row.get("valor", "") or ""),
            mensagem=str(row.get("mensagem", "") or ""),
            data=str(row.get("data", "") or ""),
        )

        date_part = _safe_part(message_row.data) or datetime.now().strftime("%Y%m%d")
        time_part = datetime.now().strftime("%H%M%S")
        filename = f"{_safe_part(message_row.nome)}{date_part}{_safe_part(message_row.valor)}{time_part}.jpeg"
        out_path = OUTPUT_DIR / filename
        pages = _draw_one(message_row, out_path, width=None, height=None, mode=DEFAULT_OUTPUT_MODE)
        return bool(pages)
    except Exception:
        return False


class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/api/messages":
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0") or "0")
        except Exception:
            self.send_error(400)
            return

        try:
            raw = self.rfile.read(length) if length else b"{}"
            payload = json.loads(raw.decode("utf-8") or "{}")
        except Exception:
            self.send_error(400)
            return

        row = {
            "nome": str(payload.get("nome", "") or "").strip(),
            "telefone": str(payload.get("telefone", "") or "").strip(),
            "valor": str(payload.get("valor", "") or "").strip(),
            "mensagem": str(payload.get("mensagem", "") or "").strip(),
            "data": str(payload.get("data", "") or "").strip() or datetime.now().strftime("%Y-%m-%d"),
        }

        try:
            _append_csv(row)
        except Exception:
            self.send_error(500)
            return

        generated = _generate_images(row)
        body = json.dumps({"saved": True, "generated": generated}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8000, type=int)
    args = parser.parse_args()

    handler = lambda *h_args, **h_kwargs: Handler(*h_args, directory=str(ROOT_DIR), **h_kwargs)
    server = ThreadingHTTPServer((args.host, args.port), handler)

    print(f"Servidor (gera imagens): http://{args.host}:{args.port}/")
    print(f"CSV: {CSV_PATH}")
    server.serve_forever()


if __name__ == "__main__":
    main()
