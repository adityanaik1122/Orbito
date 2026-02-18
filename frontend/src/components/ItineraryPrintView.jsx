
import React, { useRef, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Clock, DollarSign, Calendar, Printer, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ItineraryPrintView = ({ isOpen, onClose, itinerary, tripDetails }) => {
  const { toast } = useToast();
  const printRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    setIsGeneratingPdf(true);
    toast({
      title: "Generating PDF...",
      description: "Please wait while we prepare your itinerary.",
    });

    try {
      const element = printRef.current;
      
      // Capture the entire content as a high-quality canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const imgHeightInPdf = imgHeight * ratio;
      
      // Calculate how many pages we need
      const pageCount = Math.ceil(imgHeightInPdf / pdfHeight);
      
      // Split the image across multiple pages
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of the image to show on this page
        const sourceY = (i * pdfHeight) / ratio;
        const sourceHeight = Math.min(pdfHeight / ratio, imgHeight - sourceY);
        
        // Create a temporary canvas for this page's slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        
        const pageCtx = pageCanvas.getContext('2d');
        pageCtx.drawImage(
          canvas,
          0, sourceY, // Source x, y
          imgWidth, sourceHeight, // Source width, height
          0, 0, // Destination x, y
          imgWidth, sourceHeight // Destination width, height
        );
        
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const pageImgHeight = sourceHeight * ratio;
        
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pageImgHeight);
      }

      // Naming: itinerary-[destination]-[startDate].pdf
      const safeDest = tripDetails.destination?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'trip';
      const safeDate = tripDetails.startDate || 'date';
      const filename = `itinerary-${safeDest}-${safeDate}.pdf`;

      pdf.save(filename);

      toast({
        title: "PDF Downloaded! 📄",
        description: `Your ${pageCount}-page itinerary has been saved.`,
      });

    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not generate PDF. Try using the Print button -> Save as PDF.",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!itinerary || itinerary.length === 0) return null;

  const totalActivities = itinerary.reduce((acc, day) => acc + (day.items?.length || 0), 0);
  const totalCost = itinerary.reduce((acc, day) => {
    const dayCost = (day.items || []).reduce((sum, item) => {
      const cost = typeof item.cost === 'string' ? parseFloat(item.cost.replace(/[^0-9.]/g, '')) || 0 : item.cost || 0;
      return sum + cost;
    }, 0);
    return acc + dayCost;
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 print:hidden bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Print Preview</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isGeneratingPdf}>
                {isGeneratingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
              </Button>
              <Button size="sm" onClick={handlePrint} className="bg-[#0B3D91] hover:bg-[#092C6B]">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto p-6 print:p-0 bg-gray-50/50" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <div ref={printRef} className="bg-white p-8 shadow-sm print:shadow-none min-h-[800px] print:min-h-0 mx-auto max-w-[210mm]">
            
            {/* Header */}
            <div className="border-b-2 border-[#0B3D91] pb-6 mb-8">
              <h1 className="text-4xl font-bold text-[#0B3D91] mb-3">{tripDetails.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0B3D91]" />
                  <span className="font-semibold text-lg">{tripDetails.destination}</span>
                </div>
                {tripDetails.startDate && tripDetails.endDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#0B3D91]" />
                    <span className="text-lg">
                      {format(new Date(tripDetails.startDate), 'MMM d, yyyy')} - {format(new Date(tripDetails.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Duration</p>
                  <p className="text-3xl font-bold text-[#0B3D91]">{itinerary.length}</p>
                  <p className="text-xs text-gray-500 mt-1">days</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Activities</p>
                  <p className="text-3xl font-bold text-[#0B3D91]">{totalActivities}</p>
                  <p className="text-xs text-gray-500 mt-1">planned</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Est. Cost</p>
                  <p className="text-3xl font-bold text-[#0B3D91]">£{totalCost.toFixed(0)}</p>
                  <p className="text-xs text-gray-500 mt-1">total</p>
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="space-y-8">
              {itinerary.map((day, dayIndex) => (
                <div key={day.id || dayIndex} className="page-break-inside-avoid break-inside-avoid">
                  <div className="bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] text-white rounded-t-xl px-6 py-4 print:bg-[#0B3D91] print:text-white">
                    <h2 className="text-2xl font-bold">Day {dayIndex + 1}</h2>
                    <p className="text-blue-100">{format(new Date(day.date), 'EEEE, MMMM do, yyyy')}</p>
                  </div>
                  
                  <div className="border-x-2 border-b-2 border-gray-200 rounded-b-xl p-6 space-y-5 bg-white">
                    {day.items && day.items.length > 0 ? (
                      day.items.map((item, itemIndex) => (
                        <div key={item.id || itemIndex} className="flex gap-4 pb-5 border-b border-gray-200 last:border-0 last:pb-0">
                          <div className="flex-shrink-0 w-14 text-center pt-1">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0B3D91] flex items-center justify-center font-bold text-lg border-2 border-blue-200 print:bg-blue-100 print:text-[#0B3D91]">
                              {itemIndex + 1}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                              {item.time && (
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0B3D91] bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap border border-blue-100 print:bg-gray-100">
                                  <Clock className="w-4 h-4" />
                                  {item.time}
                                </div>
                              )}
                            </div>
                            
                            {item.location && (
                              <div className="flex items-center gap-2 text-base text-gray-700 mb-3">
                                <MapPin className="w-4 h-4 text-[#0B3D91]" />
                                <span className="font-medium">{item.location}</span>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-3 text-sm">
                              {item.estTime && (
                                <span className="bg-gray-100 px-3 py-1.5 rounded-lg font-medium text-gray-700 print:bg-gray-50 print:border print:border-gray-200">
                                  Duration: {item.estTime}
                                </span>
                              )}
                              {item.cost && (
                                <span className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium text-gray-700 print:bg-gray-50 print:border print:border-gray-200">
                                  <DollarSign className="w-3.5 h-3.5" /> {item.cost}
                                </span>
                              )}
                              {item.openingHours && (
                                <span className="bg-gray-100 px-3 py-1.5 rounded-lg font-medium text-gray-700 print:bg-gray-50 print:border print:border-gray-200">
                                  Hours: {item.openingHours}
                                </span>
                              )}
                            </div>
                            
                            {item.notes && (
                              <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg print:bg-yellow-50">
                                <p className="text-sm text-gray-800">
                                  <strong className="text-yellow-800">Note:</strong> {item.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-6 italic">No activities planned for this day</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t-2 border-gray-200 text-center text-sm text-gray-500">
              <p className="font-semibold">Created with Orbito Trip Planner</p>
              <p className="mt-1">Generated on {format(new Date(), 'PPP')}</p>
            </div>
          </div>
        </div>
      </DialogContent>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:p-0, .print\\:p-0 * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          @page {
            margin: 1.5cm;
            size: A4;
          }
        }
      `}</style>
    </Dialog>
  );
};

export default ItineraryPrintView;
