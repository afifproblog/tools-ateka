# ==========================================
# ------------ Set Inisialisasi & Modul ----
# ==========================================
import io
import json
import zipfile
import httpx # Library untuk HTTP request asynchronous (bisa juga pakai requests biasa)
import img2pdf
import os
from dotenv import load_dotenv
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageEnhance, ImageColor
from rembg import remove
from pdf2image import convert_from_bytes
from fastapi.staticfiles import StaticFiles
from fastapi import Request
# Registrasi Decoder HEIC bawaan iPhone / Apple
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pass

app = FastAPI()
#security 
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
@app.get("/sitemap.xml")
async def get_sitemap():
    xml_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tokoateka.my.id/</loc>
    <lastmod>2026-10-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>"""
    return Response(content=xml_content, media_type="application/xml")
# INJECT HTML ADSENSE
@app.get("/privacy.html")
async def serve_privacy():
    return FileResponse("privacy.html")

@app.get("/tos.html")
async def serve_tos():
    return FileResponse("tos.html")

@app.get("/disclaimer.html")
async def serve_disclaimer():
    return FileResponse("disclaimer.html")
# SETUP DB TELEGRAM
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# Variabel sederhana pengganti DB untuk menghitung klik
total_clicks = 0 
# Inject AUTO DB untuk Telegram
@app.get("/api/track-visitor")
async def track_visitor(request: Request):
    global total_clicks
    total_clicks += 1
    
    # 1. Menangkap IP Pengunjung
    # Menggunakan X-Forwarded-For karena lu pakai VPS (mungkin lewat Cloudflare/Nginx)
    client_ip = request.headers.get("x-forwarded-for")
    if not client_ip:
        client_ip = request.client.host

    # 2. Logika Alarm jika pengunjung > 10
    status_alarm = "🔥 ALARM: SERVER RAMAI!" if total_clicks > 10 else "ℹ️ Info Normal"

    # 3. Meracik Pesan Telegram
    pesan_tele = (
        f"{status_alarm}\n"
        f"Ada pengunjung baru klik 'Mulai Sekarang'!\n"
        f"🌐 IP: {client_ip}\n"
        f"📈 Total Klik: {total_clicks} orang"
    )

    # 4. Tembak ke API Telegram
    url_telegram = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": pesan_tele
    }
    
    try:
        async with httpx.AsyncClient() as client:
            await client.post(url_telegram, json=payload)
    except Exception as e:
        print("Gagal ngirim ke Telegram:", e)

    return {"status": "tercatat"}


#CRAWLER GOOGLEBOT SITEMAP
@app.get("/robots.txt")
async def get_robots():
    robots_content = """User-agent: *
Allow: /
Sitemap: https://tokoateka.my.id/sitemap.xml"""
    return Response(content=robots_content, media_type="text/plain")

@app.get("/favicon.svg")
@app.get("/favicon.ico")
async def get_favicon():
    svg_logo = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="96" height="96">
  <circle cx="50" cy="50" r="48" fill="#111315"/>
  <circle cx="34" cy="23" r="4" fill="#ffffff"/>
  <path d="M 52 28 C 65 28 72 35 72 47 L 72 68 C 72 73 75 75 79 75 L 81 75 L 76 83 C 69 83 63 79 62 74 C 57 80 48 84 38 84 C 23 84 15 74 15 62 C 15 48 26 41 42 41 C 49 41 56 43 61 45 L 61 44 C 61 36 56 34 47 34 C 40 34 34 36 29 39 L 26 33 C 33 29 43 28 52 28 Z M 61 54 C 56 51 49 50 43 50 C 32 50 26 55 26 62 C 26 69 32 74 41 74 C 51 74 61 67 61 57 Z" fill="#ff5500"/>
