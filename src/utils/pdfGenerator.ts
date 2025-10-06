import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TimetableEntry {
  day: string;
  time_slots: {
    start_time: string;
    end_time: string;
  };
  subjects: {
    name: string;
    code: string;
    type: string;
  };
  faculty: {
    name: string;
  };
  classrooms: {
    name: string;
    building: string;
  };
  batches: {
    name: string;
  };
}

export function generateTimetablePDF(
  timetableName: string,
  entries: TimetableEntry[],
  metadata?: {
    department?: string;
    semester?: string;
    academicYear?: string;
  }
) {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(20);
  doc.text(timetableName, pageWidth / 2, 15, { align: 'center' });

  let yOffset = 25;
  if (metadata) {
    doc.setFontSize(10);
    const metaText = [
      metadata.department && `Department: ${metadata.department}`,
      metadata.semester && `Semester: ${metadata.semester}`,
      metadata.academicYear && `Academic Year: ${metadata.academicYear}`
    ]
      .filter(Boolean)
      .join(' | ');
    doc.text(metaText, pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 8;
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = Array.from(
    new Set(
      entries.map(e => `${e.time_slots.start_time}-${e.time_slots.end_time}`)
    )
  ).sort();

  const tableData: any[][] = [];

  timeSlots.forEach(timeSlot => {
    const row: any[] = [timeSlot];

    days.forEach(day => {
      const entry = entries.find(
        e =>
          e.day === day &&
          `${e.time_slots.start_time}-${e.time_slots.end_time}` === timeSlot
      );

      if (entry) {
        const cellText = [
          entry.subjects.name,
          `(${entry.subjects.code})`,
          entry.faculty.name,
          entry.classrooms.name,
          entry.batches.name
        ].join('\n');
        row.push(cellText);
      } else {
        row.push('');
      }
    });

    tableData.push(row);
  });

  autoTable(doc, {
    startY: yOffset,
    head: [['Time', ...days]],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'center',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 25, fontStyle: 'bold' }
    },
    margin: { top: yOffset, bottom: 15, left: 10, right: 10 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );

      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - 15,
        pageHeight - 8
      );
    }
  });

  return doc;
}

export function downloadTimetablePDF(
  timetableName: string,
  entries: TimetableEntry[],
  metadata?: {
    department?: string;
    semester?: string;
    academicYear?: string;
  }
) {
  const doc = generateTimetablePDF(timetableName, entries, metadata);
  const fileName = `${timetableName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
}

export function previewTimetablePDF(
  timetableName: string,
  entries: TimetableEntry[],
  metadata?: {
    department?: string;
    semester?: string;
    academicYear?: string;
  }
): string {
  const doc = generateTimetablePDF(timetableName, entries, metadata);
  return doc.output('dataurlstring');
}
