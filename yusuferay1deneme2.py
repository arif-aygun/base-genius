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
    Jesse Pollak'ın (FID: 191) gönderilerini çeker.
    """
    print(f"📡 Base Kurucusu (FID: {TARGET_FID}) verileri çekiliyor...")
    
    url = "https://api.neynar.com/v2/farcaster/feed/user/casts"
    
    headers = {
        "accept": "application/json",
        "api_key": NEYNAR_API_KEY
    }
    
    params = {
        "fid": TARGET_FID,
        "limit": 50, # Daha fazla veri çekmek analiz kalitesini artırır
        "include_replies": "false"
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
            print("❌ HATA: Paket limiti veya ödeme hatası (Neynar 402).")
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

    # Güncel ve hızlı model
    model = genai.GenerativeModel('models/gemini-flash-latest')

    # PROMPT GÜNCELLENDİ: İngilizce, Kısa Cevaplar, 3 Yanlış Seçenek
    prompt = f"""
    Analyze the following social media posts by Jesse Pollak (Founder of Base).
    
    TASK:
    Generate exactly 50 quiz questions based on the content provided.
    
    CONSTRAINTS:
    1. Language: English only.
    2. Style: Keep questions and answers short, direct, and concise.
    3. Structure: For each question, provide 1 correct answer and 3 random incorrect answers (distractors).
    4. Output Format: Return ONLY a valid JSON array. Do not include markdown formatting (like ```json).
    
    JSON SCHEMA:
    [
        {{
            "question": "Short question text here?",
            "correct_answer": "Correct answer",
            "wrong_answers": ["Wrong A", "Wrong B", "Wrong C"]
        }}
    ]
    
    TEXT CONTENT TO ANALYZE:
    {context_text}
    """

    print("⚡ Gemini soruları (İngilizce + Şıklar) hazırlıyor...")
    
    try:
        response = model.generate_content(prompt)
        # Markdown temizliği (Bazen Gemini ```json ekleyebiliyor)
        text_response = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text_response)
    except Exception as e:
        print(f"❌ Gemini hatası: {e}")
        # Hata ayıklama için ham yanıtı yazdırabiliriz
        # print(response.text) 
        return []

def save_to_json(data, filename="base_quiz_english.json"):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"💾 Dosya kaydedildi: {os.path.abspath(filename)}")

if __name__ == "__main__":
    # 1. Veriyi Çek
    data_text = get_jesse_pollak_casts()
    
    if data_text:
        # 2. Soruları Üret (İngilizce + Şıklı)
        questions = generate_questions(data_text)
        
        if questions:
            # 3. Kaydet
            save_to_json(questions)
            print(f"🎉 Toplam {len(questions)} soru oluşturuldu.")
    else:
        print("\n⚠️ Veri çekilemediği için işlem yapılamadı.")