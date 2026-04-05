from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    # ข้อความสำหรับอธิบายเว็บไซต์
    message = """เว็บนี้จัดทำขึ้นเพื่อแสดงสถานะการใช้งานของบอร์ดเกมในคณะ 
    1.ตั้งค่าเวลาเป็นหน่วย นาที 
    2.กดบริเวณคำว่า ยืมบอร์ดเกม 
    3.กรอกแบบฟอร์มสำหรับบยืมบอร์ดเกม
    4.ผู้ใช้สามารถกดคำว่า วิธีเล่น เพื่อดูวิธีการเล่นบอร์ดเกมที่ต้องการได้"""
    return render_template('Front-Board Game.html', message=message)

if __name__ == '__main__':
    # รันเซิร์ฟเวอร์ Flask บนพอร์ต 5500
    app.run(debug=True, port=5500)

# รายการบอร์ดเกม
# board_games = [
#     "7 ATE 9", "AQUARIUS", "AVALON", "AZUL", "BANG",
#     "BANG GOLD RUSH", "CAPTAIN SONAR", "CENTURY SPICE ROAD", "CITADELS", "COUP",
#     "CS FILES","DEAD OF WINTER","DOMINION","DRAGON CASTLE","EXPLODING KITTENS",
#     "GIZMOS","KAKER LAKEN POKER","ONE NIGHT","PANDEMIC","POWER GRID",
#     "SALEM","TERRAFORMING MARS","SERIAL KILLER","THE MIND","TIME LINE","Political Mess",
#     "UNO","CATAN","Ultimate Werewolf Deluxe","สนุก สลัด","หมากรุก","หมากล้อม","JUNGLE SPEED"
# ]

# @app.route('/search', methods=["GET"])
# #เอาไว้สำหรับพัฒนาต่อเมื่อต้องการทำ fetch
# def search():
#     # รับคำค้นหาจาก query string
#     query = request.args.get('q', '')

#     # ค้นหาบอร์ดเกมที่ตรงหรือใกล้เคียงกับคำค้นหา โดยไม่สนใจตัวพิมพ์เล็ก/ใหญ่
#     results = [game for game in board_games if query.lower() in game.lower()]

#     # ส่งผลลัพธ์เป็น JSON กลับไปยัง JavaScript ที่ฝั่ง frontend
#     return jsonify({'results': results})