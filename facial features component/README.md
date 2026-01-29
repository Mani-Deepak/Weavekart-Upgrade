# AI ML - Human Attributes Detection with Facial Feature Extraction (Simplified)

## Gender, Skin Tone, and Face Shape Recognition

This simplified facial attribute extraction program detects facial coordinates using FaceNet model and provides three key detections: **Gender**, **Skin Tone** (Fitzpatrick scale), and **Face Shape** (7 categories).

> **Note**: This is a simplified version optimized for Python 3.11+ without MXNet dependency. For the full version with age, emotion, and 40 facial attributes, use Python 3.9 with MXNet.

Deep Learning Models used for the library are:

- FaceNet model used for facial detection.
- GenderNet caffe model used for Gender detection.
- Custom skin tone detector using LAB color space analysis.
- Custom face shape detector using geometric analysis.

## Table of contents

- [Getting started](#getting-started)
- [Features](#features)
- [Gender Detection Classes](#gender-detection-classes)
- [Skin Tone Detection Classes](#skin-tone-detection-classes)
- [Face Shape Detection Classes](#face-shape-detection-classes)
- [Usage](#usage)
- [Results](#results)
- [Want to Contribute?](#want-to-contribute)
- [Need Help / Support?](#need-help)
- [Collection of Other Components](#collection-of-components)
- [Changelog](#changelog)
- [Credits](#credits)
- [License](#license)
- [Keywords](#Keywords)

## Getting started

Prerequisites for running the code are:

- Python >= 3.9 (tested with Python 3.11)
- opencv-python >= 4.5.0
- numpy >= 1.21.0
- pandas >= 1.3.0
- python-dotenv >= 0.19.0

Install all dependencies:
```bash
pip install -r requirements.txt
```

### Update path in .env file
    
    Replace "your/path/to/folder/" in .env file with path of your system.
    
    My username is abc, replace that with your system username.
    
    Eg: FACEDETECTOR = "/home/abc/AIML-Human-Attributes-Detection-with-Facial-Feature-Extraction/model/facenet/opencv_face_detector.pbtxt"

## Features

- Face detection using FaceNet model
- Predicts Gender of the detected face (Male/Female)
- Detects Skin Tone using Fitzpatrick scale classification (Type I-VI)
- Detects Face Shape based on facial geometry (7 shapes)


### Gender Detection Classes

   - Male
   - Female


### Skin Tone Detection Classes

   **Fitzpatrick Scale:**
   - Type I - Very Fair (Always burns, never tans)
   - Type II - Fair (Usually burns, tans minimally)
   - Type III - Medium (Sometimes burns, tans uniformly)
   - Type IV - Olive (Rarely burns, tans easily)
   - Type V - Brown (Very rarely burns, tans very easily)
   - Type VI - Dark Brown/Black (Never burns, deeply pigmented)
   
   **Descriptive Categories:**
   - Very Fair
   - Fair
   - Medium
   - Olive
   - Brown
   - Dark Brown
   - Very Dark

### Face Shape Detection Classes

   - Oval
   - Round
   - Square
   - Rectangle
   - Heart
   - Diamond
   - Triangle
    
## Usage

Inside the project's directory run:

```
python predict.py
```
You can find sample images in the Dataset folder and results can be seen on the terminal. Results directory contains images with detected faces.


### Results
#### Original Image

<img src="images/image1.jpg" width = "300" height = "225"/>
<img src="images/image2.jpg" width = "300" height = "225"/>

#### Detection Results

<img src="images/result1.png" />

## Want to Contribute?

- Created something awesome, made this code better, added some functionality, or whatever (this is the hardest part).
- [Fork it](http://help.github.com/forking/).
- Create new branch to contribute your changes.
- Commit all your changes to your branch.
- Submit a [pull request](http://help.github.com/pull-requests/).

-----

## Need Help? 

We also provide a free, basic support for all users who want to use image processing techniques for their projects. In case you want to customize this image enhancement technique for your development needs, then feel free to contact our [AI/ML developers](https://www.weblineindia.com/ai-ml-dl-development.html).

-----

## Collection of Components

We have built many other components and free resources for software development in various programming languages. Kindly click here to view our [Free Resources for Software Development](https://www.weblineindia.com/software-development-resources.html).

------

## Changelog

Detailed changes for each release are documented in [CHANGELOG.md](./CHANGELOG.md).

## Credits

- Refered mxnet-face for attribute extraction.  [mxnet-face](https://github.com/tornadomeet/mxnet-face).
- Refered fer2013/IMDB for emotional classification.  [fer2013/IMDB](https://github.com/oarriaga/face_classification).
- Refered AgeGender recognition.  [AgeGender](https://github.com/spmallick/learnopencv/tree/master/AgeGender).

## License

[MIT](LICENSE)

[mit]: https://github.com/miguelmota/is-valid-domain/blob/e48e90f3ecd55431bbdba950eea013c2072d2fac/LICENSE

## Keywords

 Mxnet_face, facial_attribute_extraction, Age_recognition, gender_recognition, emotion_recognition, caffemodel, fer2013

