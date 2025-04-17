import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, SectionType } from 'docx';
import { saveAs } from 'file-saver';
import { downloadAudioAsMp3 } from './audioConversionService';

interface ExportContent {
  title: string;
  date: string;
  duration: string;
  summary?: {
    text: string;
    topics?: string[];
    actionItems?: string[];
  };
  transcription?: Array<{
    timestamp: string;
    text: string;
  }>;
  file_url?: string;
}

export async function downloadAudioFile(fileUrl: string, title: string): Promise<void> {
  try {
    await downloadAudioAsMp3(fileUrl, title);
  } catch (error) {
    console.error('Error in downloadAudioFile:', error);
    throw error;
  }
}

export async function exportToPdf(content: ExportContent): Promise<Blob> {
  try {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(20);
    doc.text(content.title, margin, yPos);
    yPos += lineHeight * 2;

    // Metadata
    doc.setFontSize(12);
    doc.text(`Dato: ${content.date}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Varighet: ${content.duration}`, margin, yPos);
    yPos += lineHeight * 2;

    // Summary section
    if (content.summary) {
      doc.setFontSize(16);
      doc.text('Sammendrag', margin, yPos);
      yPos += lineHeight * 1.5;

      doc.setFontSize(12);
      const summaryLines = doc.splitTextToSize(content.summary.text, pageWidth - (margin * 2));
      summaryLines.forEach((line: string) => {
        if (yPos > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += lineHeight;
      });

      if (content.summary.topics?.length) {
        yPos += lineHeight;
        doc.setFontSize(14);
        doc.text('Hovedtemaer', margin, yPos);
        yPos += lineHeight;
        doc.setFontSize(12);
        content.summary.topics.forEach(topic => {
          if (yPos > doc.internal.pageSize.height - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(`• ${topic}`, margin + 5, yPos);
          yPos += lineHeight;
        });
      }

      if (content.summary.actionItems?.length) {
        yPos += lineHeight;
        doc.setFontSize(14);
        doc.text('Handlingspunkter', margin, yPos);
        yPos += lineHeight;
        doc.setFontSize(12);
        content.summary.actionItems.forEach(item => {
          if (yPos > doc.internal.pageSize.height - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(`• ${item}`, margin + 5, yPos);
          yPos += lineHeight;
        });
      }
    }

    // Transcription section
    if (content.transcription?.length) {
      doc.addPage();
      yPos = margin;
      
      doc.setFontSize(16);
      doc.text('Transkripsjon', margin, yPos);
      yPos += lineHeight * 1.5;

      doc.setFontSize(12);
      content.transcription.forEach(segment => {
        if (yPos > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(`[${segment.timestamp}] ${segment.text}`, margin, yPos);
        yPos += lineHeight;
      });
    }

    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Kunne ikke generere PDF');
  }
}

export async function exportToDocx(content: ExportContent): Promise<Blob> {
  try {
    const children = [];
    
    // Add title
    children.push(
      new Paragraph({
        text: content.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );
    
    // Add metadata
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Dato: ${content.date}`, size: 24 }),
          new TextRun({ text: '\n', break: 1 }),
          new TextRun({ text: `Varighet: ${content.duration}`, size: 24 })
        ],
        spacing: { after: 400 }
      })
    );

    // Add summary section if available
    if (content.summary?.text) {
      children.push(
        new Paragraph({
          text: 'Sammendrag',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: content.summary.text,
          spacing: { after: 200 }
        })
      );

      // Add topics if available
      if (content.summary.topics?.length) {
        children.push(
          new Paragraph({
            text: 'Hovedtemaer',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 200 }
          })
        );

        content.summary.topics.forEach(topic => {
          children.push(
            new Paragraph({
              text: `• ${topic}`,
              spacing: { after: 100 }
            })
          );
        });
      }

      // Add action items if available
      if (content.summary.actionItems?.length) {
        children.push(
          new Paragraph({
            text: 'Handlingspunkter',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 200 }
          })
        );

        content.summary.actionItems.forEach(item => {
          children.push(
            new Paragraph({
              text: `• ${item}`,
              spacing: { after: 100 }
            })
          );
        });
      }
    }

    // Add transcription if available
    if (content.transcription?.length) {
      children.push(
        new Paragraph({
          text: 'Transkripsjon',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        })
      );

      content.transcription.forEach(segment => {
        children.push(
          new Paragraph({
            text: `[${segment.timestamp}] ${segment.text}`,
            spacing: { after: 100 }
          })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            type: SectionType.CONTINUOUS
          },
          children: children
        }
      ]
    });

    return await Packer.toBlob(doc);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Kunne ikke generere DOCX');
  }
}

export async function exportToCsv(content: ExportContent): Promise<Blob> {
  try {
    if (!content.transcription?.length) {
      throw new Error('Ingen transkripsjon tilgjengelig for CSV-eksport');
    }

    const csvRows = [
      ['Tidspunkt', 'Tekst'],
      ...content.transcription.map(segment => [
        segment.timestamp,
        `"${segment.text.replace(/"/g, '""')}"`
      ])
    ];

    const csvContent = csvRows
      .map(row => row.join(','))
      .join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw new Error('Kunne ikke generere CSV');
  }
}