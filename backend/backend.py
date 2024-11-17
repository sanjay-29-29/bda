from flask import Flask, request, jsonify
from pyspark.ml import PipelineModel
from pyspark.sql import SparkSession
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

spark = SparkSession.builder.appName("DiabetesModelAPI").getOrCreate()

model_save_path = "model"
model = PipelineModel.load(model_save_path)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.json

        numeric_data = {
            key: float(input_data[key]) if key in input_data else None
            for key in ["AGE", "SEX", "BMI", "BP", "S1", "S2", "S3", "S4", "S5", "S6"]
        }

        if None in numeric_data.values():
            return jsonify({"error": "Invalid input: all fields must be provided and numeric."}), 400

        input_df = spark.createDataFrame([numeric_data])

        predictions = model.transform(input_df)
        prediction = predictions.select("prediction").collect()[0]["prediction"]

        return jsonify({"prediction": prediction})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
