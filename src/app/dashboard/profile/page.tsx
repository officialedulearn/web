"use client";
import React, { useState, useEffect } from "react";
import levelHolder from "@/../public/assets/icons/levelHolder1.png";
import Image from "next/image";
import useUserStore from "@/../core/userState";
import avatar from "@/../public/assets/icons/avatar2.png";
import badge from "@/../public/assets/icons/medal05.png";
import wallet from "@/../public/assets/icons/dark/wallet.png";
import copy from "@/../public/assets/icons/dark/copy.png";
import nft from "@/../public/assets/icons/dark/nft.png";
import brain from "@/../public/assets/icons/brain02.png";
import fire from "@/../public/assets/icons/fire.png";
import { WalletService } from "@/../services/wallet.service";
import congrats from "@/../public/assets/icons/congrats.png";
import useActivityStore from "@/../core/activityState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const levels = ["novice", "beginner", "intermediate", "advanced", "expert"];

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const walletBalance = useUserStore((state) => state.walletBalance);
  const fetchWalletBalance = useUserStore((state) => state.fetchWalletBalance);
  const { activities, quizActivities, fetchActivities, fetchQuizActivities } = useActivityStore();
  const [isBuyModalVisible, setBuyModalVisible] = useState(false);
  const [buyAmount, setBuyAmount] = useState("");
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccessModalVisible, setBuySuccessModalVisible] = useState(false);
  const [transactionLink, setTransactionLink] = useState<string>("");
  const [isBuying, setIsBuying] = useState(false);

  const walletService = new WalletService();

  const getActiveDays = (streak: number) => {
    const todayIndex = new Date().getDay();
    const active = [];

    for (let i = 0; i < Math.min(streak, 7); i++) {
      const index = (todayIndex - i + 7) % 7;
      active.push(index);
    }

    return active;
  };

  useEffect(() => {
    if (user?.id) {
      fetchWalletBalance();
      fetchActivities(user.id);
      fetchQuizActivities(user.id);
    }
  }, [user?.id, fetchWalletBalance, fetchActivities, fetchQuizActivities]);

  const toggleBuyModal = () => {
    setBuyModalVisible(!isBuyModalVisible);
    if (!isBuyModalVisible) {
      setBuyAmount("");
      setBuyError(null);
    }
  };

  const handleBuyEDLN = async () => {
    try {
      setIsBuying(true);
      setBuyError(null);
      const amount = parseFloat(buyAmount);
      if (isNaN(amount) || amount <= 0) {
        setBuyError("Please enter a valid amount");
        setIsBuying(false);
        return;
      }

      if (amount > (walletBalance?.sol || 0)) {
        setBuyError("Insufficient SOL balance");
        setIsBuying(false);
        return;
      }

      const result = await walletService.swapSolToEDLN(user?.id || "", amount);
      console.log(`Successfully bought EDLN with ${amount} SOL`);
      
      setTransactionLink(result.response || "");
      
      await fetchWalletBalance(); 
      
      setIsBuying(false);
      toggleBuyModal();
      
      setBuySuccessModalVisible(true);
    } catch (error: any) {
      setBuyError(error.message || "Failed to complete purchase");
      setIsBuying(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-[#00FF80] rounded-[24px] py-[20px] px-[24px]">
        <div className="flex items-start gap-[14px]">
          <Image
            src={avatar}
            className="rounded-[27px]"
            alt="user image"
            height={95}
            width={95}
          />
          <div className="flex flex-col items-start gap-[12px]">
            <p className="text-[#000] text-[17px] font-[500] leading-[26px] text-center">
              {user?.name}
            </p>
            <div className="relative">
              <Image
                src={levelHolder}
                alt="level holder"
                height={50}
                width={45}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  className="text-[#000] font-[900]"
                  style={{
                    fontSize: "26.966px",
                    lineHeight: "21.289px",
                  }}
                >
                  {levels.indexOf(user?.level?.toLowerCase() || "novice") + 1}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[7px]">
            <Image src={badge} alt="badge" height={28} width={28} />
            <p className="text-[#000] text-[15px] font-[500] leading-[22px]">
              {user?.xp} XP
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[12px] bg-[rgba(255,255,255,0.6)] rounded-[16px] p-[12px]">
          <div className="flex items-center gap-[8px]">
            <Image src={wallet} alt="wallet" height={28} width={28} />
            <p className="text-[#000] text-[14px] font-[500] leading-[22px] max-w-[120px] truncate">
              {user?.address}
            </p>
            <button
              onClick={() => copyToClipboard(user?.address || "")}
              className="p-1 hover:bg-black/10 rounded transition-colors"
            >
              <Image src={copy} alt="copy" height={16} width={16} />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-[10px]">
            <div className="flex flex-col items-center">
              <p className="text-[#000] text-[16px] font-[700] leading-[20px]">
                {walletBalance?.sol?.toFixed(4) || "0.0000"}
              </p>
              <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">SOL</p>
            </div>
            
            <button
              onClick={toggleBuyModal}
              className="w-[28px] h-[28px] rounded-full bg-[#00FF80] flex items-center justify-center hover:bg-[#00CC66] transition-colors"
            >
              <span className="text-[#000] text-[18px] font-[700] leading-[20px]">+</span>
            </button>
            
            <div className="flex flex-col items-center">
              <p className="text-[#000] text-[16px] font-[700] leading-[20px]">
                {walletBalance?.tokenAccount?.toFixed(2) || "0.00"}
              </p>
              <p className="text-[#61728C] text-[12px] font-[500] leading-[16px]">EDLN</p>
            </div>
          </div>
        </div>
      </div>  

      <div className="mt-[16px] grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        <div className="bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px]">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={badge} alt="XP icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Total XP</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white mb-1">{user?.xp || 0} XP</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px]">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={nft} alt="NFT icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">NFTs Collected</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white mb-1">0</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px]">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={brain} alt="Quiz icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Quizzes Completed</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white mb-1">{quizActivities.length}</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-lg p-4 flex flex-col items-center justify-center h-[160px]">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2E2E2E] rounded-lg flex items-center justify-center">
              <Image src={fire} alt="Streak icon" width={20} height={20} />
            </div>
            <span className="text-[#B3B3B3] text-xs font-medium text-center">Daily Check-in Streak</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex justify-between gap-1 mb-3">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => {
                const isActive = getActiveDays(user?.streak || 0).includes(index);
                return (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isActive
                          ? "bg-[#00FF80] border-[#00FF80]"
                          : "bg-transparent border-[#2E2E2E]"
                      }`}
                    >
                      {isActive && (
                        <span className="text-[#000] text-[8px]">🔥</span>
                      )}
                    </div>
                    <p className="text-[#666] text-[8px] font-medium">{day}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <div className="text-white text-sm font-medium">🔥 {user?.streak || 0}-Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex items-center justify-between mt-[16px] bg-[#1A1A1A] dark:bg-[#1A1A1A] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-[24px] p-[16px]">
        <div className="flex items-center gap-[16px] mb-[16px]">
          <Image
            src={congrats}
            alt="Invite friends"
            width={62}
            height={62}
          />
          <div className="flex flex-col gap-[4px] flex-1">
            <h3 className="text-[#E0E0E0] text-[16px] font-[500] leading-[22px]">
              Invite friends, earn rewards!
            </h3>
            <p className="text-[#B3B3B3] text-[14px] font-[400] leading-[24px]">
              Share your referral link and earn XP when they join. Plus, earn 20% of payments from users you invite that upgrade to premium!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#2E2E2E] dark:bg-[#2E2E2E] border border-[#2E2E2E] dark:border-[#2E2E2E] rounded-[16px] py-[8px] pl-[24px] pr-[12px]">
          <p className="text-[#E0E0E0] text-[16px] font-[500] leading-[24px]">
            {user?.referralCode}
          </p>
          <button
            onClick={() => copyToClipboard(user?.referralCode || "")}
            className="flex items-center gap-[8px] hover:bg-[#3E3E3E] rounded-[8px] px-[8px] py-[4px] transition-colors"
          >
            <span className="text-[#B3B3B3] text-[16px] font-[400] leading-[26px]">Copy</span>
            <Image
              src={copy}
              alt="copy"
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>

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
                onChange={(e) => setBuyAmount(e.target.value)}
                disabled={isBuying}
                className="bg-[#F9FBFC] dark:bg-[#2E3033] border border-[#EDF3FC] dark:border-[#2E3033] rounded-[12px] p-[12px] w-full text-[16px] font-[400] text-[#2D3C52] dark:text-[#E0E0E0] placeholder:text-[#61728C] dark:placeholder:text-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#00FF80] focus:border-transparent disabled:opacity-50"
              />
              <p className="text-[#61728C] dark:text-[#B3B3B3] text-[14px] font-[400] text-right">
                Available: {walletBalance?.sol?.toFixed(4) || "0.0000"} SOL
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
                disabled={isBuying}
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
                onClick={() => window.open(transactionLink, '_blank')}
                className="bg-[#000000] dark:bg-[#00FF80] text-[#00FF80] dark:text-[#000000] px-[24px] py-[12px] rounded-[16px] font-[700] text-[16px] hover:bg-[#333333] dark:hover:bg-[#00CC66] transition-colors flex items-center justify-center gap-[8px]"
              >
                <span>View on Solscan</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11M15 3H21V9M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
  );
}
