import requests
import json
import os
import google.generativeai as genai

# =============================================================================
# AYARLAR
# =============================================================================
NEYNAR_API_KEY = "242D8AD2-0469-4C75-A391-044524A20554"
GEMINI_API_KEY = "AIzaSyAl18neQSwROOzC3-Se3a3orP7IkOWqXag"

# Jesse Pollak (Base Kurucusu) FID Numarası: 191
TARGET_FID = 191 
# =============================================================================

genai.configure(api_key=GEMINI_API_KEY)

def get_jesse_pollak_casts():
    """
    Kanal yerine direkt Base kurucusunun (Jesse Pollak) gönderilerini çeker.
    Bu endpoint bazen daha esnek olabiliyor.
    """
    print(f"📡 Base Kurucusu (FID: {TARGET_FID}) verileri çekiliyor...")
    
    # Endpoint farklı! "feed/channel" DEĞİL, "feed/user/casts"
    url = "https://api.neynar.com/v2/farcaster/feed/user/casts"
    
    headers = {
        "accept": "application/json",
        "api_key": NEYNAR_API_KEY
    }
    
    params = {
        "fid": TARGET_FID,
        "limit": 50,
        "include_replies": "false" # Sadece ana gönderileri alalım
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            data = response.json()
            casts = data.get('casts', [])
            
            combined_text = ""
            for cast in casts:
                text = cast.get('text', '').replace("\n", " ")
                date = cast.get('timestamp', '')[:10]
                
                if text:
                    combined_text += f"- Jesse Pollak ({date}): {text}\n"
            
            print(f"✅ {len(casts)} adet gönderi çekildi.")
            return combined_text
            
        elif response.status_code == 402:
            print("❌ HATA: Maalesef bu endpoint de paralı pakete dahil.")
            return None
        else:
            print(f"❌ Neynar Hatası: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Bağlantı hatası: {e}")
        return None

def generate_questions(context_text):
    if not context_text:
        return []

    model = genai.GenerativeModel('models/gemini-flash-latest')

    prompt = f"""
    Aşağıdaki metinler, Base ağının kurucusu Jesse Pollak'ın son paylaşımlarıdır.
    
    GÖREV:
    Bu paylaşımları analiz et. Base ağındaki yenilikleri ve gündemi tespit et.
    Buna göre **tam 50 adet** soru ve cevabını oluştur.
    
    ÇIKTI:
    Sadece JSON listesi: [ {{"soru": "...", "cevap": "..."}} ]
    
    METİN:
    {context_text}
    """

    print("⚡ Gemini soruları hazırlıyor...")
    
    try:
        response = model.generate_content(prompt)
        text_response = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text_response)
    except Exception as e:
        print(f"❌ Gemini hatası: {e}")
        return []

def save_to_json(data, filename="base_jesse_sorular.json"):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"💾 Kaydedildi: {os.path.abspath(filename)}")

if __name__ == "__main__":
    # 1. Base Kurucusunu Çek
    data = get_jesse_pollak_casts()
    
    if data:
        # 2. Soru Üret
        questions = generate_questions(data)
        if questions:
            save_to_json(questions)
    else:
        print("\n💡 İPUCU: Eğer yine 402 hatası aldıysan, Neynar tamamen paralı olmuş demektir.")
        print("Bu durumda 'Airstack' koduna (bir önceki verdiğim koda) dönmek ZORUNDASIN.")