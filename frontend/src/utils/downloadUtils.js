import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Download single slide as PNG
export const downloadSlideAsPNG = async (slideElement, slideNumber) => {
  try {
    const canvas = await html2canvas(slideElement, {
      backgroundColor: null,
      scale: 2,
      logging: false,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `Slide_${slideNumber}.png`;
    link.click();
    console.log(`✅ Downloaded Slide ${slideNumber} as PNG`);
  } catch (error) {
    console.error('Error downloading PNG:', error);
    alert('Failed to download PNG. Please try again.');
  }
};

// Download all slides as PNGs (zip)
export const downloadAllSlidesAsPNG = async (carouselData) => {
  try {
    alert('📥 Preparing PNG download... This may take a moment.');
    
    // For now, trigger individual downloads
    // In a production app, you'd use a library like JSZip to create an actual ZIP
    const slideContainers = document.querySelectorAll('[data-slide-container]');
    
    for (let i = 0; i < slideContainers.length; i++) {
      const element = slideContainers[i];
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Slide_${i + 1}.png`;
      
      // Stagger downloads to avoid browser blocking
      await new Promise(resolve => setTimeout(resolve, 500));
      link.click();
    }
    
    console.log('✅ All slides downloaded as PNG');
  } catch (error) {
    console.error('Error downloading PNGs:', error);
    alert('Failed to download PNGs. Please try again.');
  }
};

// Download carousel as PDF
export const downloadCarouselAsPDF = async (carouselData, headingFont, bodyFont) => {
  try {
    alert('📄 Generating PDF... This may take a moment.');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const slideContainers = document.querySelectorAll('[data-slide-container]');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < slideContainers.length; i++) {
      const element = slideContainers[i];
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Add slide number
      pdf.setFontSize(10);
      pdf.text(`Slide ${i + 1} of ${slideContainers.length}`, 10, pageHeight - 10);
    }

    pdf.save('Carousel.pdf');
    console.log('✅ Downloaded carousel as PDF');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download PDF. Please try again.');
  }
};

// Download carousel as PPT (PPTX)
export const downloadCarouselAsPPT = async (carouselData, headingFont, bodyFont) => {
  try {
    alert('📊 Generating PowerPoint... This may take a moment.');
    
    // Dynamic import to avoid build issues if pptxgen not installed
    const PptxGenJS = (await import('pptxgenjs')).default;
    const prs = new PptxGenJS();

    prs.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });

    for (let i = 0; i < carouselData.slides.length; i++) {
      const slide = carouselData.slides[i];
      const newSlide = prs.addSlide();

      // Add background color
      newSlide.background = { fill: carouselData.backgroundColor || 'FFFFFF' };

      // Add slide image if available
      if (slide.imageUrl) {
        try {
          newSlide.addImage({
            path: slide.imageUrl,
            x: 0,
            y: 0,
            w: 10,
            h: 7.5,
          });
        } catch (e) {
          console.warn('Could not add image to slide', i);
        }
      }

      // Add headline text box
      newSlide.addText(slide.headline, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1.5,
        fontSize: 44,
        bold: true,
        fontFace: headingFont,
        color: '000000',
        align: 'center',
      });

      // Add body text box
      newSlide.addText(slide.body, {
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
      newSlide.addText(`Slide ${i + 1}`, {
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
    console.log('✅ Downloaded carousel as PowerPoint');
  } catch (error) {
    console.error('Error downloading PPT:', error);
    alert('Failed to download PowerPoint. Make sure the required library is installed.');
  }
};
