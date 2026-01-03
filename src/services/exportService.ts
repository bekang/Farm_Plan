import type { CropCycle, Task, LegacyField as Field } from '@/types';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';

export type ExportFormat = 'excel' | 'word' | 'image' | 'calendar';

export class ExportService {
  /**
   * Universal Save Function using File System Access API or fallback
   */
  static async saveFile(blob: Blob, filename: string, extension: string) {
    // Feature detection for File System Access API (Save As)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `${filename}.${extension}`,
          types: [
            {
              description: `${extension.toUpperCase()} File`,
              accept: { [blob.type.split(';')[0]]: [`.${extension}`] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err: any) {
        // User cancelled or error, fall back if not cancellation
        if (err.name !== 'AbortError') {
          console.warn('File System Access API failed, falling back:', err);
          saveAs(blob, `${filename}.${extension}`);
        }
        return;
      }
    }

    // Fallback for browsers without showSaveFilePicker
    saveAs(blob, `${filename}.${extension}`);
  }

  /**
   * Export as Image (PNG)
   */
  static async exportImage(element: HTMLElement, filename: string) {
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true, // Handle cross-origin images/fonts
        allowTaint: true, // Allow tainted canvas (local dev)
        backgroundColor: '#ffffff', // Ensure white background
        logging: false,
        onclone: (clonedDoc) => {
          // Inject styles to fix text rendering and font issues in html2canvas
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
                        * { 
                            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important; 
                            font-feature-settings: normal !important;
                            font-variant: normal !important;
                            text-rendering: auto !important;
                            letter-spacing: normal !important;
                            line-height: 1.5 !important; 
                        }
                        /* Ensure text containers don't clip descenders */
                        .truncate {
                            overflow: visible !important;
                            white-space: normal !important; /* Allow wrapping if needed in export or just visible */
                        }
                        .lucide {
                            vertical-align: middle;
                        }
                    `;
          clonedDoc.head.appendChild(style);

          // Fix for chopped text in some browsers
          const clonedElement = clonedDoc.body.querySelector(`[data-html2canvas-ignore]`);
          if (clonedElement) clonedElement.remove(); // Remove ignored elements if any
        },
      });

      canvas.toBlob((blob) => {
        if (blob) this.saveFile(blob, filename, 'png');
      });
    } catch (error) {
      console.error('Image export failed:', error);
    }
  }

  /**
   * Export as Excel (.xlsx)
   */
  static exportExcel(data: any[][], sheetName: string, filename: string) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    this.saveFile(blob, filename, 'xlsx');
  }

  /**
   * Export as Word (.docx)
   */
  static async exportWord(headers: string[], rows: string[][], title: string, filename: string) {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: title, heading: 'Heading1' }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                // Header Row
                new TableRow({
                  children: headers.map(
                    (h) =>
                      new TableCell({
                        children: [new Paragraph({ text: h, style: 'strong' })],
                        borders: {
                          bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
                        },
                      }),
                  ),
                }),
                // Data Rows
                ...rows.map(
                  (row) =>
                    new TableRow({
                      children: row.map(
                        (cell) =>
                          new TableCell({
                            children: [new Paragraph(String(cell))],
                          }),
                      ),
                    }),
                ),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    this.saveFile(blob, filename, 'docx');
  }

  /**
   * Export Crop Schedule Logic
   */
  static async exportCropSchedule(
    cycles: CropCycle[],
    fields: Field[],
    format: ExportFormat,
    filename: string,
    element?: HTMLElement, // Required for image
  ) {
    if (format === 'image' && element) {
      await this.exportImage(element, filename);
      return;
    }

    const headers = ['농지명', '작물명', '시작일', '종료일', '상태', '메모'];
    const rows = cycles.map((cycle) => {
      const field = fields.find((f) => f.id === cycle.field_id);
      return [
        field ? field.name : '미지정',
        cycle.crop_name,
        cycle.start_date,
        cycle.end_date,
        cycle.status === 'active' ? '진행중' : cycle.status === 'completed' ? '완료' : '계획',
        '',
      ];
    });

    if (format === 'excel') {
      this.exportExcel([headers, ...rows], '농기스케줄', filename);
    } else if (format === 'word') {
      await this.exportWord(headers, rows as string[][], '농기 스케줄', filename);
    } else if (format === 'calendar') {
      await this.exportICS(cycles, fields, filename);
    }
  }

  /**
   * Export Task List Logic
   */
  static async exportTaskList(
    tasks: Task[],
    cycles: CropCycle[],
    fields: Field[],
    format: ExportFormat,
    filename: string,
    element?: HTMLElement,
  ) {
    if (format === 'image' && element) {
      await this.exportImage(element, filename);
      return;
    }

    const headers = ['날짜', '작업내용', '농지명', '작물명', '종류', '상태'];
    const rows = tasks.map((task) => {
      const cycle = cycles.find((c) => c.id === task.crop_cycle_id);
      const field = fields.find((f) => f.id === task.field_id);
      return [
        task.date,
        task.content,
        field ? field.name : '-',
        cycle ? cycle.crop_name : '-',
        task.type === 'planting' ? '파종' : task.type === 'harvest' ? '수확' : '일반',
        task.status === 'completed' ? '완료' : '예정',
      ];
    });

    if (format === 'excel') {
      this.exportExcel([headers, ...rows], '작업목록', filename);
    } else if (format === 'word') {
      await this.exportWord(headers, rows as string[][], '작업 목록', filename);
    }
  }

  static async exportICS(cycles: CropCycle[], fields: Field[], filename: string) {
    // 1. Define Calendar Metadata
    const userId = fields[0]?.user_id || 'User';
    const farmName = fields.length === 1 ? fields[0].name : '통합농지';
    const calendarName = `꿈을그리는농장_${userId}_${farmName}`;

    // 2. Build VCALENDAR Header
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DreamPaintingFarm//CropSchedule//KO',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${calendarName}`,
      `X-WR-TIMEZONE:Asia/Seoul`,
    ];

    // 3. Add VTIMEZONE Definition
    icsContent.push(
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Seoul',
      'X-LIC-LOCATION:Asia/Seoul',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+0900',
      'TZOFFSETTO:+0900',
      'TZNAME:KST',
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE',
    );

    // 4. Create Events from Cycles
    cycles.forEach((cycle) => {
      const formatDate = (dateStr: string) => dateStr.replace(/-/g, '');
      const endDateObj = new Date(cycle.end_date);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const endDateStr = endDateObj.toISOString().split('T')[0].replace(/-/g, '');

      const fieldName = fields.find((f) => f.id === cycle.field_id)?.name || '알수없음';
      // Use cycle crop name for visual summary

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${cycle.id}@dreampaintingfarm`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART;VALUE=DATE:${formatDate(cycle.start_date)}`,
        `DTEND;VALUE=DATE:${endDateStr}`,
        `SUMMARY:[${farmName}] ${cycle.crop_name}`,
        `DESCRIPTION:농지: ${fieldName}\\n작물: ${cycle.crop_name}\\n상태: ${cycle.status}`,
        'STATUS:CONFIRMED',
        'TRANSP:TRANSPARENT',
        'END:VEVENT',
      );
    });

    icsContent.push('END:VCALENDAR');

    // 6. Save File
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    await this.saveFile(blob, filename, 'ics');
  }
}
