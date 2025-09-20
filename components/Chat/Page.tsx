import React, { useEffect, useState } from 'react'
import CaretRight from "@/../public/assets/icons/dark/CaretRight.png"
import pencil from "@/../public/assets/icons/dark/pencil.png"
import EduLearn from "@/../public/assets/images/logo.png"
import Image from "next/image"
import { AIService } from "../../services/ai.service"
import useUserStore from "../../core/userState"
type Props = {}

const Page = (props: Props) => {
  const { user } = useUserStore()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const aiService = new AIService()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user?.id) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await aiService.generateSuggestions({ userId: user.id })
        setSuggestions(response.suggestions || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load suggestions')
        console.error('Error fetching suggestions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [user?.id])

  return (
    <div className='rounded-[24px] bg-[#131313] border border-[#2E3033] py-[12px] px-[24px] flex flex-col justify-between '>
        <div className="py-[16px] flex items-center border-b border-[#2E3033]">
            <div className="p-[12px] border border-[#2E3033] rounded-[9px] gap-[9px]">
                <Image src={CaretRight} alt="CaretRight" width={28} height={28} />
            </div>
            <div className="p-[12px] border border-[#2E3033] rounded-[9px] gap-[9px]">
                <Image src={pencil} alt="pencil" width={28} height={28} />
            </div>
        </div>

        <div className="flex items-center justify-center">
            <div className="flex items-center flex-col gap-[80px]">
                <Image src={EduLearn} alt="EduLearn" width={190} height={39} />
            </div>

            <div className='flex items-center gap-[12px]'>
                {loading && (
                    <div className="text-[#888] text-sm">Loading suggestions...</div>
                )}
                
                {error && (
                    <div className="text-red-400 text-sm">{error}</div>
                )}
                
                {!loading && !error && suggestions.length > 0 && (
                    <div className="flex flex-col gap-[8px] max-w-md">
                        <h3 className="text-[#fff] text-sm font-medium mb-2">Suggested topics:</h3>
                        {suggestions.map((suggestion, index) => (
                            <div 
                                key={index}
                                className="bg-[#1A1A1A] border border-[#2E3033] rounded-[8px] px-[12px] py-[8px] text-[#E5E5E5] text-sm hover:bg-[#222] hover:border-[#444] cursor-pointer transition-colors"
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
                
                {!loading && !error && suggestions.length === 0 && user?.id && (
                    <div className="text-[#888] text-sm">No suggestions available</div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Page