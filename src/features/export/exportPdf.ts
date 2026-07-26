import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { db } from '@/lib/db/db'
import { dateStamp } from '@/lib/download'

export async function exportPdf() {
  const tasks = (await db.tasks.toArray()).filter((t) => !t.isDeleted)
  const sorted = [...tasks].sort((a, b) => (a.date < b.date ? 1 : -1))
  const completed = tasks.filter((t) => t.completed).length
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text('Daily Logger — Task Report', 14, 18)

  doc.setFontSize(10)
  doc.setTextColor(110)
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 25)
  doc.text(`${completed} of ${tasks.length} tasks completed (${completionRate}%)`, 14, 31)

  autoTable(doc, {
    startY: 38,
    head: [['Date', 'Title', 'Priority', 'Completed', 'Tags']],
    body: sorted.map((t) => [t.date, t.title, t.priority, t.completed ? 'Yes' : 'No', t.tags.join(', ')]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [22, 27, 34] },
    alternateRowStyles: { fillColor: [246, 248, 250] },
  })

  doc.save(`daily-logger-report-${dateStamp()}.pdf`)
}
