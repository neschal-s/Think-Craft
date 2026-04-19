import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Download single slide as PNG
export const downloadSlideAsPNG = async (slideElement, slideNumber) => {
  try {
    const canvas = await html2canvas(slideElement, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `Slide_${slideNumber}.png`;
    link.click();
    console.log(`✅ Downloaded Slide ${slideNumber} as PNG`);
  } catch (error) {
    console.error('Error downloading PNG:', error);
    throw error;
  }
};

// Download all slides as PNGs
export const downloadAllSlidesAsPNG = async (carousel) => {
  try {
    console.log('📥 Preparing PNG downloads...');
    
    const slideContainers = document.querySelectorAll('[data-slide-container]');
    console.log(`Found ${slideContainers.length} slide containers`);
    
    if (slideContainers.length === 0) {
      throw new Error('No slides found to download');
    }

    for (let i = 0; i < slideContainers.length; i++) {
      const element = slideContainers[i];
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Slide_${i + 1}.png`;
      
      // Stagger downloads slightly to avoid browser blocking
      setTimeout(() => link.click(), i * 200);
    }
    
    console.log(`✅ Started downloading ${slideContainers.length} slides as PNG`);
    alert(`Downloading ${slideContainers.length} slides as PNG files...`);
  } catch (error) {
    console.error('Error downloading PNGs:', error);
    throw error;
  }
};

// Download carousel as PDF
export const downloadCarouselAsPDF = async (carousel, headingFont = 'Orbitron', bodyFont = 'Inter') => {
  try {
    console.log('📄 Generating PDF...');
    
    if (!carousel || !carousel.slides || carousel.slides.length === 0) {
      throw new Error('No carousel data available');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const slideContainers = document.querySelectorAll('[data-slide-container]');
    console.log(`Exporting ${slideContainers.length} slides to PDF`);
    
    if (slideContainers.length === 0) {
      throw new Error('No slides found to export');
    }

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const availableWidth = pageWidth - (2 * margin);
    const availableHeight = pageHeight - (2 * margin);

    for (let i = 0; i < slideContainers.length; i++) {
      const element = slideContainers[i];
      
      console.log(`Converting slide ${i + 1} to canvas...`);
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      let finalWidth = availableWidth;
      let finalHeight = availableWidth / ratio;
      
      if (finalHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = availableHeight * ratio;
      }
      
      // Center the image on the page
      const xPosition = (pageWidth - finalWidth) / 2;
      const yPosition = margin + (availableHeight - finalHeight) / 2;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'PNG', xPosition, yPosition, finalWidth, finalHeight);
      
      // Add slide number and metadata
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Slide ${i + 1} of ${slideContainers.length}`, margin, pageHeight - 5);
    }

    pdf.save('Carousel.pdf');
    console.log('✅ PDF downloaded successfully');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

// Download carousel as PPT (PPTX)
export const downloadCarouselAsPPT = async (carousel, headingFont = 'Orbitron', bodyFont = 'Inter') => {
  try {
    console.log('📊 Generating PowerPoint...');
    
    if (!carousel || !carousel.slides || carousel.slides.length === 0) {
      throw new Error('No carousel data available');
    }

    // Dynamic import to handle optional dependency
    let PptxGenJS;
    try {
      PptxGenJS = (await import('pptxgenjs')).default;
    } catch (e) {
      throw new Error('PowerPoint library (pptxgenjs) is not installed. Please install it with: npm install pptxgenjs');
    }

    const prs = new PptxGenJS();
    prs.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });

    console.log(`Creating ${carousel.slides.length} slides in PowerPoint...`);

    for (let i = 0; i < carousel.slides.length; i++) {
      const slide = carousel.slides[i];
      const newSlide = prs.addSlide();

      // Add background color
      const bgColor = carousel.backgroundColor || 'FFFFFF';
      newSlide.background = { fill: bgColor.replace('#', '') };

      // Add slide image if available
      if (slide.imageUrl) {
        try {
          newSlide.addImage({
            path: slide.imageUrl,
            x: 0,
            y: 0,
            w: 10,
            h: 7.5,
            rasterize: true,
          });
        } catch (e) {
          console.warn(`Could not add image to slide ${i + 1}:`, e.message);
        }
      }

      // Add headline text box
      newSlide.addText(slide.headline || '', {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1.5,
        fontSize: 44,
        bold: true,
        fontFace: headingFont,
        color: '000000',
        align: 'center',
        valign: 'top',
      });

      // Add body text box
      newSlide.addText(slide.body || '', {
        x: 0.5,
        y: 2.5,
        w: 9,
        h: 4,
        fontSize: 18,
        fontFace: bodyFont,
        color: '333333',
        align: 'center',
        valign: 'middle',
      });

      // Add slide number
      newSlide.addText(`${i + 1}`, {
        x: 0.5,
        y: 7,
        w: 9,
        h: 0.4,
        fontSize: 10,
        color: '999999',
        align: 'right',
      });
    }

    prs.writeFile({ fileName: 'Carousel.pptx' });
    console.log('✅ PowerPoint downloaded successfully');
  } catch (error) {
    console.error('Error downloading PPT:', error);
    throw error;
  }
};
