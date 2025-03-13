# Image Steganography

## 📖 Overview

This project implements **Image Steganography**, allowing users to hide secret messages within images and extract them when needed.

## 🚀 Features

- **Encode Messages**: Hide text within images.
- **Decode Messages**: Extract hidden text from images.
- **User-Friendly Interface**: Simple and intuitive design for seamless user experience.

## 🛠️ Technologies Used

- **TypeScript**: Main programming language.
- **HTML**: Structure of the web pages.

## 📁 Project Structure

```
Image-Steganography/
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── public/
│   ├── images/
│   └── ...
├── README.md
└── package.json
```

- `src/components/`: Reusable UI components.
- `src/pages/`: Application pages.
- `src/styles/`: Styling files.
- `src/utils/`: Utility functions.
- `public/images/`: Image assets.

## 🛠️ Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/sudheerprasannakumarvasetty/Image-Steganography.git
   cd Image-Steganography
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start the Development Server**:

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:3000`.

## 📝 Usage

1. **Encoding a Message**:
   - Navigate to the encoding page.
   - Upload the image you want to hide the message in.
   - Enter your secret message.
   - Click "Encode" to generate the steganographic image.
   - Download the encoded image.

2. **Decoding a Message**:
   - Navigate to the decoding page.
   - Upload the image containing the hidden message.
   - Click "Decode" to reveal the secret message.

## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any enhancements or bug fixes.