</svg>"""
    return Response(content=svg_logo, media_type="image/svg+xml")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# ------------ Set Ukuran Kertas -----------
# ==========================================
PAPER_SIZES_MM = {
    "A4": (210, 297),
    "F4": (215, 330),
    "A3": (297, 420)
}

def mm_to_pixels(mm_tuple, dpi=300):
    return (int(mm_tuple[0] * dpi / 25.4), int(mm_tuple[1] * dpi / 25.4))

@app.get("/")
def serve_index():
    return FileResponse("index.html")

@app.post("/api/convert-preview")
async def convert_preview_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents))
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        out_buf = io.BytesIO()
        img.save(out_buf, format="JPEG", quality=85)
        out_buf.seek(0)
        return StreamingResponse(out_buf, media_type="image/jpeg")
    except Exception as e:
        return {"error": f"Gagal membaca preview: {str(e)}"}

# ==========================================
# ------ Endpoint Baru: Remove BG Preview --
# (Dibutuhkan oleh Brush Studio v4.0)
# ==========================================
@app.post("/api/remove-bg-preview")
async def remove_bg_preview_endpoint(
    file: UploadFile = File(...),
    ai_engine_mode: str = Form("person") # Diterima agar tidak error 422, tapi diabaikan demi hemat RAM VPS
):
    contents = await file.read()
    try:
        input_img = Image.open(io.BytesIO(contents))
        if input_img.mode != "RGB":
            input_img = input_img.convert("RGB")

        # Resize jika terlalu besar agar RAM VPS tidak penuh saat preview
        orig_w, orig_h = input_img.size
        max_dim = 1024
        if max(orig_w, orig_h) > max_dim:
            scale = max_dim / max(orig_w, orig_h)
            proc_img = input_img.resize((int(orig_w * scale), int(orig_h * scale)), Image.Resampling.BILINEAR)
        else:
            proc_img = input_img

        # Menggunakan 1 model AI bawaan yang stabil untuk menghemat RAM
        output_img = remove(proc_img)

        # Kembalikan ke resolusi asli
        if (output_img.width, output_img.height) != (orig_w, orig_h):
            output_img = output_img.resize((orig_w, orig_h), Image.Resampling.LANCZOS)

        if output_img.mode != "RGBA":
            output_img = output_img.convert("RGBA")

        out_buf = io.BytesIO()
        output_img.save(out_buf, format="PNG")
        out_buf.seek(0)
        return StreamingResponse(out_buf, media_type="image/png")
    except Exception as e:
        return {"error": f"Gagal memotong background preview: {str(e)}"}
    
# ==========================================
# -------- Set Pemrosesan Gambar Utama -----
# ==========================================
def process_single_image(
    img: Image.Image,
    crop_x: float, crop_y: float, crop_w: float, crop_h: float,
    rotation: int, flip_h: bool, flip_v: bool,
    remove_bg: bool, bg_color_type: str, custom_hex: str,
    brightness: float, contrast: float, sharpness: float,
    scale_percent: float, paper_size: str, color_mode: str,
    out_format_clean: str
) -> Image.Image:
    
    if rotation % 360 != 0:
        img = img.rotate(-rotation, expand=True, resample=Image.Resampling.BICUBIC)
    if flip_h:
        img = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    if flip_v:
        img = img.transpose(Image.Transpose.FLIP_TOP_BOTTOM)

    if crop_w > 0 and crop_h > 0:
        box = (
            max(0, int(crop_x)), max(0, int(crop_y)),
            min(img.width, int(crop_x + crop_w)), min(img.height, int(crop_y + crop_h))
        )
        if box[2] > box[0] and box[3] > box[1]:
            img = img.crop(box)

    if remove_bg:
        proc_input = img.convert("RGB")
        orig_w, orig_h = proc_input.size
        max_dim = 1024
        if max(orig_w, orig_h) > max_dim:
            scale = max_dim / max(orig_w, orig_h)
            proc_img = proc_input.resize((int(orig_w * scale), int(orig_h * scale)), Image.Resampling.BILINEAR)
        else:
            proc_img = proc_input

        # Eksekusi AI yang aman untuk VPS
        out_ai = remove(proc_img)

        if (out_ai.width, out_ai.height) != (orig_w, orig_h):
            img = out_ai.resize((orig_w, orig_h), Image.Resampling.LANCZOS)
        else:
            img = out_ai

        if bg_color_type != "transparent":
            target_rgb = (255, 255, 255)
            if bg_color_type == "red":
                target_rgb = (219, 29, 36)
            elif bg_color_type == "blue":
                target_rgb = (0, 144, 218)
            elif bg_color_type == "white":
                target_rgb = (255, 255, 255)
            elif bg_color_type == "custom":
                target_rgb = ImageColor.getrgb(custom_hex)
            
            bg_layer = Image.new("RGBA", img.size, target_rgb + (255,))
            if img.mode == "RGBA":
                bg_layer.paste(img, mask=img.split()[3])
            else:
                bg_layer.paste(img)
            img = bg_layer

    if out_format_clean in ["jpg", "jpeg", "pdf"] or (color_mode == "CMYK" and out_format_clean != "png"):
        if img.mode in ("RGBA", "P"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "RGBA":
                bg.paste(img, mask=img.split()[3])
            else:
                bg.paste(img)
            img = bg
        elif img.mode != "RGB":
            img = img.convert("RGB")
    else:
        if img.mode not in ("RGBA", "RGB"):
            img = img.convert("RGBA")

    if brightness != 100.0:
        img = ImageEnhance.Brightness(img).enhance(brightness / 100.0)
    if contrast != 100.0:
        img = ImageEnhance.Contrast(img).enhance(contrast / 100.0)
    if sharpness != 100.0:
        img = ImageEnhance.Sharpness(img).enhance(sharpness / 100.0)

    if 5.0 < scale_percent < 100.0:
        new_w = max(1, int(img.width * (scale_percent / 100.0)))
        new_h = max(1, int(img.height * (scale_percent / 100.0)))
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    if paper_size in PAPER_SIZES_MM:
        target_w, target_h = mm_to_pixels(PAPER_SIZES_MM[paper_size], dpi=300)
        if img.width > img.height and target_w < target_h:
            target_w, target_h = target_h, target_w

        canvas = Image.new("RGB", (target_w, target_h), (255, 255, 255))
        img_ratio = img.width / img.height
        target_ratio = target_w / target_h

        if img_ratio > target_ratio:
            new_w = target_w
            new_h = int(target_w / img_ratio)
        else:
            new_h = target_h
            new_w = int(target_h * img_ratio)

        resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        offset = ((target_w - new_w) // 2, (target_h - new_h) // 2)
        canvas.paste(resized_img, offset)
        img = canvas

    return img

# ==========================================
# ------- Set Endpoint Proses Dokumen ------
# ==========================================
@app.post("/api/process")
async def process_document(
    files: List[UploadFile] = File(...),
    paper_size: str = Form("ORIGINAL"),
    format_out: str = Form("jpg"),
    scale_percent: float = Form(100.0),
    quality: int = Form(90),
    brightness: float = Form(100.0),
    contrast: float = Form(100.0),
    sharpness: float = Form(100.0),
    rotation: int = Form(0),
    flip_h: bool = Form(False),
    flip_v: bool = Form(False),
    crop_x: float = Form(0.0),
    crop_y: float = Form(0.0),
    crop_w: float = Form(0.0),
    crop_h: float = Form(0.0),
    crops_json: Optional[str] = Form(None),
    remove_bg: str = Form("false"), # Parsing aman dari JS
    bg_color_type: str = Form("transparent"),
    custom_hex: str = Form("#ffffff"),
    color_mode: str = Form("RGB"),
    ai_engine_mode: str = Form("person") # Ditangkap agar frontend v4.0 tidak error 422
):
    raw_images = []
    out_format_clean = format_out.lower()
    
    # Casting string remove_bg menjadi boolean dengan aman
    is_remove_bg = str(remove_bg).lower() in ["true", "1", "on", "yes"]

    for file in files:
        contents = await file.read()
        fname = file.filename.lower() if file.filename else ""
        if fname.endswith(".pdf") or file.content_type == "application/pdf":
            pdf_imgs = convert_from_bytes(contents, dpi=300)
            raw_images.extend(pdf_imgs)
        else:
            raw_images.append(Image.open(io.BytesIO(contents)))

    if not raw_images:
        raise ValueError("Tidak ada berkas yang valid.")
    
    multi_crops = []
    if crops_json:
        try:
            multi_crops = json.loads(crops_json)
        except Exception:
            multi_crops = []

    processed_list = []
    for idx, raw_img in enumerate(raw_images):
        if idx < len(multi_crops) and multi_crops[idx]:
            c_data = multi_crops[idx]
            cx = float(c_data.get("x", 0.0))
            cy = float(c_data.get("y", 0.0))
            cw = float(c_data.get("w", 0.0))
            ch = float(c_data.get("h", 0.0))
        else:
            cx = crop_x if idx == 0 else 0.0
            cy = crop_y if idx == 0 else 0.0
            cw = crop_w if idx == 0 else 0.0
            ch = crop_h if idx == 0 else 0.0

        p_img = process_single_image(
            raw_img, cx, cy, cw, ch,
            rotation, flip_h, flip_v,
            is_remove_bg, bg_color_type, custom_hex,
            brightness, contrast, sharpness,
            scale_percent, paper_size, color_mode,
            out_format_clean
        )
        processed_list.append(p_img)

    output_buf = io.BytesIO()

    if out_format_clean == "pdf":
        temp_jpegs = []
        for img_item in processed_list:
            if color_mode == "CMYK":
                img_item = img_item.convert("CMYK")
            elif img_item.mode != "RGB":
                img_item = img_item.convert("RGB")
            buf_t = io.BytesIO()
            img_item.save(buf_t, format="JPEG", quality=quality)
            temp_jpegs.append(buf_t.getvalue())

        pdf_bytes = img2pdf.convert(temp_jpegs)
        output_buf.write(pdf_bytes)
        output_buf.seek(0)
        return StreamingResponse(
            output_buf,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=tools_ateka_output.pdf"}
        )

    elif len(processed_list) > 1:
        with zipfile.ZipFile(output_buf, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for idx, img_item in enumerate(processed_list):
                img_buf = io.BytesIO()
                if out_format_clean == "png":
                    if img_item.mode not in ("RGB", "RGBA"):
                        img_item = img_item.convert("RGBA" if "A" in img_item.mode else "RGB")
                    img_item.save(img_buf, format="PNG", optimize=True)
                    ext = "png"
                else:
                    if color_mode == "CMYK":
                        img_item = img_item.convert("CMYK")
                    elif img_item.mode != "RGB":
                        img_item = img_item.convert("RGB")
                    img_item.save(img_buf, format="JPEG", quality=quality, optimize=True)
                    ext = "jpg"
                
                zip_file.writestr(f"halaman_{idx + 1}.{ext}", img_buf.getvalue())

        output_buf.seek(0)
        return StreamingResponse(
            output_buf,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=tools_ateka_output.zip"}
        )

    elif out_format_clean == "png":
        first_img = processed_list[0]
        if first_img.mode not in ("RGB", "RGBA"):
            first_img = first_img.convert("RGBA" if "A" in first_img.mode else "RGB")
        first_img.save(output_buf, format="PNG", optimize=True)
        output_buf.seek(0)
        return StreamingResponse(
            output_buf,
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=tools_ateka_output.png"}
        )

    else:
        first_img = processed_list[0]
        if color_mode == "CMYK":
            first_img = first_img.convert("CMYK")
        elif first_img.mode != "RGB":
            first_img = first_img.convert("RGB")
        first_img.save(output_buf, format="JPEG", quality=quality, optimize=True)
        output_buf.seek(0)
        return StreamingResponse(
            output_buf,
            media_type="image/jpeg",
            headers={"Content-Disposition": "attachment; filename=tools_ateka_output.jpg"}
        )
