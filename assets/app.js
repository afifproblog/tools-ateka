// ==========================================
// --- Proteksi Pintasan & Klik Kanan -------
// ==========================================
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key)) ||
        (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key))
    ) {
        e.preventDefault();
        return false;
    }
});

// Konfigurasi Worker PDF.js
if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ==========================================
// --- Data Array Katalog & Galeri v4.5 -----
// ==========================================
const CATALOG_ITEMS = [
    { src: "/assets/Konsultasi dan Pertanyaan Admin (1).jpg", alt: "Undangan Pernikahan", title: "Cetak Undangan", sub: "Berbagai Pilihan Desain" },
    { src: "/assets/SIE JAN MERAH.jpg", alt: "Pasfoto Resmi", title: "Pasfoto Studio Resmi", sub: "Merah / Biru / Putih" },
    { src: "/assets/Fotocopy.jpg", alt: "Fotokopi dan Scan", title: "Fotokopi & Scan F4/A4", sub: "High Contrast Word" },
    { src: "/assets/Jilid Lakban.jpg", alt: "Jilid Dokumen", title: "Jilid Dokumen", sub: "Lakban / Spiral / Hardcover" },
    { src: "/assets/Konsultasi dan Pertanyaan Admin.jpg", alt: "Brosur Layanan", title: "Cetak Brosur & Flyer", sub: "Full Color & Tajam" },
    { src: "/assets/865220-jasa-cetak-id-card-kualitas-high-(pvc-card)-.png", alt: "Cetak ID Card", title: "Cetak ID Card PVC", sub: "Bahan Kualitas Premium" },
    { src: "/assets/COVER PKK SMJ_001.jpg", alt: "Cover Laporan Tahunan", title: "Laporan Tahunan", sub: "Cover Custom & Jilid Rapi" },
    { src: "/assets/Untitled.png", alt: "Piagam & Sertifikat", title: "Piagam & Sertifikat", sub: "Kertas Linen / Concorde" },
    { src: "/assets/836436-6277-buku-sidu-58-lembar.png", alt: "Buku Tulis Sidu", title: "Buku Tulis SiDu", sub: "Grosir & Eceran" },
    { src: "/assets/PULPEN_BIASA.jpg", alt: "Pulpen", title: "Pulpen & Alat Tulis", sub: "Lancar & Nyaman Digunakan" },
    { src: "/assets/855705-stabillo-warna-joyko.png", alt: "Stabilo Joyko", title: "Highlighter Stabilo", sub: "Merk Joyko & Berbagai Warna" },
    { src: "/assets/855560-artline-spidol-kecil.png", alt: "Spidol Artline", title: "Spidol Marker", sub: "Tinta Pekat & Awet" },
    { src: "/assets/836435-6277-lakban-hitam-nachi-cloth-kain-tape-46-mm-x-12-meter.png", alt: "Lakban Nachi", title: "Lakban & Isolasi", sub: "Daya Rekat Ekstra Kuat" },
    { src: "/assets/855696-lem-uhu-besar-.png", alt: "Lem UHU", title: "Lem Perekat", sub: "Lem Kertas, Lem Fox & UHU" },
    { src: "/assets/855676-gunting-merk-alligator-uk-sedang.png", alt: "Gunting", title: "Gunting & Cutter", sub: "Tajam & Anti Karat" },
    { src: "/assets/866909-staples-kangaro-hd-10d.png", alt: "Staples Kangaro", title: "Staples & Isi", sub: "Kokoh & Anti Macet" },
    { src: "/assets/855686-joyko-binder-clip-no.-260.png", alt: "Binder Clip", title: "Binder Clip", sub: "Berbagai Ukuran" },
    { src: "/assets/map biola.jpg", alt: "Map Kertas", title: "Map Dokumen", sub: "Map Kertas Biola & Plastik" },
    { src: "/assets/836701-mouse-logitech-m170-wireless.png", alt: "Mouse Logitech", title: "Mouse Wireless", sub: "Logitech & Aksesoris PC" },
    { src: "/assets/836684-tinta-epson-original-008-hitam.png", alt: "Tinta Epson", title: "Tinta Printer", sub: "Epson Original 100%" },
    { src: "/assets/855640-gabus-styrofoam-mading.png", alt: "Styrofoam", title: "Gabus / Styrofoam", sub: "Kebutuhan Mading & Prakarya" },
    { src: "/assets/836697-kapur-tulis-sarjana-warna.png", alt: "Kapur Tulis", title: "Kapur Tulis Sarjana", sub: "Putih & Warna Warni" },
    { src: "/assets/836412-6277-flashdisk-hongtai-32-gb.png", alt: "Flashdisk Hongtai 32GB", title: "Flashdisk 32GB", sub: "Simpan Data Aman & Cepat" }
];

const GALLERY_ITEMS = [
    { src: "/assets/SITE PLAN ATEKA.jpg", alt: "Denah Lokasi / Site Plan", label: "Denah Lokasi (Site Plan)" },
    { src: "/assets/DEPAN 1.jpg", alt: "Tampak Depan 1", label: "Tampak Depan Toko" },
    { src: "/assets/DEPAN 2.jpg", alt: "Tampak Depan 2", label: "Area Parkir & Depan" },
    { src: "/assets/SAMPING.jpg", alt: "Tampak Samping", label: "Tampak Samping" }
];

function renderStaticGrids() {
    const catalogGrid = document.getElementById('catalogGrid');
    if (catalogGrid) {
        catalogGrid.innerHTML = CATALOG_ITEMS.map(item => `
            <div class="border border-slate-200 rounded-xl bg-slate-50 hover:shadow-md transition text-center flex flex-col overflow-hidden">
                <div class="h-36 bg-white flex items-center justify-center border-b border-slate-200/60 p-2">
                    <img loading="lazy" decoding="async" src="${item.src}" alt="${item.alt}" class="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-3 flex-1 flex flex-col justify-center">
                    <span class="text-xs font-bold text-slate-800 block">${item.title}</span>
                    <span class="text-[10px] text-slate-400 mt-1">${item.sub}</span>
                </div>
            </div>
        `).join('');
    }

    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        galleryGrid.innerHTML = GALLERY_ITEMS.map(g => `
            <div class="rounded-xl overflow-hidden border border-slate-200 h-48 md:h-64 relative group bg-slate-100 isolate transform-gpu">
                <img loading="lazy" decoding="async" src="${g.src}" alt="${g.alt}" class="w-full h-full object-cover transform-gpu will-change-transform group-hover:scale-105 transition-transform duration-300">
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent p-3 pointer-events-none">
                    <span class="text-white text-xs font-bold">${g.label}</span>
                </div>
            </div>
        `).join('');
    }
}

renderStaticGrids();

// ==========================================
// ------------ Set Global State ------------
// ==========================================
let pageItems = [];
let activePageIndex = 0;
let cropper = null;
let isCroppingActive = false;

let generatedBlobUrl = null;
let selectedFormat = "pdf";
let selectedColorMode = "RGB";

const fileInput = document.getElementById('fileInput');
const dropzone = document.getElementById('dropzone');
const mainPreviewImg = document.getElementById('mainPreviewImg');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const pageTabContainer = document.getElementById('pageTabContainer');
const fileBadge = document.getElementById('fileBadge');
const fileInfoText = document.getElementById('fileInfoText');

