import io
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageEnhance, ImageColor
import img2pdf
from rembg import remove

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

@app.post("/api/process")
async def process_document(
    file: UploadFile = File(...),
    paper_size: str = Form("ORIGINAL"),
    format_out: str = Form("jpg"),
    scale_percent: float = Form(100.0),
    quality: int = Form(90),
    brightness: float = Form(100.0),
    contrast: float = Form(100.0),
    remove_bg: bool = Form(False),
    bg_color_type: str = Form("transparent"), # transparent, red, blue, white, custom
    custom_hex: str = Form("#ffffff"),
    color_mode: str = Form("RGB") # RGB atau CMYK
):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents))
    
    # 1. Hapus latar dengan Rembg jika dicentang
    if remove_bg:
        img = remove(img)
        
        # Ganti background jika bukan transparent
        if bg_color_type != "transparent":
            target_rgb = (255, 255, 255)
            if bg_color_type == "red":
                # Standar pasfoto merah cetak
                target_rgb = (219, 29, 36)
            elif bg_color_type == "blue":
                # Standar pasfoto biru cetak
                target_rgb = (0, 144, 218)
            elif bg_color_type == "white":
                target_rgb = (255, 255, 255)
            elif bg_color_type == "custom":
                target_rgb = ImageColor.getrgb(custom_hex)
                
            bg_layer = Image.new("RGBA", img.size, target_rgb + (255,))
            bg_layer.paste(img, mask=img.split()[3])
            img = bg_layer

    # 2. Penyesuaian Transparansi vs Format
    if format_out.lower() in ["jpg", "jpeg", "pdf"]:
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

    # 3. Kecerahan & Kontras
    if brightness != 100.0:
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(brightness / 100.0)
        
    if contrast != 100.0:
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(contrast / 100.0)

    # 4. Skala Dimensi (Resize)
    if 5.0 < scale_percent < 100.0:
        new_w = max(1, int(img.width * (scale_percent / 100.0)))
        new_h = max(1, int(img.height * (scale_percent / 100.0)))
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # 5. Skala Lembar Kertas
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

    # 6. Konversi ke CMYK jika dipilih mode CMYK
    if color_mode == "CMYK":
        img = img.convert("CMYK")

    output_buf = io.BytesIO()
    out_format_clean = format_out.lower()
    
    if out_format_clean == "pdf":
        img_temp = io.BytesIO()
        img.save(img_temp, format="JPEG", quality=quality)
        pdf_bytes = img2pdf.convert(img_temp.getvalue())
        output_buf.write(pdf_bytes)
        output_buf.seek(0)
        return StreamingResponse(
            output_buf, 
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=tools_ateka_output.pdf"}
        )
    elif out_format_clean == "png":
        if img.mode == "CMYK":
            img = img.convert("RGB")
        img.save(output_buf, format="PNG", optimize=True)
        output_buf.seek(0)
        return StreamingResponse(
            output_buf, 
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=tools_ateka_output.png"}
        )
    else:
        img.save(output_buf, format="JPEG", quality=quality, optimize=True)
        output_buf.seek(0)
        return StreamingResponse(
            output_buf, 
            media_type="image/jpeg",
            headers={"Content-Disposition": "attachment; filename=tools_ateka_output.jpg"}
        )
