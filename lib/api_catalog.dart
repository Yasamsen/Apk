const apiCatalog = [
  {
    "slug": "ai-chat",
    "name": "Ai Chat",
    "description": "Endpoint API Ai Chat",
    "category": "Utility",
    "method": "GET",
    "endpoint": "/api/ai-chat"
  },
  {
    "slug": "ai-image",
    "name": "AI Image",
    "description": "Generate gambar AI berdasarkan prompt dan negative prompt.",
    "category": "AI",
    "method": "GET",
    "endpoint": "/api/ai-image"
  },
  {
    "slug": "alight-send",
    "name": "AmPrem Create Account",
    "description": "Melakukan proses pembuatan akun AmPrem.",
    "category": "Tools",
    "method": "POST",
    "endpoint": "/api/alight/send"
  },
  {
    "slug": "alight-verify",
    "name": "AmPrem Verify",
    "description": "Melakukan verifikasi akun AmPrem menggunakan email dan link verifikasi.",
    "category": "Tools",
    "method": "POST",
    "endpoint": "/api/alight/verify"
  },
  {
    "slug": "alphacoders-random",
    "name": "Wallpaper Abyss Random",
    "description": "Mengambil 1 wallpaper acak dari Wallpaper Abyss (Alpha Coders) berdasarkan kata kunci, dalam resolusi dan format asli (JPG/PNG) tanpa dikecilkan. Respons berupa file gambar langsung, bukan JSON. File yang sangat besar akan diarahkan (redirect) ke URL gambar aslinya.",
    "category": "Random",
    "method": "GET",
    "endpoint": "/api/alphacoders-random"
  },
  {
    "slug": "alya",
    "name": "Alya Random Media",
    "description": "Mengambil gambar atau video secara acak dari media repository Alya.",
    "category": "Anime",
    "method": "GET",
    "endpoint": "/api/alya"
  },
  {
    "slug": "autoai",
    "name": "AutoAI",
    "description": "AI chat dengan dukungan analisis gambar menggunakan NeoSoft Gemini dan AskMe Vision.",
    "category": "AI",
    "method": "GET",
    "endpoint": "/api/autoai"
  },
  {
    "slug": "capcut",
    "name": "CapCut Downloader",
    "description": "Mengambil metadata template CapCut tanpa menggunakan API resmi.",
    "category": "Downloader",
    "method": "GET",
    "endpoint": "/api/capcut"
  },
  {
    "slug": "deviantart-random",
    "name": "DeviantArt Random",
    "description": "Mengambil 1 karya gambar acak dari DeviantArt berdasarkan kata kunci (karya dewasa dilewati). Respons berupa file gambar langsung, bukan JSON. File yang sangat besar akan diarahkan (redirect) ke URL gambar aslinya.",
    "category": "Random",
    "method": "GET",
    "endpoint": "/api/deviantart-random"
  },
  {
    "slug": "earthquake",
    "name": "Gempa Terkini",
    "description": "Get the latest earthquake information in Indonesia directly from BMKG.",
    "category": "Information",
    "method": "GET",
    "endpoint": "/api/earthquake"
  },
  {
    "slug": "editimg",
    "name": "AI Image Editor",
    "description": "Mengedit gambar menggunakan AI berdasarkan URL gambar dan prompt yang diberikan.",
    "category": "AI",
    "method": "GET",
    "endpoint": "/api/editimg"
  },
  {
    "slug": "facebook",
    "name": "Facebook Downloader",
    "description": "Mengambil metadata dan link download video Facebook.",
    "category": "Downloader",
    "method": "GET",
    "endpoint": "/api/facebook"
  },
  {
    "slug": "ff-stalk",
    "name": "Free Fire Stalk",
    "description": "Mengambil metadata akun Free Fire berdasarkan UID.",
    "category": "Games",
    "method": "GET",
    "endpoint": "/api/ff-stalk"
  },
  {
    "slug": "githubstalk",
    "name": "GitHub Stalk",
    "description": "Mengambil informasi profil pengguna GitHub berdasarkan username.",
    "category": "Stalker",
    "method": "GET",
    "endpoint": "/api/githubstalk"
  },
  {
    "slug": "imgviral",
    "name": "Image-Viral",
    "description": "Get a random viral image.",
    "category": "Media",
    "method": "GET",
    "endpoint": "/api/imgviral"
  },
  {
    "slug": "instagram-stalker",
    "name": "Instagram Stalker",
    "description": "Endpoint API Instagram Stalker",
    "category": "Utility",
    "method": "GET",
    "endpoint": "/api/instagram-stalker"
  },
  {
    "slug": "instagram",
    "name": "Instagram Downloader",
    "description": "Download foto, video, Reels, dan carousel Instagram menggunakan InstaLoadr.",
    "category": "Downloader",
    "method": "GET",
    "endpoint": "/api/instagram"
  },
  {
    "slug": "ip-lookup",
    "name": "Ip Lookup",
    "description": "Endpoint API Ip Lookup",
    "category": "Utility",
    "method": "GET",
    "endpoint": "/api/ip-lookup"
  },
  {
    "slug": "lyrics",
    "name": "Lyrics",
    "description": "Mencari lirik lagu menggunakan LRCLIB, termasuk lirik plain dan tersinkronisasi.",
    "category": "Music",
    "method": "GET",
    "endpoint": "/api/lyrics"
  },
  {
    "slug": "mealdb",
    "name": "TheMealDB Recipes",
    "description": "Mencari dan mengambil resep makanan dari TheMealDB.",
    "category": "Food",
    "method": "GET",
    "endpoint": "/api/mealdb"
  },
  {
    "slug": "mlstalk",
    "name": "Mobile Legends Stalk",
    "description": "Mengecek informasi akun Mobile Legends berdasarkan User ID dan Zone ID.",
    "category": "Stalker",
    "method": "GET",
    "endpoint": "/api/mlstalk"
  },
  {
    "slug": "npmstalk",
    "name": "NPM Stalk",
    "description": "Mendapatkan informasi versi, dependency, dan waktu publikasi package NPM.",
    "category": "Tools",
    "method": "GET",
    "endpoint": "/api/npmstalk"
  },
  {
    "slug": "nsfw-random",
    "name": "NSFW Random",
    "description": "Mengambil satu URL media secara acak dari koleksi Nsfw.json.",
    "category": "Media",
    "method": "GET",
    "endpoint": "/api/nsfw-random"
  },
  {
    "slug": "omdown",
    "name": "Omdown Downloader",
    "description": "Ambil link download video, audio, atau foto dari 17 platform (TikTok, YouTube, Instagram, Facebook, X, Spotify, SoundCloud, Pinterest, Reddit, CapCut, Threads, Snapchat, Twitch, DeviantArt, Pixiv, MangaDex, PineDrama) lewat satu parameter. Platform dideteksi otomatis dari URL.",
    "category": "Downloader",
    "method": "GET",
    "endpoint": "/api/omdown"
  },
  {
    "slug": "photoeditor-ai",
    "name": "PhotoEditor AI",
    "description": "Mengedit gambar menggunakan AI PhotoEditorAI berdasarkan prompt, model, dan aspect ratio.",
    "category": "AI",
    "method": "GET",
    "endpoint": "/api/photoeditor-ai"
  },
  {
    "slug": "pinterest-search",
    "name": "Pinterest Search",
    "description": "Mencari gambar Pin Pinterest berdasarkan kata kunci dan mengembalikan hasil secara acak.",
    "category": "Search",
    "method": "GET",
    "endpoint": "/api/pinterest-search"
  },
  {
    "slug": "prime-ff",
    "name": "Kalkulator Prime Free Fire",
    "description": "Mengonversi Poin Prime Free Fire menjadi estimasi diamond dan harga rupiah.",
    "category": "Tools",
    "method": "GET",
    "endpoint": "/api/prime-ff"
  },
  {
    "slug": "qrcode",
    "name": "QR Code Generator",
    "description": "Generate a QR Code from text or a URL.",
    "category": "Generator",
    "method": "GET",
    "endpoint": "/api/qrcode"
  },
  {
    "slug": "quotes-anime",
    "name": "Anime Quotes",
    "description": "Mengambil satu quote anime secara acak dari OtakuOtaku.",
    "category": "Anime",
    "method": "GET",
    "endpoint": "/api/quotes-anime"
  },
  {
    "slug": "reaction-wa",
    "name": "WhatsApp Channel Reaction",
    "description": "Mengirim reaction emoji ke postingan WhatsApp Channel.",
    "category": "WhatsApp",
    "method": "GET",
    "endpoint": "/api/reaction-wa"
  },
  {
    "slug": "ringtone",
    "name": "Ringtone Search",
    "description": "Mencari ringtone berdasarkan judul dan mengembalikan satu hasil ringtone.",
    "category": "Search",
    "method": "GET",
    "endpoint": "/api/ringtone"
  },
  {
    "slug": "spotify",
    "name": "Spotify",
    "description": "Endpoint API Spotify",
    "category": "Utility",
    "method": "GET",
    "endpoint": "/api/spotify"
  },
  {
    "slug": "ssweb",
    "name": "Screenshot Web",
    "description": "Mengambil screenshot dari sebuah website menggunakan ScreenshotMachine.",
    "category": "Tools",
    "method": "GET",
    "endpoint": "/api/ssweb"
  },
  {
    "slug": "tai",
    "name": "Tai Random",
    "description": "Mengambil satu data media secara acak dari halaman SFMCompile.",
    "category": "Media",
    "method": "GET",
    "endpoint": "/api/tai"
  },
  {
    "slug": "tempmail",
    "name": "Temporary Email",
    "description": "Generate email sementara secara acak atau menggunakan custom prefix dan domain.",
    "category": "Tools",
    "method": "GET",
    "endpoint": "/api/tempmail"
  },
  {
    "slug": "terabox",
    "name": "TeraBox Downloader",
    "description": "Mengekstrak file, thumbnail, stream, subtitle, dan link download dari URL TeraBox.",
    "category": "Downloader",
    "method": "GET",
    "endpoint": "/api/terabox"
  },
  {
    "slug": "text-to-speech",
    "name": "Text To Speech",
    "description": "Endpoint API Text To Speech",
    "category": "Utility",
    "method": "GET",
    "endpoint": "/api/text-to-speech"
  },
  {
    "slug": "tiktok-search",
    "name": "TikTok Search",
    "description": "Mencari video TikTok berdasarkan kata kunci menggunakan GetDL.",
    "category": "Search",
    "method": "GET",
    "endpoint": "/api/tiktok-search"
  },
  {
    "slug": "tiktok",
    "name": "TikTok Downloader",
    "description": "Download TikTok video and upload it to CDN.",
    "category": "Downloader",
    "method": "GET",
    "endpoint": "/api/tiktok"
  },
  {
    "slug": "tourl",
    "name": "ToURL",
    "description": "Unggah file (maksimal 4MB) atau salin file dari URL lain, lalu dapatkan link publik. Mendukung multipart/form-data, raw body, dan parameter url (https:// opsional).",
    "category": "Uploader",
    "method": "POST",
    "endpoint": "/api/tourl"
  },
  {
    "slug": "twitter-video",
    "name": "Twitter/X Video Downloader",
    "description": "Mengambil link video Twitter/X berdasarkan URL postingan.",
    "category": "Downloader",
    "method": "GET",
    "endpoint": "/api/twitter-video"
  },
  {
    "slug": "unblur-img",
    "name": "Unblur Image",
    "description": "Menghilangkan blur dan meningkatkan kualitas gambar menggunakan UnblurImg AI.",
    "category": "Tools",
    "method": "GET",
    "endpoint": "/api/unblur-img"
  },
  {
    "slug": "unwatermark-nano-banana",
    "name": "Unwatermark Nano Banana",
    "description": "Mengedit gambar menggunakan AI Nano Banana dari Unwatermark AI berdasarkan prompt dan aspect ratio.",
    "category": "Tools",
    "method": "GET",
    "endpoint": "/api/unwatermark-nano-banana"
  },
  {
    "slug": "upscale-image",
    "name": "Upscale Image",
    "description": "Meningkatkan resolusi gambar hingga skala 2x menggunakan PicUpscaler.",
    "category": "Tools",
    "method": "GET",
    "endpoint": "/api/upscale-image"
  },
  {
    "slug": "video-to-prompt",
    "name": "Video to Prompt AI",
    "description": "Mengekstrak prompt AI dari URL video menggunakan StarLabs Video to Prompt API. Mendukung prompt untuk model seperti Veo, Sora, Kling, Runway, dan Seedance.",
    "category": "AI",
    "method": "GET",
    "endpoint": "/api/video-to-prompt"
  },
  {
    "slug": "waifuimg",
    "name": "Waifu-Ku",
    "description": "Mengambil gambar waifu secara random.",
    "category": "Anime",
    "method": "GET",
    "endpoint": "/api/waifuimg"
  },
  {
    "slug": "weather",
    "name": "Weather",
    "description": "Get current weather information for a city.",
    "category": "Weather",
    "method": "GET",
    "endpoint": "/api/weather"
  },
  {
    "slug": "wikipedia",
    "name": "Wikipedia Search",
    "description": "Mencari artikel Wikipedia berdasarkan kata kunci.",
    "category": "Search",
    "method": "GET",
    "endpoint": "/api/wikipedia"
  },
  {
    "slug": "x-stalker",
    "name": "X Stalker",
    "description": "Endpoint API X Stalker",
    "category": "Utility",
    "method": "GET",
    "endpoint": "/api/x-stalker"
  },
  {
    "slug": "youtube-mp3",
    "name": "YouTube MP3",
    "description": "Mengubah video YouTube menjadi audio MP3.",
    "category": "Downloader",
    "method": "GET",
    "endpoint": "/api/youtube-mp3"
  },
  {
    "slug": "youtube-stalker",
    "name": "YouTube Stalker",
    "description": "Mengambil informasi profil channel YouTube tanpa menggunakan YouTube API Key.",
    "category": "Social",
    "method": "GET",
    "endpoint": "/api/youtube-stalker"
  },
  {
    "slug": "ytplay",
    "name": "Ytplay",
    "description": "Endpoint API Ytplay",
    "category": "Utility",
    "method": "GET",
    "endpoint": "/api/ytplay"
  },
  {
    "slug": "zerochan",
    "name": "Zerochan",
    "description": "Mencari gambar anime dan karakter dari Zerochan.",
    "category": "Anime",
    "method": "GET",
    "endpoint": "/api/zerochan?query={query}"
  }
];
