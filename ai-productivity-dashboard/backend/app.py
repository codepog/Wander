from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from peft import PeftModel
import torch
import logging
import json
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
ADAPTER_PATH = "./nebil-llama3-ruthless"
BASE_MODEL = "tiiuae/falcon-rw-1b"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Load tokenizer and base model
logger.info(f"Starting model loading process on {DEVICE}...")
try:
    logger.debug(f"Loading tokenizer from {BASE_MODEL}")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    logger.debug(f"Loading base model from {BASE_MODEL}")
    base_model = AutoModelForCausalLM.from_pretrained(BASE_MODEL).to(DEVICE)
    logger.debug(f"Loading adapter from {ADAPTER_PATH}")
    model = PeftModel.from_pretrained(base_model, ADAPTER_PATH).to(DEVICE)
    logger.info("Model loading completed successfully")
except Exception as e:
    logger.error(f"Error during model loading: {str(e)}")
    raise

# Create text generation pipeline
logger.debug("Creating text generation pipeline")
text_generator = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device=0 if DEVICE == "cuda" else -1
)
logger.info("Text generation pipeline created successfully")

def remove_repeated_phrases(text):
    sentences = text.split('. ')
    seen = set()
    result = []
    for sentence in sentences:
        if sentence not in seen:
            result.append(sentence)
            seen.add(sentence)
    return '. '.join(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    logger.debug("Health check endpoint called")
    try:
        response = {
            "status": "ok",
            "modelLoaded": True,
            "device": DEVICE,
            "timestamp": datetime.now().isoformat()
        }
        logger.info(f"Health check response: {json.dumps(response)}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in health check: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    logger.debug("Chat endpoint called")
    try:
        data = request.get_json()
        logger.debug(f"Received request data: {json.dumps(data)}")
        
        prompt = data.get('prompt', '')
        if not prompt:
            logger.warning("No prompt provided in request")
            return jsonify({"error": "No prompt provided"}), 400

        logger.info(f"Generating response for prompt: {prompt[:100]}...")
        response = text_generator(
            prompt,
            max_new_tokens=200,
            temperature=0.4,
            top_p=0.8,
            repetition_penalty=1.3,
            do_sample=True
        )[0]['generated_text']

        # Post-process response to remove repeated phrases
        response = remove_repeated_phrases(response[len(prompt):].strip())
        logger.info(f"Generated response: {response[:100]}...")
        
        return jsonify({ "response": response })

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({ "error": str(e) }), 500

if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(host='0.0.0.0', port=3000)
