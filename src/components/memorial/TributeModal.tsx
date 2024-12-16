import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import html2pdf from 'html2pdf.js'

interface TributeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  photos: Array<{ 
    caption: string
    contributorName?: string 
    relationship?: string
  }>
}

export const TributeModal = ({ open, onOpenChange, photos }: TributeModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [tribute, setTribute] = useState<{ summary: string; poem: string } | null>(null)
  const { toast } = useToast()

  const generateTribute = async () => {
    setIsLoading(true)
    try {
      const captions = photos.map(photo => ({
        caption: photo.caption,
        contributor: photo.contributorName,
        relationship: photo.relationship
      }))
      
      const { data, error } = await supabase.functions.invoke('generate-tribute', {
        body: { captions }
      })

      if (error) throw error

      setTribute(data)
    } catch (error: any) {
      console.error('Error generating tribute:', error)
      toast({
        title: "Error generating tribute",
        description: error.message || "There was a problem generating the tribute. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadPDF = () => {
    if (!tribute) return

    const content = document.getElementById('tribute-content')
    if (!content) return

    const opt = {
      margin: 1,
      filename: 'memorial-tribute.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(content).save()
  }

  const formatPoem = (poem: string) => {
    // Split into stanzas (double line breaks)
    const stanzas = poem.split('\n\n')
    return stanzas.map((stanza, index) => (
      <div key={index} className="mb-8 last:mb-0">
        {stanza.split('\n').map((line, lineIndex) => (
          <p key={lineIndex} className="leading-relaxed italic text-center">
            {line}
          </p>
        ))}
      </div>
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair">Your Memorial Tribute</DialogTitle>
          <DialogDescription>
            A personalized tribute and poem created from your shared memories.
          </DialogDescription>
        </DialogHeader>

        {!tribute && !isLoading && (
          <div className="flex justify-center py-8">
            <Button onClick={generateTribute}>
              Generate Tribute
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-memorial-blue mb-4" />
            <p className="text-gray-600">Creating your special tribute...</p>
          </div>
        )}

        {tribute && (
          <div className="space-y-8" id="tribute-content">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-playfair">Tribute Summary</h3>
              <div className="prose max-w-none bg-memorial-beige-light/50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {tribute.summary}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-playfair">Memorial Poem</h3>
              <div className="prose max-w-none bg-memorial-beige-light p-6 rounded-lg">
                <div className="text-gray-700">
                  {formatPoem(tribute.poem)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={generateTribute}>
                Regenerate
              </Button>
              <Button onClick={downloadPDF}>
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}