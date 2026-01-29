import torch
import cv2
import numpy as np
from PIL import Image
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
from controlnet_aux import OpenposeDetector

def get_clothing_generator():
    """
    Initializes and returns the clothing generation pipeline.
    """
    device = "cuda" if torch.cuda.is_available() else "cpu"
    # Use float16 for GPU for faster inference, otherwise use float32 for CPU compatibility
    dtype = torch.float16 if device == "cuda" else torch.float32

    # 1. Load ControlNet for OpenPose (Fixed pose constraint)
    controlnet = ControlNetModel.from_pretrained(
        "fusing/stable-diffusion-v1-5-controlnet-openpose",
        torch_dtype=dtype
    )

    # 2. Setup Stable Diffusion Pipeline
    pipe = StableDiffusionControlNetPipeline.from_pretrained(
        "runwayml/stable-diffusion-v1-5",
        controlnet=controlnet,
        torch_dtype=dtype
    )

    # 3. Handle device (Auto-detect CUDA)
    pipe.to(device)

    # 4. Setup Pose Detector
    model = OpenposeDetector.from_pretrained("lllyasviel/ControlNet")
    model.to(device) # Move pose detector to the same device

    return pipe, model

def generate_outfit(pipe, model, reference_image_path, description, output_path="output.png"):
    """
    Generates an image based on a description while maintaining the pose of the reference image.
    """
    device = pipe.device

    # Load and process reference image
    reference_image = Image.open(reference_image_path).convert("RGB")

    # Detect pose
    print("Detecting pose...")
    pose = model(reference_image)

    # Combine user description with basic prompts for speed
    full_prompt = f"A person wearing a {description}, fashion photo, studio lighting"
    negative_prompt = "blurry, deformed, worst quality, extra limbs, bad hands, lowres"

    # Generate
    print(f"Generating image with prompt: {full_prompt}")
    generator = torch.Generator(device=device).manual_seed(42)

    # Optimized for maximum speed: lower resolution (512x512) and minimum steps (10)
    output = pipe(
        prompt=full_prompt,
        image=pose,
        negative_prompt=negative_prompt,
        num_inference_steps=10,
        width=512,
        height=512,
        generator=generator,
    )

    # Save output
    output_image = output.images[0]
    output_image.save(output_path)
    print(f"Success! Image saved to {output_path}")
    return output_image

if __name__ == "__main__":
    # Example usage
    # Ensure you have a 'person.jpg' in the directory or update the path below
    # import argparse # Commented out as arguments are defined directly
    import os

    # parser = argparse.ArgumentParser(description="Generate clothing based on a description while maintaining pose.")
    # parser.add_argument("--image", type=str, required=True, help="Path to reference image of a person.")
    # parser.add_argument("--description", type=str, required=True, help="Description of the dress (e.g., 'blue shirt').")
    # parser.add_argument("--output", type=str, default="output.png", help="Path to save the output image.")

    # args = parser.parse_args() # Commented out as arguments are defined directly

    # For Colab, define the arguments directly
    reference_image_path = "your_person_image.jpg"  # Replace with your image path
    description = "blue shirt"           # Replace with your desired description
    output_path = "output.png"           # Replace with your desired output path


    if not os.path.exists(reference_image_path):
        print(f"Error: Reference image '{reference_image_path}' not found. Please upload a reference image named 'person.jpg' or update the 'reference_image_path' variable.")
    else:
        print("Initializing models (this may take a few minutes for the first run)...")
        pipeline, pose_model = get_clothing_generator()
        generate_outfit(pipeline, pose_model, reference_image_path, description, output_path)