const btnStartCrop = document.getElementById('btnStartCrop');
const btnStartCropText = document.getElementById('btnStartCropText');
const cropStatusNotice = document.getElementById('cropStatusNotice');
const cropFloatingBar = document.getElementById('cropFloatingBar');
const btnApplyCropFloating = document.getElementById('btnApplyCropFloating');
const btnCancelCropFloating = document.getElementById('btnCancelCropFloating');

const bgColorType = document.getElementById('bgColorType');
const customHex = document.getElementById('customHex');

// ==========================================
// ------ Set Navigasi Menu Sidebar v4.5 ----
// ==========================================
window.switchMainTab = function (targetTab) {
    const views = {
        editor: { el: document.getElementById('viewEditor'), title: 'Workspace Dokumen & Pasfoto', btn: document.getElementById('tabBtnEditor') },
        dashboard: { el: document.getElementById('viewDashboard'), title: 'Dashboard & Etalase Layanan', btn: document.getElementById('tabBtnDashboard') },
        tutorial: { el: document.getElementById('viewTutorial'), title: 'Alur Tutorial Penggunaan Tools', btn: document.getElementById('tabBtnTutorial') },
        contact: { el: document.getElementById('viewContact'), title: 'Informasi Toko, Maps & Kontak', btn: document.getElementById('tabBtnContact') }
    };

    Object.keys(views).forEach(k => {
        views[k].el.classList.add('hidden');
        views[k].btn.className = "sidebar-item w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition";
    });

    if (views[targetTab]) {
        views[targetTab].el.classList.remove('hidden');
        views[targetTab].btn.className = "sidebar-item w-full flex items-center gap-3.5 px-3 py-3 rounded-xl bg-orange-500 text-white font-bold transition shadow-sm";
        document.getElementById('pageHeaderTitle').innerText = views[targetTab].title;
    }
};

dropzone.onclick = () => fileInput.click();

bgColorType.addEventListener('change', () => {
    if (bgColorType.value === 'custom') {
        customHex.classList.remove('hidden');
    } else {
        customHex.classList.add('hidden');
    }
});

// ==========================================
// ------ Set Upload & File Reading ---------
// ==========================================
fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const startIndex = pageItems.length;

    for (let fIdx = 0; fIdx < files.length; fIdx++) {
        const f = files[fIdx];
        const lowerName = f.name.toLowerCase();
        const isPdf = f.type === "application/pdf" || lowerName.endsWith(".pdf");
        const isSpecialRaw = lowerName.endsWith(".heic") || lowerName.endsWith(".heif") || lowerName.endsWith(".tiff") || lowerName.endsWith(".tif");

        if (isPdf) {
            const arrBuf = await f.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrBuf }).promise;
            for (let pNum = 1; pNum <= pdf.numPages; pNum++) {
                const page = await pdf.getPage(pNum);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
                pageItems.push({
                    title: `Hal ${pageItems.length + 1}: ${f.name.substring(0, 10)}...`,
                    src: dataUrl,
                    originalSrc: dataUrl,
                    cutoutSrc: null,
                    originalName: f.name,
                    hasCustomCrop: false
                });
            }
        } else if (isSpecialRaw) {
            try {
                const formPrev = new FormData();
                formPrev.append("file", f);
                const resp = await fetch('/api/convert-preview', {
                    method: 'POST',
                    body: formPrev
                });
                if (!resp.ok) throw new Error("Gagal mengurai preview format khusus");
                const blobPrev = await resp.blob();
                const prevDataUrl = await blobToDataURL(blobPrev);

                pageItems.push({
                    title: `Hal ${pageItems.length + 1}: ${f.name.substring(0, 12)}...`,
                    src: prevDataUrl,
                    originalSrc: prevDataUrl,
                    cutoutSrc: null,
                    originalName: f.name,
                    hasCustomCrop: false
                });
            } catch (err) {
                console.error("Gagal convert preview khusus:", err);
            }
        } else {
            const dataUrl = await readFileDataURL(f);
            pageItems.push({
                title: `Hal ${pageItems.length + 1}: ${f.name.substring(0, 12)}...`,
                src: dataUrl,
                originalSrc: dataUrl,
                cutoutSrc: null,
                originalName: f.name,
                hasCustomCrop: false
            });
        }
    }

    updateFileCountBadge();
    renderPageTabs();
    loadActivePage(startIndex);
    fileInput.value = '';
});

function updateFileCountBadge() {
    fileBadge.innerText = `${pageItems.length} Berkas`;
    fileInfoText.innerText = pageItems.length ? `${pageItems.length} berkas dipilih` : 'Pilih Berkas atau Jepret Foto';
}

function readFileDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

function blobToDataURL(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(blob);
    });
}

// ==========================================
// --- Set Render Tab & Delete Per Halaman --
// ==========================================
function deletePageItem(e, indexToDelete) {
    e.stopPropagation();
    if (isCroppingActive) exitCropMode(false);

    pageItems.splice(indexToDelete, 1);

    if (pageItems.length === 0) {
        document.getElementById('btnResetAll').click();
        return;
    }

    if (activePageIndex >= pageItems.length) {
        activePageIndex = pageItems.length - 1;
    }

    updateFileCountBadge();
    renderPageTabs();
    loadActivePage(activePageIndex);
    showCropToast("Halaman Dihapus", "Lembar terpilih telah dikeluarkan dari daftar antrean.");
}

