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
