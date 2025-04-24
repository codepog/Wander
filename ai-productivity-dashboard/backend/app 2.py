from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from peft import PeftModel
import torch
import os

app = Flask(__name__)
CORS(app)

# Model configuration
BASE_MODEL = "tiiuae/falcon-rw-1b"
ADAPTER_PATH = "./nebil-llama3-ruthless"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Initialize model and tokenizer
print(f"Loading base model {BASE_MODEL} on {DEVICE}...")
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
model = AutoModelForCausalLM.from_pretrained(BASE_MODEL).to(DEVICE)

print(f"Loading adapter from {ADAPTER_PATH}...")
model = PeftModel.from_pretrained(model, ADAPTER_PATH)

# Create text generation pipeline
text_generator = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device=0 if DEVICE == "cuda" else -1
)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "modelLoaded": True,
        "device": DEVICE
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        # Generate response
        response = text_generator(
            prompt,
            max_new_tokens=200,
            temperature=0.4,
            top_p=0.8,
            repetition_penalty=1.3,
            do_sample=True
        )[0]['generated_text']

        # Remove the prompt from the response
        response = response[len(prompt):].strip()

        return jsonify({
            "response": response
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True) 