function renderPageTabs() {
    pageTabContainer.innerHTML = '';
    pageItems.forEach((p, idx) => {
        const wrapper = document.createElement('div');
        const isActive = idx === activePageIndex;
        const cropBadge = p.hasCustomCrop ? ' ✂️' : '';

        wrapper.className = `flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap border transition cursor-pointer select-none ${isActive
            ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`;

        const labelSpan = document.createElement('span');
        labelSpan.innerText = `${p.title}${cropBadge}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.title = "Hapus lembar ini";
        deleteBtn.className = `w-4 h-4 rounded-full flex items-center justify-center text-[10px] leading-none transition ${isActive
            ? 'bg-white/20 hover:bg-white text-white hover:text-orange-600'
            : 'bg-slate-200 hover:bg-rose-500 text-slate-600 hover:text-white'
            }`;
        deleteBtn.innerHTML = "&times;";
        deleteBtn.onclick = (e) => deletePageItem(e, idx);

        wrapper.onclick = () => {
            if (isCroppingActive) exitCropMode(false);
            loadActivePage(idx);
        };

        wrapper.appendChild(labelSpan);
        wrapper.appendChild(deleteBtn);
        pageTabContainer.appendChild(wrapper);
    });
}

function loadActivePage(idx) {
    if (!pageItems[idx]) return;
    activePageIndex = idx;
    renderPageTabs();

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    isCroppingActive = false;
    cropFloatingBar.classList.add('hidden');
    btnStartCropText.innerText = "Potong Lembar Ini";
    btnStartCrop.className = "text-xs px-3 py-1.5 rounded-lg font-bold bg-orange-100 text-orange-800 hover:bg-orange-200 transition flex items-center gap-1.5";
    cropStatusNotice.innerHTML = "Gambar tampil penuh. Klik <b>Potong Lembar Ini</b> jika ingin memotong dokumen/pasfoto.";

    mainPreviewImg.classList.remove('hidden');
    previewPlaceholder.classList.add('hidden');
    mainPreviewImg.src = pageItems[idx].src;

    updateLiveFilters();
}

// ==========================================
// ------- Set Studio Crop Logic ------------
// ==========================================
btnStartCrop.addEventListener('click', () => {
    if (!pageItems.length) return;
    if (!isCroppingActive) {
        enterCropMode();
    } else {
        exitCropMode(true);
    }
});

function enterCropMode() {
    isCroppingActive = true;
    cropFloatingBar.classList.remove('hidden');
    btnStartCropText.innerText = "Selesai Potong";
    btnStartCrop.className = "text-xs px-3 py-1.5 rounded-lg font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition flex items-center gap-1.5";
    cropStatusNotice.innerHTML = "Atur kotak potong di bawah, lalu klik <b>✓</b> di sudut kanvas untuk menyimpan.";

    if (cropper) cropper.destroy();
    cropper = new Cropper(mainPreviewImg, {
        viewMode: 1,
        autoCropArea: 0.9,
        responsive: true,
        restore: false,
        zoomable: false,
        rotatable: true
    });
}

function exitCropMode(saveCrop) {
    if (cropper && saveCrop) {
        const croppedCanvas = cropper.getCroppedCanvas({
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        });
        if (croppedCanvas) {
            const croppedData = croppedCanvas.toDataURL('image/jpeg', 0.95);
            pageItems[activePageIndex].src = croppedData;
            pageItems[activePageIndex].originalSrc = croppedData;
            pageItems[activePageIndex].cutoutSrc = null;
            pageItems[activePageIndex].hasCustomCrop = true;
            mainPreviewImg.src = croppedData;
            showCropToast(`Hal ${activePageIndex + 1} Tersimpan!`, "Ukuran crop halaman ini berhasil dikunci.");
        }
    }

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    isCroppingActive = false;
    cropFloatingBar.classList.add('hidden');
    btnStartCropText.innerText = "Potong Lembar Ini";
    btnStartCrop.className = "text-xs px-3 py-1.5 rounded-lg font-bold bg-orange-100 text-orange-800 hover:bg-orange-200 transition flex items-center gap-1.5";
    cropStatusNotice.innerHTML = "Gambar tampil penuh. Klik <b>Potong Lembar Ini</b> jika ingin memotong dokumen/pasfoto.";

    renderPageTabs();
    updateLiveFilters();
}

btnApplyCropFloating.onclick = () => exitCropMode(true);
btnCancelCropFloating.onclick = () => exitCropMode(false);

let toastTimer = null;
function showCropToast(title, subtitle) {
    const toast = document.getElementById('cropToast');
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastSubtitle').innerText = subtitle;
    toast.classList.remove('translate-y-[-100px]', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-100px]', 'opacity-0');
    }, 2200);
}

document.querySelectorAll('.btn-ratio').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isCroppingActive) enterCropMode();
        const ratio = parseFloat(btn.getAttribute('data-ratio'));
        if (cropper) cropper.setAspectRatio(isNaN(ratio) ? NaN : ratio);
    });
});

document.getElementById('btnApplyCustomRatio').addEventListener('click', () => {
    const w = parseFloat(document.getElementById('customRatioW').value);
    const h = parseFloat(document.getElementById('customRatioH').value);
    if (w > 0 && h > 0) {
        if (!isCroppingActive) enterCropMode();
        if (cropper) cropper.setAspectRatio(w / h);
    }
});

// ==========================================
// ---------- Set Format & Mode Warna -------
// ==========================================
document.querySelectorAll('.btn-format').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-format').forEach(b => {
            b.className = "btn-format py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100";
        });
        btn.className = "btn-format py-2 px-3 text-xs font-bold rounded-xl border border-orange-500 bg-orange-500 text-white shadow-sm";
        selectedFormat = btn.getAttribute('data-val');
    });
});

document.querySelectorAll('.btn-cmode').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-cmode').forEach(b => {
            b.className = "btn-cmode py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100";
        });
        btn.className = "btn-cmode py-2 px-3 text-xs font-bold rounded-xl border border-orange-500 bg-orange-500 text-white shadow-sm";
        selectedColorMode = btn.getAttribute('data-val');
    });
});

// ==========================================
// ------ Set Rotasi & Flip Lembar ----------
// ==========================================
const sliderFineAngle = document.getElementById('sliderFineAngle');
const lblFineAngle = document.getElementById('lblFineAngle');

sliderFineAngle.oninput = () => {
    const deg = parseFloat(sliderFineAngle.value) || 0;
    lblFineAngle.innerText = `${deg > 0 ? '+' : ''}${deg}°`;
    if (isCroppingActive && cropper) {
        cropper.rotateTo(deg);
    } else {
        mainPreviewImg.style.transform = `rotate(${deg}deg)`;
    }
};

document.getElementById('btnResetFineAngle').onclick = () => {
    sliderFineAngle.value = 0;
    lblFineAngle.innerText = '0°';
    if (isCroppingActive && cropper) {
        cropper.rotateTo(0);
    } else {
        mainPreviewImg.style.transform = 'rotate(0deg)';
    }
};

document.getElementById('btnApplyFineAngle').onclick = () => {
    const deg = parseFloat(sliderFineAngle.value) || 0;
    if (deg === 0) return;
    transformCurrentImage(deg);
    sliderFineAngle.value = 0;
    lblFineAngle.innerText = '0°';
    mainPreviewImg.style.transform = 'rotate(0deg)';
    showCropToast("Kemiringan Diterapkan!", `Dokumen diputar ${deg}° secara permanen.`);
};

function transformCurrentImage(degrees, flipHorizontal = false, flipVertical = false) {
    if (!pageItems[activePageIndex]) return;

    if (isCroppingActive) {
        if (cropper) {
            if (degrees !== 0) cropper.rotate(degrees);
            if (flipHorizontal) cropper.scaleX(cropper.getData().scaleX * -1);
            if (flipVertical) cropper.scaleY(cropper.getData().scaleY * -1);
        }
        return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const rad = (degrees * Math.PI) / 180;
        const absCos = Math.abs(Math.cos(rad));
        const absSin = Math.abs(Math.sin(rad));

        canvas.width = Math.round(img.width * absCos + img.height * absSin);
        canvas.height = Math.round(img.width * absSin + img.height * absCos);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (degrees !== 0) ctx.rotate(rad);
        if (flipHorizontal) ctx.scale(-1, 1);
        if (flipVertical) ctx.scale(1, -1);

        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        const rotatedData = canvas.toDataURL('image/jpeg', 0.95);
        pageItems[activePageIndex].src = rotatedData;
        pageItems[activePageIndex].originalSrc = rotatedData;
        pageItems[activePageIndex].cutoutSrc = null;
        mainPreviewImg.src = rotatedData;
    };
    img.src = pageItems[activePageIndex].src;
}

document.getElementById('btnRotateLeft').onclick = () => transformCurrentImage(-90);
document.getElementById('btnRotateRight').onclick = () => transformCurrentImage(90);
document.getElementById('btnFlipH').onclick = () => transformCurrentImage(0, true, false);
document.getElementById('btnFlipV').onclick = () => transformCurrentImage(0, false, true);

// ==========================================
// ---------- Set Filter Slider -------------
// ==========================================
const sBright = document.getElementById('sliderBrightness');
const sContrast = document.getElementById('sliderContrast');
const sSharp = document.getElementById('sliderSharpness');

function updateLiveFilters() {
    const b = sBright.value;
    const c = sContrast.value;
    const s = sSharp.value;

    document.getElementById('lblBrightness').innerText = `${b}%`;
    document.getElementById('lblContrast').innerText = `${c}%`;
    document.getElementById('lblSharpness').innerText = `${s}%`;

    let filterVal = `brightness(${b}%) contrast(${c}%)`;
    if (s > 100) {
        const extraContrast = 100 + (s - 100) * 0.4;
        filterVal += ` contrast(${extraContrast}%)`;
    }

    mainPreviewImg.style.filter = filterVal;
}

sBright.oninput = updateLiveFilters;
sContrast.oninput = updateLiveFilters;
sSharp.oninput = updateLiveFilters;

document.getElementById('btnResetFilters').onclick = () => {
    sBright.value = 100; sContrast.value = 100; sSharp.value = 100;
    updateLiveFilters();
};

document.getElementById('btnResetAll').addEventListener('click', () => {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    pageItems = [];
    activePageIndex = 0;

    fileInput.value = '';
    fileBadge.innerText = '0 Berkas';
    fileInfoText.innerText = 'Pilih Berkas atau Jepret Foto';

    mainPreviewImg.src = '';
    mainPreviewImg.classList.add('hidden');
    previewPlaceholder.classList.remove('hidden');
    cropFloatingBar.classList.add('hidden');

    pageTabContainer.innerHTML = '';
    document.getElementById('btnResetFilters').click();
});

// =========================================================================
// ----- STUDIO KUAS, BOX, & POLYGON LASSO PRESISI (STABIL & ANTI KEDIP) -----
// =========================================================================
const brushModal = document.getElementById('brushModal');
const brushCanvasWrapper = document.getElementById('brushCanvasWrapper');
const brushStage = document.getElementById('brushStage');
const brushCanvas = document.getElementById('brushCanvas');
const brushCtx = brushCanvas.getContext('2d', { willReadFrequently: true });
const brushGhostImg = document.getElementById('brushGhostImg');
const brushCursorRing = document.getElementById('brushCursorRing');
const boxSelectionOverlay = document.getElementById('boxSelectionOverlay');

const btnOpenBrushStudio = document.getElementById('btnOpenBrushStudio');
const btnBrushErase = document.getElementById('btnBrushErase');
const btnBrushRestore = document.getElementById('btnBrushRestore');
const btnBrushBox = document.getElementById('btnBrushBox');
const btnBrushBoxErase = document.getElementById('btnBrushBoxErase');
const btnPolyErase = document.getElementById('btnPolyErase');
const btnPolyRestore = document.getElementById('btnPolyRestore');
const btnPanHand = document.getElementById('btnPanHand');

const polygonOverlayCanvas = document.getElementById('polygonOverlayCanvas');
const polygonCtx = polygonOverlayCanvas.getContext('2d');

const brushSizeSlider = document.getElementById('brushSizeSlider');
const brushSizeLabel = document.getElementById('brushSizeLabel');
const ghostOpacitySlider = document.getElementById('ghostOpacitySlider');

const btnZoomOut = document.getElementById('btnZoomOut');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnFitScreen = document.getElementById('btnFitScreen');
const zoomPercentText = document.getElementById('zoomPercentText');

const btnCancelBrush = document.getElementById('btnCancelBrush');
const btnSaveBrush = document.getElementById('btnSaveBrush');

let currentBrushMode = 'restore';
let isPainting = false;
let isPanning = false;
let isDrawingBox = false;
let isBuildingPolygon = false;
let isSpacebarHeld = false;

let polygonPoints = [];
let currentPolygonMousePos = null;

let panStartX = 0;
let panStartY = 0;
let panOffsetX = 0;
let panOffsetY = 0;
let currentZoom = 1.0;
let fitScreenBaseScale = 1.0;

let editorDownscaleRatio = 1.0;
let rawOriginalWidth = 0;
let rawOriginalHeight = 0;

let boxStartPos = { x: 0, y: 0, clientX: 0, clientY: 0 };
let brushOriginalImg = new Image();
let brushRestorePattern = null;

// --- TAMBAHAN BARU: Variabel Undo & Brush Smooth ---
let brushHistory = []; 
const MAX_HISTORY_STEPS = 15; 
let isPointsArray = []; 
let lastBrushPoint = null; 

function saveHistoryState() {
    if (brushHistory.length >= MAX_HISTORY_STEPS) brushHistory.shift();
    brushHistory.push(brushCanvas.toDataURL('image/png'));
}

function undoLastAction() {
    if (brushHistory.length === 0) return; 
    const previousState = brushHistory.pop();
    const img = new Image();
    img.onload = () => {
        brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
        brushCtx.globalCompositeOperation = 'source-over'; 
        brushCtx.drawImage(img, 0, 0);
    };
    img.src = previousState;
}

function isRoundBrushMode() {
    return (currentBrushMode === 'erase' || currentBrushMode === 'restore') && !isSpacebarHeld;
}

function isPolygonMode() {
    return currentBrushMode === 'poly_erase' || currentBrushMode === 'poly_restore';
}

brushSizeSlider.oninput = () => {
    brushSizeLabel.innerText = brushSizeSlider.value;
    updateCursorRingSize();
};

ghostOpacitySlider.oninput = () => {
    brushGhostImg.style.opacity = (ghostOpacitySlider.value / 100);
};

function setBrushToolMode(mode) {
    currentBrushMode = mode;
    const allBtns = [btnBrushErase, btnBrushRestore, btnBrushBoxErase, btnBrushBox, btnPolyErase, btnPolyRestore, btnPanHand];
    allBtns.forEach(b => {
        if (b) b.className = "px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition";
    });

    boxSelectionOverlay.classList.add('hidden');
    resetPolygonState();

    // --- TAMBAHAN BARU: Teks Keterangan Dinamis ---
    const tipTextElement = document.querySelector('#brushModal .px-4.py-2.bg-slate-50 span:first-child');
    const TOOL_TIPS = {
        'erase': "💡 Gunakan <b>🧹 Erase</b> untuk menghapus latar/objek secara presisi mengikuti kursor.",
        'restore': "💡 Gunakan <b>🖌️ Restore</b> untuk memunculkan kembali gambar asli yang terhapus AI.",
        'box_erase': "💡 Gunakan <b>🟥 Box Erase</b> lalu tarik kotak untuk menghapus blok area besar seketika.",
        'box': "💡 Gunakan <b>🟩 Box Restore</b> lalu tarik kotak untuk memulihkan blok teks/tabel sekali klik.",
        'poly_erase': "💡 Gunakan <b>📐 Poly Erase</b> (Klik titik ke titik). Klik ganda di akhir untuk menghapus area.",
        'poly_restore': "💡 Gunakan <b>📐 Poly Restore</b> (Klik titik ke titik) untuk memulihkan area bersudut tajam.",
        'pan': "💡 Gunakan <b>✋ Pan</b> atau tahan tombol <b>SPASI</b> untuk menggeser-geser area kanvas."
    };
    if (tipTextElement && TOOL_TIPS[mode]) tipTextElement.innerHTML = TOOL_TIPS[mode];

    if (mode === 'erase') {
        btnBrushErase.className = "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-500 text-white shadow-sm transition";
        brushCanvasWrapper.style.cursor = 'none';
        brushCursorRing.className = "absolute pointer-events-none rounded-full border-2 border-rose-500 bg-rose-500/20 z-30 transform -translate-x-1/2 -translate-y-1/2";
    } else if (mode === 'restore') {
        btnBrushRestore.className = "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm transition";
        brushCanvasWrapper.style.cursor = 'none';
        brushCursorRing.className = "absolute pointer-events-none rounded-full border-2 border-emerald-500 bg-emerald-500/20 z-30 transform -translate-x-1/2 -translate-y-1/2";
    } else if (mode === 'box_erase') {
        btnBrushBoxErase.className = "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white shadow-sm transition";
        brushCanvasWrapper.style.cursor = 'crosshair';
        brushCursorRing.classList.add('hidden');
    } else if (mode === 'box') {
        btnBrushBox.className = "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm transition";
        brushCanvasWrapper.style.cursor = 'crosshair';
        brushCursorRing.classList.add('hidden');
    } else if (mode === 'poly_erase') {
        btnPolyErase.className = "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white shadow-sm transition";
        brushCanvasWrapper.style.cursor = 'crosshair';
        brushCursorRing.classList.add('hidden');
    } else if (mode === 'poly_restore') {
        btnPolyRestore.className = "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm transition";
        brushCanvasWrapper.style.cursor = 'crosshair';
        brushCursorRing.classList.add('hidden');
    } else if (mode === 'pan') {
        btnPanHand.className = "px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-white shadow-sm transition";
        brushCanvasWrapper.style.cursor = 'grab';
        brushCursorRing.classList.add('hidden');
    }
    updateCursorRingSize();
}

btnBrushErase.onclick = () => setBrushToolMode('erase');
btnBrushRestore.onclick = () => setBrushToolMode('restore');
btnBrushBoxErase.onclick = () => setBrushToolMode('box_erase');
btnBrushBox.onclick = () => setBrushToolMode('box');
btnPolyErase.onclick = () => setBrushToolMode('poly_erase');
btnPolyRestore.onclick = () => setBrushToolMode('poly_restore');
btnPanHand.onclick = () => setBrushToolMode('pan');

function resetPolygonState() {
    isBuildingPolygon = false;
    polygonPoints = [];
    currentPolygonMousePos = null;
    if (polygonOverlayCanvas) {
        polygonOverlayCanvas.classList.add('hidden');
        polygonCtx.clearRect(0, 0, polygonOverlayCanvas.width, polygonOverlayCanvas.height);
    }
}

function applyStageTransform() {
    brushStage.style.transform = `translate(${panOffsetX}px, ${panOffsetY}px) scale(${currentZoom})`;
    zoomPercentText.innerText = `${Math.round((currentZoom / fitScreenBaseScale) * 100)}%`;
    updateCursorRingSize();
    if (isBuildingPolygon) renderPolygonOverlay();
}

function calculateFitToScreen() {
    const wrapperRect = brushCanvasWrapper.getBoundingClientRect();
    const availableW = wrapperRect.width - 40;
    const availableH = wrapperRect.height - 40;

    const imgW = brushCanvas.width || 1;
    const imgH = brushCanvas.height || 1;

    const scaleW = availableW / imgW;
    const scaleH = availableH / imgH;
    fitScreenBaseScale = Math.min(scaleW, scaleH, 1.0);

    currentZoom = fitScreenBaseScale;
    panOffsetX = Math.round((wrapperRect.width - (imgW * currentZoom)) / 2);
    panOffsetY = Math.round((wrapperRect.height - (imgH * currentZoom)) / 2);

    applyStageTransform();
}

btnFitScreen.onclick = () => calculateFitToScreen();
btnZoomIn.onclick = () => {
    currentZoom = Math.min(currentZoom * 1.25, fitScreenBaseScale * 5.0);
    applyStageTransform();
};
btnZoomOut.onclick = () => {
    currentZoom = Math.max(currentZoom / 1.25, fitScreenBaseScale * 0.3);
    applyStageTransform();
};

btnOpenBrushStudio.onclick = async () => {
    if (!pageItems.length || !pageItems[activePageIndex]) {
        alert("Harap pilih lembar berkas terlebih dahulu.");
        return;
    }

    const currItem = pageItems[activePageIndex];
    btnOpenBrushStudio.disabled = true;
    btnOpenBrushStudio.innerHTML = `<span>⏳ AI Sedang Memotong...</span>`;

    try {
        if (!currItem.cutoutSrc) {
            const blob = dataURLtoBlob(currItem.originalSrc || currItem.src);
            const formData = new FormData();
            formData.append('file', blob, 'image.png');

            const resp = await fetch('/api/remove-bg-preview', {
                method: 'POST',
                body: formData
            });

            if (!resp.ok) throw new Error("Gagal mengeksekusi AI potongan dari server.");

            const resultBlob = await resp.blob();
            currItem.cutoutSrc = await blobToDataURL(resultBlob);
        }

        const editImg = new Image();
        editImg.crossOrigin = "anonymous";
        editImg.onload = () => {
            rawOriginalWidth = editImg.width;
            rawOriginalHeight = editImg.height;

            const MAX_DIM = 1200;
            const maxCurrentDim = Math.max(rawOriginalWidth, rawOriginalHeight);
            editorDownscaleRatio = maxCurrentDim > MAX_DIM ? (MAX_DIM / maxCurrentDim) : 1.0;

            brushCanvas.width = Math.round(rawOriginalWidth * editorDownscaleRatio);
            brushCanvas.height = Math.round(rawOriginalHeight * editorDownscaleRatio);

            brushCtx.imageSmoothingEnabled = true;
            brushCtx.imageSmoothingQuality = 'high';
            brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
            brushCtx.drawImage(editImg, 0, 0, brushCanvas.width, brushCanvas.height);

            brushHistory = []; // Reset history saat buka modal
            brushOriginalImg.crossOrigin = "anonymous";
            brushOriginalImg.onload = () => {
                const patternCanvas = document.createElement('canvas');
                patternCanvas.width = brushCanvas.width;
                patternCanvas.height = brushCanvas.height;
                const pCtx = patternCanvas.getContext('2d');
                pCtx.imageSmoothingEnabled = true;
                pCtx.imageSmoothingQuality = 'high';
                pCtx.drawImage(brushOriginalImg, 0, 0, brushCanvas.width, brushCanvas.height);
                brushRestorePattern = brushCtx.createPattern(patternCanvas, 'no-repeat');

                brushGhostImg.src = brushOriginalImg.src;
                brushGhostImg.style.width = `${brushCanvas.width}px`;
                brushGhostImg.style.height = `${brushCanvas.height}px`;
                brushGhostImg.style.opacity = (ghostOpacitySlider.value / 100);

                brushModal.classList.remove('hidden');
                brushModal.classList.add('flex');

                setBrushToolMode('restore');

                setTimeout(() => {
                    calculateFitToScreen();
                }, 60);
            };
            brushOriginalImg.src = currItem.originalSrc || currItem.src;
        };
        editImg.src = currItem.cutoutSrc;

    } catch (err) {
        alert("Terjadi kendala: " + err.message);
    } finally {
        btnOpenBrushStudio.disabled = false;
        btnOpenBrushStudio.innerHTML = `<span>🖌️</span> Kuas Manual (Erase / Restore)`;
    }
};

function getCanvasCoordinates(e) {
    const rect = brushCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = brushCanvas.width / (rect.width || 1);
    const scaleY = brushCanvas.height / (rect.height || 1);

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
        clientX: clientX,
        clientY: clientY
    };
}

// --- TAMBAHAN BARU: Optimasi Lengkungan Smooth Brush ---
function drawSmoothBrushLine() {
    if (isPointsArray.length < 3) return; 

    const radius = parseInt(brushSizeSlider.value, 10);
    brushCtx.save();
    brushCtx.lineCap = 'round';
    brushCtx.lineJoin = 'round';
    brushCtx.lineWidth = radius * 2;

    brushCtx.beginPath();
    brushCtx.moveTo(isPointsArray[0].x, isPointsArray[0].y);

    for (let i = 1; i < isPointsArray.length - 2; i++) {
        const c = (isPointsArray[i].x + isPointsArray[i + 1].x) / 2;
        const d = (isPointsArray[i].y + isPointsArray[i + 1].y) / 2;
        brushCtx.quadraticCurveTo(isPointsArray[i].x, isPointsArray[i].y, c, d);
    }

    const pLen = isPointsArray.length;
    brushCtx.quadraticCurveTo(
        isPointsArray[pLen - 2].x, isPointsArray[pLen - 2].y, 
        isPointsArray[pLen - 1].x, isPointsArray[pLen - 1].y
    );

    if (currentBrushMode === 'erase') {
        brushCtx.globalCompositeOperation = 'destination-out';
        brushCtx.stroke();
    } else if (currentBrushMode === 'restore' && brushRestorePattern) {
        brushCtx.globalCompositeOperation = 'source-over';
        brushCtx.strokeStyle = brushRestorePattern;
        brushCtx.stroke();
    }
    brushCtx.restore();
}

function applyBrushStrokeSingle(x, y) {
    const radius = parseInt(brushSizeSlider.value, 10);
    brushCtx.save();
    brushCtx.beginPath();
    brushCtx.arc(x, y, radius, 0, Math.PI * 2);

    if (currentBrushMode === 'erase') {
        brushCtx.globalCompositeOperation = 'destination-out';
        brushCtx.fill();
    } else if (currentBrushMode === 'restore') {
        brushCtx.globalCompositeOperation = 'source-over';
        if (brushRestorePattern) {
            brushCtx.fillStyle = brushRestorePattern;
            brushCtx.fill();
        } else {
            brushCtx.clip();
            brushCtx.drawImage(brushOriginalImg, 0, 0, brushCanvas.width, brushCanvas.height);
        }
    }
    brushCtx.restore();
}

function updateCursorRingPosition(clientX, clientY) {
    const wrapperRect = brushCanvasWrapper.getBoundingClientRect();
    brushCursorRing.style.left = `${clientX - wrapperRect.left}px`;
    brushCursorRing.style.top = `${clientY - wrapperRect.top}px`;
}

function updateCursorRingSize() {
    if (!isRoundBrushMode()) {
        brushCursorRing.classList.add('hidden');
        return;
    }
    const radius = parseInt(brushSizeSlider.value, 10);
    const ringDiameter = (radius * 2) * currentZoom;
    brushCursorRing.style.width = `${ringDiameter}px`;
    brushCursorRing.style.height = `${ringDiameter}px`;
}

function renderPolygonOverlay() {
    if (!isBuildingPolygon || polygonPoints.length === 0) return;

    const wrapperRect = brushCanvasWrapper.getBoundingClientRect();
    const canvasRect = brushCanvas.getBoundingClientRect();

    if (polygonOverlayCanvas.width !== wrapperRect.width || polygonOverlayCanvas.height !== wrapperRect.height) {
        polygonOverlayCanvas.width = wrapperRect.width;
        polygonOverlayCanvas.height = wrapperRect.height;
    }

    polygonCtx.clearRect(0, 0, polygonOverlayCanvas.width, polygonOverlayCanvas.height);

    const isErase = currentBrushMode === 'poly_erase';
    const strokeColor = isErase ? '#e11d48' : '#059669';
    const fillColor = isErase ? 'rgba(225, 29, 72, 0.18)' : 'rgba(5, 150, 105, 0.18)';

    const toScreen = (pt) => ({
        x: (pt.x * (canvasRect.width / (brushCanvas.width || 1))) + (canvasRect.left - wrapperRect.left),
        y: (pt.y * (canvasRect.height / (brushCanvas.height || 1))) + (canvasRect.top - wrapperRect.top)
    });

    const screenPts = polygonPoints.map(toScreen);

    polygonCtx.save();
    polygonCtx.lineWidth = 2;
    polygonCtx.strokeStyle = strokeColor;
    polygonCtx.fillStyle = fillColor;

    polygonCtx.beginPath();
    screenPts.forEach((sp, idx) => {
        if (idx === 0) polygonCtx.moveTo(sp.x, sp.y);
        else polygonCtx.lineTo(sp.x, sp.y);
    });

    if (currentPolygonMousePos) {
        const mouseScreen = toScreen(currentPolygonMousePos);
        polygonCtx.lineTo(mouseScreen.x, mouseScreen.y);
    }

    if (screenPts.length >= 2) polygonCtx.fill();
    polygonCtx.stroke();

    screenPts.forEach((sp, idx) => {
        polygonCtx.beginPath();
        if (idx === 0) {
            polygonCtx.arc(sp.x, sp.y, 5, 0, Math.PI * 2);
            polygonCtx.fillStyle = '#ffffff';
            polygonCtx.fill();
            polygonCtx.lineWidth = 2.5;
            polygonCtx.strokeStyle = strokeColor;
            polygonCtx.stroke();
        } else {
            polygonCtx.fillStyle = strokeColor;
            polygonCtx.fillRect(sp.x - 3, sp.y - 3, 6, 6);
        }
    });
    polygonCtx.restore();
}

function executePolygonAction(mode) {
    if (polygonPoints.length < 3) return;
    brushCtx.save();
    brushCtx.beginPath();
    polygonPoints.forEach((pt, idx) => {
        if (idx === 0) brushCtx.moveTo(pt.x, pt.y);
        else brushCtx.lineTo(pt.x, pt.y);
    });
    brushCtx.closePath();

    if (mode === 'poly_erase') {
        brushCtx.globalCompositeOperation = 'destination-out';
        brushCtx.fill();
    } else if (mode === 'poly_restore') {
        brushCtx.globalCompositeOperation = 'source-over';
        if (brushRestorePattern) {
            brushCtx.fillStyle = brushRestorePattern;
            brushCtx.fill();
        } else {
            brushCtx.clip();
            brushCtx.drawImage(brushOriginalImg, 0, 0, brushCanvas.width, brushCanvas.height);
        }
    }
    brushCtx.restore();
}

brushCanvasWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const newZoom = currentZoom * zoomFactor;

    if (newZoom >= fitScreenBaseScale * 0.3 && newZoom <= fitScreenBaseScale * 6.0) {
        const wrapperRect = brushCanvasWrapper.getBoundingClientRect();
        const mouseX = e.clientX - wrapperRect.left;
        const mouseY = e.clientY - wrapperRect.top;

        panOffsetX = mouseX - (mouseX - panOffsetX) * zoomFactor;
        panOffsetY = mouseY - (mouseY - panOffsetY) * zoomFactor;
        currentZoom = newZoom;
        applyStageTransform();
    }
}, { passive: false });

brushCanvasWrapper.addEventListener('mouseenter', () => {
    if (isRoundBrushMode()) brushCursorRing.classList.remove('hidden');
    else brushCursorRing.classList.add('hidden');
});

brushCanvasWrapper.addEventListener('mouseleave', () => {
    brushCursorRing.classList.add('hidden');
    isPainting = false;
    isPanning = false;
    lastBrushPoint = null;
    isPointsArray = [];
    if (isDrawingBox) {
        isDrawingBox = false;
        boxSelectionOverlay.classList.add('hidden');
    }
});

brushCanvasWrapper.addEventListener('mousedown', (e) => {
    if (currentBrushMode === 'pan' || isSpacebarHeld || e.button === 2) {
        isPanning = true;
        panStartX = e.clientX - panOffsetX;
        panStartY = e.clientY - panOffsetY;
        brushCanvasWrapper.style.cursor = 'grabbing';
        e.preventDefault();
        return;
    }
    if (e.button !== 0) return;

    if (isPolygonMode()) {
        const pos = getCanvasCoordinates(e);
        const wrapperRect = brushCanvasWrapper.getBoundingClientRect();

        if (!isBuildingPolygon) {
            saveHistoryState(); // Simpan riwayat sebelum bikin titik polygon pertama
            isBuildingPolygon = true;
            polygonPoints = [pos];
            currentPolygonMousePos = pos;
            polygonOverlayCanvas.width = wrapperRect.width;
            polygonOverlayCanvas.height = wrapperRect.height;
            polygonOverlayCanvas.classList.remove('hidden');
        } else {
            const canvasRect = brushCanvas.getBoundingClientRect();
            const firstPt = polygonPoints[0];
            const firstScreenX = (firstPt.x * (canvasRect.width / (brushCanvas.width || 1))) + canvasRect.left;
            const firstScreenY = (firstPt.y * (canvasRect.height / (brushCanvas.height || 1))) + canvasRect.top;
            const screenDist = Math.hypot(e.clientX - firstScreenX, e.clientY - firstScreenY);

            if (screenDist < 16 && polygonPoints.length >= 3) {
                executePolygonAction(currentBrushMode);
                resetPolygonState();
                e.preventDefault();
                return;
            }

            const lastPt = polygonPoints[polygonPoints.length - 1];
            if (Math.hypot(pos.x - lastPt.x, pos.y - lastPt.y) > 2) {
                polygonPoints.push(pos);
            }
        }
        renderPolygonOverlay();
        e.preventDefault();
        return;
    }

    if (currentBrushMode === 'box' || currentBrushMode === 'box_erase') {
        saveHistoryState(); // Simpan riwayat sebelum bikin kotak
        isDrawingBox = true;
        const pos = getCanvasCoordinates(e);
        boxStartPos = pos;
        const wrapperRect = brushCanvasWrapper.getBoundingClientRect();
        boxSelectionOverlay.className = `absolute pointer-events-none border-2 z-20 ${currentBrushMode === 'box_erase' ? 'border-rose-500 bg-rose-500/20' : 'border-emerald-500 bg-emerald-500/20'}`;
        boxSelectionOverlay.style.left = `${pos.clientX - wrapperRect.left}px`;
        boxSelectionOverlay.style.top = `${pos.clientY - wrapperRect.top}px`;
        boxSelectionOverlay.style.width = `0px`;
        boxSelectionOverlay.style.height = `0px`;
        boxSelectionOverlay.classList.remove('hidden');
        e.preventDefault();
        return;
    }

    if (currentBrushMode === 'erase' || currentBrushMode === 'restore') {
        saveHistoryState(); // Simpan riwayat sebelum mulai gores
        isPainting = true;
        const pos = getCanvasCoordinates(e);
        isPointsArray = [pos]; // Mulai array titik buat garis mulus
        updateCursorRingPosition(pos.clientX, pos.clientY);
        applyBrushStrokeSingle(pos.x, pos.y);
        e.preventDefault();
    }
});

brushCanvasWrapper.addEventListener('dblclick', (e) => {
    if (isPolygonMode() && isBuildingPolygon && polygonPoints.length >= 3) {
        executePolygonAction(currentBrushMode);
        resetPolygonState();
        e.preventDefault();
    }
});

window.addEventListener('mousemove', (e) => {
    if (isPanning) {
        panOffsetX = e.clientX - panStartX;
        panOffsetY = e.clientY - panStartY;
        applyStageTransform();
        return;
    }

    if (isDrawingBox) {
        const wrapperRect = brushCanvasWrapper.getBoundingClientRect();
        const curLeft = Math.min(boxStartPos.clientX, e.clientX) - wrapperRect.left;
        const curTop = Math.min(boxStartPos.clientY, e.clientY) - wrapperRect.top;
        const curWidth = Math.abs(e.clientX - boxStartPos.clientX);
        const curHeight = Math.abs(e.clientY - boxStartPos.clientY);

        boxSelectionOverlay.style.left = `${curLeft}px`;
        boxSelectionOverlay.style.top = `${curTop}px`;
        boxSelectionOverlay.style.width = `${curWidth}px`;
        boxSelectionOverlay.style.height = `${curHeight}px`;
        return;
    }

    if (isBuildingPolygon && isPolygonMode()) {
        currentPolygonMousePos = getCanvasCoordinates(e);
        renderPolygonOverlay();
        return;
    }

    if (!brushModal.classList.contains('hidden')) {
        if (isRoundBrushMode()) updateCursorRingPosition(e.clientX, e.clientY);
        if (isPainting) {
            const pos = getCanvasCoordinates(e);
            isPointsArray.push(pos);
            drawSmoothBrushLine(); // Panggil fungsi garis mulus anti-patah
        }
    }
});

window.addEventListener('mouseup', (e) => {
    if (isPanning) {
        isPanning = false;
        brushCanvasWrapper.style.cursor = (currentBrushMode === 'pan' || isSpacebarHeld)
            ? 'grab' : (isRoundBrushMode() ? 'none' : 'crosshair');
    }

    if (isDrawingBox) {
        isDrawingBox = false;
        boxSelectionOverlay.classList.add('hidden');
        const pos = getCanvasCoordinates(e);

        const x = Math.min(boxStartPos.x, pos.x);
        const y = Math.min(boxStartPos.y, pos.y);
        const w = Math.abs(pos.x - boxStartPos.x);
        const h = Math.abs(pos.y - boxStartPos.y);

        if (w > 2 && h > 2) {
            brushCtx.save();
            if (currentBrushMode === 'box_erase') {
                brushCtx.globalCompositeOperation = 'destination-out';
                brushCtx.fillRect(x, y, w, h);
            } else if (currentBrushMode === 'box') {
                brushCtx.globalCompositeOperation = 'source-over';
                if (brushRestorePattern) {
                    brushCtx.fillStyle = brushRestorePattern;
                    brushCtx.fillRect(x, y, w, h);
                } else {
                    brushCtx.beginPath();
                    brushCtx.rect(x, y, w, h);
                    brushCtx.clip();
                    brushCtx.drawImage(brushOriginalImg, 0, 0, brushCanvas.width, brushCanvas.height);
                }
            }
            brushCtx.restore();
        }
    }

    isPainting = false;
    lastBrushPoint = null;
    isPointsArray = []; // Kosongkan titik saat mouse dilepas
});

window.addEventListener('keydown', (e) => {
    if (brushModal.classList.contains('hidden')) return;

    // --- TAMBAHAN BARU: Ctrl+Z untuk membatalkan goresan (Undo) ---
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        undoLastAction();
        e.preventDefault();
        return; 
    }

    if (e.code === 'Space' && !isSpacebarHeld) {
        isSpacebarHeld = true;
        brushCanvasWrapper.style.cursor = 'grab';
        brushCursorRing.classList.add('hidden');
        e.preventDefault();
    } else if (e.key === 'Enter' && isBuildingPolygon) {
        if (polygonPoints.length >= 3) executePolygonAction(currentBrushMode);
        resetPolygonState();
        e.preventDefault();
    } else if (e.key === 'Backspace' && isBuildingPolygon) {
        polygonPoints.pop();
        if (polygonPoints.length === 0) resetPolygonState();
        else renderPolygonOverlay();
        e.preventDefault();
    } else if (e.key === 'Escape' && isBuildingPolygon) {
        resetPolygonState();
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        isSpacebarHeld = false;
        if (isRoundBrushMode()) {
            brushCanvasWrapper.style.cursor = 'none';
            brushCursorRing.classList.remove('hidden');
        } else if (currentBrushMode === 'pan') {
            brushCanvasWrapper.style.cursor = 'grab';
        } else {
            brushCanvasWrapper.style.cursor = 'crosshair';
        }
    }
});

brushCanvasWrapper.addEventListener('contextmenu', (e) => e.preventDefault());

btnCancelBrush.onclick = () => {
    resetPolygonState();
    brushModal.classList.add('hidden');
    brushModal.classList.remove('flex');
};

btnSaveBrush.onclick = () => {
    resetPolygonState();
    let finalDataUrl = '';
    if (editorDownscaleRatio < 1.0 && rawOriginalWidth > 0 && rawOriginalHeight > 0) {
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = rawOriginalWidth;
        fullCanvas.height = rawOriginalHeight;
        const fullCtx = fullCanvas.getContext('2d');
        fullCtx.imageSmoothingEnabled = true;
        fullCtx.imageSmoothingQuality = 'high';
        fullCtx.drawImage(brushCanvas, 0, 0, rawOriginalWidth, rawOriginalHeight);
        finalDataUrl = fullCanvas.toDataURL('image/png');
    } else {
        finalDataUrl = brushCanvas.toDataURL('image/png');
    }

    pageItems[activePageIndex].src = finalDataUrl;
    pageItems[activePageIndex].cutoutSrc = finalDataUrl;
    mainPreviewImg.src = finalDataUrl;

    document.getElementById('checkRemoveBg').checked = true;

    brushModal.classList.add('hidden');
    brushModal.classList.remove('flex');
    showCropToast("Kuas Tersimpan!", "Hasil sentuhan manual Erase/Restore berhasil diterapkan.");
};

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
}
// ==========================================
// ----- Set Kirim Data & Proses Backend ----
// ==========================================
document.getElementById('btnProcess').addEventListener('click', async () => {
    if (!pageItems.length) {
        alert("Harap pilih berkas terlebih dahulu.");
        return;
    }

    if (isCroppingActive) exitCropMode(true);

    const btn = document.getElementById('btnProcess');
    btn.disabled = true;
    btn.innerHTML = `<span>⏳ Memproses Dokumen...</span>`;

    const formData = new FormData();

    pageItems.forEach((p, idx) => {
        const blob = dataURLtoBlob(p.src);
        formData.append('files', blob, `halaman_${idx + 1}.png`);
    });

    formData.append('paper_size', document.getElementById('paperSize').value);
    formData.append('format_out', selectedFormat);
    formData.append('color_mode', selectedColorMode);

    formData.append('brightness', sBright.value);
    formData.append('contrast', sContrast.value);
    formData.append('sharpness', sSharp.value);

    const checkBg = document.getElementById('checkRemoveBg').checked;
    formData.append('remove_bg', checkBg);
    formData.append('bg_color_type', bgColorType.value);
    formData.append('custom_hex', customHex.value);

    try {
        const resp = await fetch('/api/process', {
            method: 'POST',
            body: formData
        });

        if (!resp.ok) throw new Error("Gagal memproses berkas di server.");

        const blob = await resp.blob();
        if (generatedBlobUrl) URL.revokeObjectURL(generatedBlobUrl);
        generatedBlobUrl = URL.createObjectURL(blob);

        showDownloadModal();

    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<span>🚀 Proses & Simpan Hasil</span>`;
    }
});

