# AI Resume Analyzer - [LINK](https://puter.com/app/jsm-resumefeed)

A modern AI-powered resume analysis tool built with React Router, TypeScript, and Puter.com cloud services. Get instant ATS compatibility scores and actionable feedback to optimize your resume for your dream job.

## Features

- 🤖 **AI-Powered Analysis**: Get intelligent feedback on your resume content, structure, and ATS compatibility
- 📊 **ATS Score**: Receive a compatibility score showing how well your resume performs with Applicant Tracking Systems
- 📝 **Detailed Feedback**: Get specific suggestions for tone, content, structure, and skills alignment
- 🔄 **PDF to Image Conversion**: View your resume as both PDF and image formats
- 💾 **Resume History**: Track all your uploaded resumes and their analysis results
- 🔐 **Secure Authentication**: Login with Puter.com for secure cloud storage
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React Router v7, TypeScript, Tailwind CSS
- **Cloud Services**: Puter.com (Authentication, File Storage, AI, Key-Value Store)
- **PDF Processing**: PDF.js for PDF to image conversion
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom gradients and animations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Puter.com account (free at [puter.com](https://puter.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Configuration

No additional configuration is required! The app uses Puter.com's hosted services for:
- User authentication
- File storage (PDF and image files)
- AI analysis (with multiple model fallbacks)
- Key-value storage for resume metadata

## Usage

### 1. Authentication
- Visit the homepage and click "Analyze Resume"
- You'll be redirected to authenticate with Puter.com
- After login, you'll return to the upload page

### 2. Upload & Analysis
- Fill in job details (optional but recommended):
  - Company Name
  - Job Title  
  - Job Description
- Upload your resume (PDF format)
- Click "Analyze Resume"

### 3. View Results
- See your resume displayed as an image
- Review your overall ATS score (0-100)
- Get detailed feedback in categories:
  - **ATS Compatibility**: Keywords and format optimization
  - **Content**: Achievement quantification and relevance
  - **Structure**: Section organization and readability
  - **Tone & Style**: Professional language and consistency
  - **Skills**: Alignment with job requirements

### 4. Resume History
- Access all your previous uploads from the homepage
- Click on any resume card to view full analysis
- Track improvements over time

## Project Structure

```
app/
├── components/           # Reusable UI components
│   ├── ATS.tsx          # ATS score display
│   ├── Details.tsx      # Detailed feedback tabs
│   ├── FileUploader.tsx # File upload component
│   ├── Navbar.tsx       # Navigation header
│   ├── ResumeCard.tsx   # Resume history cards
│   ├── ScoreCircle.tsx  # Circular score display
│   └── Summary.tsx      # Overall score summary
├── lib/                 # Utility functions
│   ├── puter.ts         # Puter.com SDK integration
│   ├── pdf2img.ts       # PDF to image conversion
│   └── utils.ts         # Helper functions
├── routes/              # Application pages
│   ├── auth.tsx         # Authentication page
│   ├── home.tsx         # Dashboard/history
│   ├── resume.tsx       # Resume analysis view
│   └── upload.tsx       # Upload and processing
├── types/               # TypeScript definitions
│   └── index.d.ts       # App-wide type definitions
└── constants/           # Configuration and constants
    └── index.ts         # AI prompts and default data
```

## API Integration

### Puter.com Services Used

1. **Authentication (`auth`)**
   - User login/logout
   - Session management

2. **File System (`fs`)**
   - Upload PDF files
   - Upload converted images
   - Retrieve files for display

3. **AI Service (`ai`)**
   - Resume analysis with multiple model fallbacks:
     - Claude 3 Sonnet (primary)
     - Claude 3 Haiku (fallback)
     - GPT-4 (fallback)
     - GPT-3.5-turbo (final fallback)

4. **Key-Value Store (`kv`)**
   - Store resume metadata and feedback
   - Retrieve resume history
   - Pattern: `resume:{uuid}`

## Deployment

### Deploy to Vercel (Recommended)

1. **Connect your repository**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: build

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload the build folder** to Netlify

### Environment Variables

No environment variables are required - all services are provided by Puter.com's hosted platform.

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

## Troubleshooting

### Common Issues

**"no fallback model available" error**
- This indicates the AI service is temporarily unavailable
- The app will use default feedback scores as a fallback
- Your resume will still be uploaded and displayed

**Upload returns to upload page**
- Ensure you're authenticated with Puter.com
- Check browser console for detailed error logs
- Try refreshing the page and uploading again

**Resume not displaying**
- Verify the PDF file is not corrupted
- Ensure you have a stable internet connection
- Check that the file size is reasonable (< 10MB)

### Development Debugging

Enable detailed logging by checking the browser console during:
- File upload process
- AI analysis requests
- Data retrieval and parsing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Puter.com](https://puter.com) for providing the cloud infrastructure
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF processing capabilities
- [Tailwind CSS](https://tailwindcss.com) for the design system
- [React Router](https://reactrouter.com) for the application framework

---

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/ai-resume-analyzer/issues) page
2. Create a new issue with detailed error information
3. Include browser console logs and steps to reproduce

**Built with ❤️ to help job seekers optimize their resumes and land their dream jobs!**
