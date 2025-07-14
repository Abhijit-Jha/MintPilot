import { StickyBanner } from "@/components/ui/sticky-banner";

export function Sticky() {
    return (
        <div className="relative flex w-full flex-col overflow-y-auto">
            <StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600">
                <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
                    You are currently in <strong>Devnet mode</strong>. Connect your wallet using Phantom or another supported provider to explore and test your tokens.{" "}
                </p>
            </StickyBanner>
        </div>
    );
}
