import csv
import json
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


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

        body = json.dumps({"saved": True, "generated": False}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        return


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8000, type=int)
    args = parser.parse_args()

    handler = lambda *h_args, **h_kwargs: Handler(*h_args, directory=str(ROOT_DIR), **h_kwargs)
    server = ThreadingHTTPServer((args.host, args.port), handler)

    print(f"Servidor: http://{args.host}:{args.port}/")
    print(f"CSV: {CSV_PATH}")
    server.serve_forever()


if __name__ == "__main__":
    main()