// ==========================================
// ----------- Set Modal Download -----------
// ==========================================
const downloadModal = document.getElementById('downloadModal');
const btnConfirmDownload = document.getElementById('btnConfirmDownload');
const btnOpenNewTab = document.getElementById('btnOpenNewTab');
const btnCloseModal = document.getElementById('btnCloseModal');

function showDownloadModal() {
    document.getElementById('modalFormatText').innerText = `Format: ${selectedFormat.toUpperCase()} siap diunduh.`;
    downloadModal.classList.remove('hidden');
    downloadModal.classList.add('flex');
}

btnCloseModal.onclick = () => {
    downloadModal.classList.add('hidden');
    downloadModal.classList.remove('flex');
};

btnConfirmDownload.onclick = () => {
    if (!generatedBlobUrl) return;
    const a = document.createElement('a');
    a.href = generatedBlobUrl;
    const ext = (pageItems.length > 1 && selectedFormat !== 'pdf') ? 'zip' : selectedFormat;

    let downloadSeq = parseInt(localStorage.getItem('ateka_dl_seq') || '0', 10) + 1;
    localStorage.setItem('ateka_dl_seq', downloadSeq.toString());

    a.download = `ATEKA_${Date.now()}_${downloadSeq}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

btnOpenNewTab.onclick = () => {
    if (!generatedBlobUrl) return;
    window.open(generatedBlobUrl, '_blank');
};
