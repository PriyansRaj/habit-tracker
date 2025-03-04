import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import random

# Sample habit dataset
habit_data = {
    "habit": [
        "Morning Meditation", "Daily Exercise", "Reading", "Journaling", 
        "Drinking Water", "Healthy Eating", "Walking", "Yoga", "Coding Practice", 
        "Learning a New Language", "Socializing", "Gratitude Practice", 
        "Time Management", "No Social Media Before Bed", "Sleeping Early"
    ],
    "category": ["Mindfulness", "Fitness", "Education", "Mindfulness", "Health", "Health", "Fitness", 
                 "Fitness", "Skill", "Education", "Social", "Mindfulness", "Productivity", "Digital Detox", "Health"]
}

df = pd.DataFrame(habit_data)

# Convert categorical data to numerical for ML
df["category_id"] = df["category"].astype("category").cat.codes

# Train a KNN model
X = df["category_id"].values.reshape(-1, 1)
knn = NearestNeighbors(n_neighbors=3, metric="euclidean")
knn.fit(X)

def recommend_habits(completed_habits):
    """
    Recommends new habits based on completed habits.
    """
    completed_categories = df[df["habit"].isin(completed_habits)]["category_id"].tolist()
    recommended_habits = set()
    
    for cat_id in completed_categories:
        distances, indices = knn.kneighbors([[cat_id]])
        for idx in indices[0]:
            habit_name = df.iloc[idx]["habit"]
            if habit_name not in completed_habits:
                recommended_habits.add(habit_name)

    return list(recommended_habits)

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.json
    completed_habits = data.get("completed_habits", [])
    recommendations = recommend_habits(completed_habits)
    return jsonify({"recommended_habits": recommendations})

if __name__ == "__main__":
    app.run(debug=True)
