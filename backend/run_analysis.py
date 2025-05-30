# run_analysis.py 🔍
import pandas as pd
import os
from sqlalchemy import create_engine

# ✅ Auto-create output folder inside React public dir
output_dir = "../frontend/public/data/"
os.makedirs(output_dir, exist_ok=True)

# ✅ Connect to local MySQL database
engine = create_engine("mysql+pymysql://root@localhost:3306/try")

# 🔢 1. Equipment vs Avg Practice Score
try:
    df_prac = pd.read_sql("""
        SELECT eq.equipmentName,
               AVG(ps.pracScore) AS avgScore,
               COUNT(*) AS nSessions
        FROM PracticeScore ps
        JOIN EquipmentDefinition eq ON ps.equipmentID=eq.equipmentID
        GROUP BY eq.equipmentName
    """, engine)
    df_prac.to_json(f"{output_dir}equipment_score.json", orient="records")
    print("✅ equipment_score.json exported")
except Exception as e:
    print("❌ Equipment analysis failed:", str(e))

# 📊 2. End Score Distribution (raw)
try:
    df_end = pd.read_sql("SELECT endScore FROM EndScore", engine)
    df_end.to_json(f"{output_dir}end_score.json", orient="records")
    print("✅ end_score.json exported")
except Exception as e:
    print("❌ EndScore export failed:", str(e))

# 🏆 3. Top 10 Archers by Personal Best
try:
    df_top = pd.read_sql("""
        SELECT a.firstName, a.lastName,
               MAX(cr.roundScore) AS personalBest
        FROM CompetitionResult cr
        JOIN Archer a ON cr.archID = a.archID
        GROUP BY cr.archID
        ORDER BY personalBest DESC
        LIMIT 10
    """, engine)
    df_top.to_json(f"{output_dir}top_archers.json", orient="records")
    print("✅ top_archers.json exported")
except Exception as e:
    print("❌ Top Archers analysis failed:", str(e))


print("\n🚀 All available data exports complete! JSONs saved to: /frontend/public/data/")
