import io
import json
import zipfile
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageEnhance, ImageColor
import img2pdf
from rembg import remove
from pdf2image import convert_from_bytes

# Registrasi Decoder HEIC bawaan iPhone / Apple
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pass

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Endpoint Pembantu: Konversi Instan HEIC/TIFF ke JPEG untuk Preview Browser PC
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

def process_single_image(
    img: Image.Image,
    crop_x: float,
    crop_y: float,
    crop_w: float,
    crop_h: float,
    rotation: int,
    flip_h: bool,
    flip_v: bool,
    remove_bg: bool,
    bg_color_type: str,
    custom_hex: str,
    brightness: float,
    contrast: float,
    sharpness: float,
    scale_percent: float,
    paper_size: str,
    color_mode: str,
    out_format_clean: str
) -> Image.Image:
    # 1. Rotasi & Flip
    if rotation % 360 != 0:
        img = img.rotate(-rotation, expand=True, resample=Image.Resampling.BICUBIC)
    if flip_h:
        img = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    if flip_v:
        img = img.transpose(Image.Transpose.FLIP_TOP_BOTTOM)

    # 2. Crop Lembar Kerja
    if crop_w > 0 and crop_h > 0:
        box = (
            max(0, int(crop_x)),
            max(0, int(crop_y)),
            min(img.width, int(crop_x + crop_w)),
            min(img.height, int(crop_y + crop_h))
        )
        if box[2] > box[0] and box[3] > box[1]:
            img = img.crop(box)

    # 3. Hapus Background AI & Warna Latar
    if remove_bg:
        img = remove(img)
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

    # 4. Normalisasi Mode Warna
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

    # 5. Filter Kecerahan, Kontras & Ketajaman Teks
    if brightness != 100.0:
        img = ImageEnhance.Brightness(img).enhance(brightness / 100.0)
    if contrast != 100.0:
        img = ImageEnhance.Contrast(img).enhance(contrast / 100.0)
    if sharpness != 100.0:
        img = ImageEnhance.Sharpness(img).enhance(sharpness / 100.0)

    # 6. Skala
    if 5.0 < scale_percent < 100.0:
        new_w = max(1, int(img.width * (scale_percent / 100.0)))
        new_h = max(1, int(img.height * (scale_percent / 100.0)))
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # 7. Penempatan di Ukuran Kertas Lembar Toko (A4/F4/A3)
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
    remove_bg: bool = Form(False),
    bg_color_type: str = Form("transparent"),
    custom_hex: str = Form("#ffffff"),
    color_mode: str = Form("RGB")
):
    raw_images = []
    out_format_clean = format_out.lower()

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
            remove_bg, bg_color_type, custom_hex,
            brightness, contrast, sharpness,
            scale_percent, paper_size, color_mode,
            out_format_clean
        )
        processed_list.append(p_img)

    output_buf = io.BytesIO()

    # KASUS 1: Format Target PDF (Multi-Page Tetap Jadi 1 Dokumen PDF)
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

    # KASUS 2: Format JPG atau PNG untuk Multi-Berkas (Otomatis Dibungkus ZIP)
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

    # KASUS 3: Format PNG Berkas Tunggal
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

    # KASUS 4: Format JPG Berkas Tunggal
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
