"use client";
import React, { useEffect, useState, useMemo } from 'react'
import { WalletService } from '../../../../services/wallet.service'
import useUserStore from '../../../../core/userState'
import { getHighQualityImageUrl } from '../../../../utils/imageHelper'
import Image from 'next/image'
import wallet from "@/../public/assets/icons/wallet.png"
import copy from "@/../public/assets/icons/dark/copy.png"
import avatar from "@/../public/assets/icons/avatar2.png"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SolanaQR from "@/../components/SolanaQR"

const walletService = new WalletService()

function Wallet() {
    const [solBalance, setSolBalance] = useState(0)
    const [edlnBalance, setEdlnBalance] = useState(0)
    const [prices, setPrices] = useState({ SOL: 0, EDLN: 0 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [receiveModalVisible, setReceiveModalVisible] = useState(false)
    const [isBuyModalVisible, setBuyModalVisible] = useState(false)
    const [buyAmount, setBuyAmount] = useState("")
    const [buyError, setBuyError] = useState<string | null>(null)
    const [buySuccessModalVisible, setBuySuccessModalVisible] = useState(false)
    const [transactionLink, setTransactionLink] = useState<string>("")
    const [isBuying, setIsBuying] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const { user } = useUserStore()

    const netWorth = useMemo(() => {
        return (edlnBalance * prices.EDLN) + (solBalance * prices.SOL)
    }, [edlnBalance, prices.EDLN, solBalance, prices.SOL])

    const solValue = useMemo(() => {
        return solBalance * prices.SOL
    }, [solBalance, prices.SOL])

    const edlnValue = useMemo(() => {
        return edlnBalance * prices.EDLN
    }, [edlnBalance, prices.EDLN])

    useEffect(() => {
        const fillUpBalances = async () => {
            if (!user?.address) {
                setError('User address not found')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const [balance, priceData] = await Promise.all([
                    walletService.getBalance(user.address),
                    walletService.getPrices()
                ])

                setSolBalance(balance.sol)
                setEdlnBalance(balance.tokenAccount)
                setPrices(priceData)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch wallet data')
                console.error('Error fetching wallet data:', err)
            } finally {
                setLoading(false)
            }
        }

        fillUpBalances()
    }, [user?.address])

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const toggleBuyModal = () => {
        setBuyModalVisible(!isBuyModalVisible)
        if (!isBuyModalVisible) {
            setBuyAmount("")
            setBuyError(null)
        }
    }

    const refreshBalance = async () => {
        if (!user?.address) return
        
        try {
            const [balance, priceData] = await Promise.all([
                walletService.getBalance(user.address),
                walletService.getPrices()
            ])

            setSolBalance(balance.sol)
            setEdlnBalance(balance.tokenAccount)
            setPrices(priceData)
        } catch (err) {
            console.error('Error refreshing balance:', err)
        }
    }

    const handleManualRefresh = async () => {
        setIsRefreshing(true)
        await refreshBalance()
        setIsRefreshing(false)
    }

    const handleBuyEDLN = async () => {
        try {
            setIsBuying(true)
            setBuyError(null)
            const amount = parseFloat(buyAmount)
            if (isNaN(amount) || amount <= 0) {
                setBuyError("Please enter a valid amount")
                setIsBuying(false)
                return
            }

            if (amount > solBalance) {
                setBuyError("Insufficient SOL balance")
                setIsBuying(false)
                return
            }

            const result = await walletService.swapSolToEDLN(user?.id || "", amount)
            console.log(`Successfully bought EDLN with ${amount} SOL`)
            
            setTransactionLink(result.response || "")
            
            setIsBuying(false)
            toggleBuyModal()
            setBuySuccessModalVisible(true)
            
            await new Promise(resolve => setTimeout(resolve, 2000))
            await refreshBalance()
            
            setTimeout(async () => {
                await refreshBalance()
            }, 5000)
        } catch (error: unknown) {
            setBuyError(error instanceof Error ? error.message : "Failed to complete purchase")
            setIsBuying(false)
        }
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    const formatTokenAmount = (value: number, decimals: number = 4) => {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: decimals
        })
    }
    const buttonShouldBeDisabled = isBuying || buyError !== null;

    if (loading) {
        return (
            <div className="pb-[32px]">
                <div className="bg-[#00FF80] rounded-[24px] py-[20px] px-[24px]">
                    <div className="flex items-center justify-center py-[40px]">
                        <div className="animate-pulse text-[#000] text-[16px] font-[500]">
                            Loading wallet data...
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="pb-[32px]">
                <div className="bg-[#FF5555] rounded-[24px] py-[20px] px-[24px]">
                    <div className="flex flex-col items-center justify-center py-[40px] gap-[12px]">
                        <p className="text-[#fff] text-[18px] font-[700]">Error</p>
                        <p className="text-[#fff] text-[14px] font-[400]">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-[32px]">
            <div className="bg-[#00FF80] rounded-[24px] py-[20px] px-[24px]">
                <div className="flex flex-col gap-[20px] md:hidden">
                    <div className="flex items-center gap-[14px]">
                        <Image
                            src={getHighQualityImageUrl(user?.profilePictureURL) || avatar}
                            className="rounded-[27px] object-cover"
                            alt="user image"
                            height={42}
                            width={42}
                        />
                        <div className="flex-1">
                            <p className="text-[#000] text-[16px] font-[500] leading-[22px] truncate">
                                {user?.name}
                            </p>
                        </div>
                    </div>

                    <div className="bg-[rgba(255,255,255,0.6)] rounded-[16px] p-[12px]">
                        <div className="flex items-center gap-[8px] mb-[12px]">
                            <Image src={wallet} alt="wallet" height={24} width={24} />
                            <p className="text-[#000] text-[14px] font-[500] leading-[22px] truncate flex-1">
                                {user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : ''}
                            </p>
                            <button
                                onClick={() => copyToClipboard(user?.address || "")}
                                className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
                            >
                                <Image src={copy} alt="copy" height={16} width={16} />
                            </button>
                        </div>
                        {copied && (
                            <p className="text-[#000] text-[10px] font-[400] text-center mb-[8px]">
                                Address copied!
                            </p>
                        )}
                    </div>

                    <div className="bg-[rgba(255,255,255,0.6)] rounded-[16px] p-[16px]">
                        <div className="text-center mb-[16px]">
                            <div className="flex items-center justify-center gap-[8px]">
                                <p className="text-[#61728C] text-[12px] font-[400] leading-[16px] mb-[4px]">
                                    Total Balance
                                </p>
                                <button
                                    onClick={handleManualRefresh}
                                    disabled={isRefreshing}
                                    className="mb-[4px] p-1 hover:bg-black/10 rounded transition-colors disabled:opacity-50"
                                    title="Refresh balance"
                                >
                                    <svg 
                                        className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                                        fill="none" 
                                        stroke="#61728C" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-[#000] text-[32px] font-[700] leading-[40px]">
                                ${formatCurrency(netWorth)}
                            </p>
                        </div>

                        <div className="flex gap-[8px] mb-[16px]">
                            <button
                                onClick={() => setReceiveModalVisible(true)}
                                className="flex-1 bg-[#000000] text-[#FFFFFF] px-[16px] py-[12px] rounded-[12px] font-[600] text-[14px] hover:bg-[#333333] transition-colors"
                            >
                                Receive SOL
                            </button>
                            <button
                                onClick={toggleBuyModal}
                                className="flex-1 bg-[#000000] text-[#FFFFFF] px-[16px] py-[12px] rounded-[12px] font-[600] text-[14px] hover:bg-[#333333] transition-colors"
                            >
                                Buy EDLN
                            </button>
                        </div>

                        <div className="flex flex-col gap-[12px]">
                            <div className="flex items-center justify-between bg-[rgba(255,255,255,0.5)] rounded-[12px] p-[12px]">
                                <div className="flex flex-col">
                                    <p className="text-[#000] text-[18px] font-[700] leading-[24px]">
                                        {formatTokenAmount(solBalance, 4)}
                                    </p>
                                    <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">
                                        SOL
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-[#000] text-[14px] font-[600] leading-[20px]">
                                        ${formatCurrency(solValue)}
                                    </p>
                                    <p className="text-[#61728C] text-[12px] font-[400] leading-[16px]">
                                        ${formatCurrency(prices.SOL)}/SOL
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-[rgba(255,255,255,0.5)] rounded-[12px] p-[12px]">
                                <div className="flex flex-col">
                                    <p className="text-[#000] text-[18px] font-[700] leading-[24px]">
                                        {formatTokenAmount(edlnBalance, 2)}
                                    </p>
                                    <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">
                                        EDLN
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-[#000] text-[14px] font-[600] leading-[20px]">
                                        ${formatCurrency(edlnValue)}
                                    </p>
                                    <p className="text-[#61728C] text-[12px] font-[400] leading-[16px]">
                                        ${formatCurrency(prices.EDLN)}/EDLN
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex flex-col gap-[20px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[14px]">
                            <Image
                                src={getHighQualityImageUrl(user?.profilePictureURL) || avatar}
                                className="rounded-[27px] object-cover"
                                alt="user image"
                                height={60}
                                width={60}
                            />
                            <div>
                                <p className="text-[#000] text-[20px] font-[600] leading-[28px]">
                                    {user?.name}
                                </p>
                                <p className="text-[#000] text-[14px] font-[400] leading-[20px] opacity-70">
                                    Wallet Overview
                                </p>
                            </div>
                        </div>

                        <div className="bg-[rgba(255,255,255,0.6)] rounded-[16px] p-[12px] flex items-center gap-[8px]">
                            <Image src={wallet} alt="wallet" height={24} width={24} />
                            <p className="text-[#000] text-[14px] font-[500] leading-[22px]">
                                {user?.address ? `${user.address.slice(0, 8)}...${user.address.slice(-6)}` : ''}
                            </p>
                            <button
                                onClick={() => copyToClipboard(user?.address || "")}
                                className="p-1 hover:bg-black/10 rounded transition-colors"
                            >
                                <Image src={copy} alt="copy" height={16} width={16} />
                            </button>
                        </div>
                    </div>
                    {copied && (
                        <div className="text-center">
                            <p className="text-[#000] text-[12px] font-[500]">
                                Address copied to clipboard!
                            </p>
                        </div>
                    )}

                    <div className="bg-[rgba(255,255,255,0.6)] rounded-[16px] p-[24px]">
                        <div className="text-center mb-[24px]">
                            <div className="flex items-center justify-center gap-[8px]">
                                <p className="text-[#61728C] text-[14px] font-[500] leading-[20px] mb-[8px]">
                                    Total Portfolio Value
                                </p>
                                <button
                                    onClick={handleManualRefresh}
                                    disabled={isRefreshing}
                                    className="mb-[8px] p-1 hover:bg-black/10 rounded transition-colors disabled:opacity-50"
                                    title="Refresh balance"
                                >
                                    <svg 
                                        className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                                        fill="none" 
                                        stroke="#61728C" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-[#000] text-[48px] font-[700] leading-[56px]">
                                ${formatCurrency(netWorth)}
                            </p>
                        </div>

                        <div className="flex gap-[12px] mb-[24px]">
                            <button
                                onClick={() => setReceiveModalVisible(true)}
                                className="flex-1 bg-[#000000] text-[#FFFFFF] px-[24px] py-[14px] rounded-[16px] font-[700] text-[16px] hover:bg-[#333333] transition-colors"
                            >
                                Receive SOL
                            </button>
                            <button
                                onClick={toggleBuyModal}
                                className="flex-1 bg-[#000000] text-[#FFFFFF] px-[24px] py-[14px] rounded-[16px] font-[700] text-[16px] hover:bg-[#333333] transition-colors"
                            >
                                Buy EDLN
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-[16px]">
                            <div className="bg-[rgba(255,255,255,0.7)] rounded-[12px] p-[16px]">
                                <div className="flex flex-col gap-[8px]">
                                    <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">
                                        Solana
                                    </p>
                                    <p className="text-[#000] text-[24px] font-[700] leading-[32px]">
                                        {formatTokenAmount(solBalance, 4)}
                                    </p>
                                    <p className="text-[#000] text-[14px] font-[500] leading-[20px]">
                                        SOL
                                    </p>

                                </div>
                            </div>

                            <div className="bg-[rgba(255,255,255,0.7)] rounded-[12px] p-[16px]">
                                <div className="flex flex-col gap-[8px]">
                                    <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">
                                        EduLearn Token
                                    </p>
                                    <p className="text-[#000] text-[24px] font-[700] leading-[32px]">
                                        {formatTokenAmount(edlnBalance, 2)}
                                    </p>
                                    <p className="text-[#000] text-[14px] font-[500] leading-[20px]">
                                        EDLN
                                    </p>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={receiveModalVisible} onOpenChange={setReceiveModalVisible}>
                <DialogContent className="bg-[#FFFFFF] dark:bg-[#131313] border-[#EDF3FC] dark:border-[#2E3033] max-w-md flex items-center flex-col">
                    <DialogHeader className="text-center">
                        
                        <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[20px] font-[700] mb-2 text-center">
                            Receive SOL
                        </DialogTitle>
                        <DialogDescription className="text-[#61728C] dark:text-[#B3B3B3] text-[14px] font-[400] text-center">
                            Scan this QR code to receive SOL to your wallet
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-[16px] w-full py-[16px]">
                        <div className="bg-white p-[16px] rounded-[16px]">
                            <SolanaQR 
                                address={user?.address || ""} 
                                amount="" 
                                label="EduLearn Wallet" 
                            />
                        </div>

                        <div className="bg-[rgba(0,255,128,0.1)] rounded-[12px] p-[12px] w-full">
                            <p className="text-[#61728C] dark:text-[#B3B3B3] text-[12px] font-[500] mb-[4px] text-center">
                                Your Wallet Address
                            </p>
                            <div className="flex items-center justify-between gap-[8px]">
                                <p className="text-[#000] dark:text-[#E0E0E0] text-[14px] font-[500] break-all flex-1 text-center">
                                    {user?.address ? `${user.address.slice(0, 16)}...${user.address.slice(-16)}` : ''}
                                </p>
                                <button
                                    onClick={() => copyToClipboard(user?.address || "")}
                                    className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors flex-shrink-0"
                                >
                                    <Image src={copy} alt="copy" height={16} width={16} />
                                </button>
                            </div>
                        </div>

                        {copied && (
                            <p className="text-[#00FF80] text-[12px] font-[500] text-center">
                                Address copied to clipboard!
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => setReceiveModalVisible(false)}
                        className="bg-[#000000] dark:bg-[#00FF80] text-[#00FF80] dark:text-[#000000] px-[32px] py-[12px] rounded-[16px] font-[700] text-[16px] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors w-full"
                    >
                        Close
                    </button>
                </DialogContent>
            </Dialog>

            <Dialog open={isBuyModalVisible} onOpenChange={setBuyModalVisible}>
                <DialogContent className="bg-[#FFFFFF] dark:bg-[#131313] border-[#EDF3FC] dark:border-[#2E3033] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[20px] font-[700] text-center mb-4">
                            Buy EDLN Tokens
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex flex-col gap-[8px]">
                            <input
                                type="number"
                                placeholder="Amount in SOL"
                                value={buyAmount}
                                onChange={(e) => {
                                    setBuyAmount(e.target.value)
                                    if(parseFloat(e.target.value) > solBalance) {
                                        setBuyError("Insufficient SOL balance")
                                    } else {
                                        setBuyError(null)
                                    }
                                }}
                                disabled={isBuying}
                                className="bg-[#F9FBFC] dark:bg-[#2E3033] border border-[#EDF3FC] dark:border-[#2E3033] rounded-[12px] p-[12px] w-full text-[16px] font-[400] text-[#2D3C52] dark:text-[#E0E0E0] placeholder:text-[#61728C] dark:placeholder:text-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#00FF80] focus:border-transparent disabled:opacity-50"
                            />
                            <p className="text-[#61728C] dark:text-[#B3B3B3] text-[14px] font-[400] text-right">
                                Available: {formatTokenAmount(solBalance, 4)} SOL
                            </p>
                        </div>
                        
                        {buyError && (
                            <p className="text-[#FF3B30] text-[14px] font-[400] text-center">{buyError}</p>
                        )}

                        <div className="flex gap-[16px] mt-[16px]">
                            <button
                                onClick={toggleBuyModal}
                                disabled={isBuying}
                                className="bg-[#FFFFFF] dark:bg-[#000000] border border-[#000000] dark:border-[#00FF80] rounded-[16px] py-[12px] px-[24px] flex-1 text-[#000000] dark:text-[#00FF80] text-[16px] font-[700] hover:bg-[#F9FBFC] dark:hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleBuyEDLN}
                                disabled={buttonShouldBeDisabled}
                                
                                className="bg-[#000000] dark:bg-[#00FF80] rounded-[16px] py-[12px] px-[24px] flex-1 text-[#00FF80] dark:text-[#000000] text-[16px] font-[700] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isBuying ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00FF80] dark:border-[#000000]"></div>
                                ) : (
                                    "Buy EDLN"
                                )}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={buySuccessModalVisible} onOpenChange={setBuySuccessModalVisible}>
                <DialogContent className="bg-[#FFFFFF] dark:bg-[#131313] border-[#EDF3FC] dark:border-[#2E3033] max-w-md flex items-center flex-col">
                    <DialogHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-[60px] h-[60px] rounded-full bg-[#F0FFF9] dark:bg-[rgba(0,255,128,0.1)] border border-[#00FF80] flex items-center justify-center">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#00FF80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <DialogTitle className="text-[#2D3C52] dark:text-[#E0E0E0] text-[20px] font-[700] mb-2 text-center">
                            Purchase Successful!
                        </DialogTitle>
                        <DialogDescription className="text-[#61728C] dark:text-[#B3B3B3] text-[16px] font-[400] leading-[24px] text-center mb-6">
                            Your EDLN tokens have been purchased successfully. Your wallet balance has been updated.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col gap-[16px] w-full">
                        {transactionLink && (
                            <button
                                onClick={() => window.open(transactionLink, "_blank")}
                                className="bg-[#000000] dark:bg-[#00FF80] text-[#00FF80] dark:text-[#000000] px-[24px] py-[12px] rounded-[16px] font-[700] text-[16px] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors"
                            >
                                View Transaction
                            </button>
                        )}
                        
                        <button
                            onClick={() => setBuySuccessModalVisible(false)}
                            className="bg-transparent text-[#00FF80] px-[24px] py-[12px] rounded-[16px] font-[500] text-[16px] border border-[#00FF80] hover:bg-[#00FF80] hover:text-[#000] dark:hover:text-[#000] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Wallet