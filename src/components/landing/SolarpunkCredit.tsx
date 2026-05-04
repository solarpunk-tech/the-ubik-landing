import { brandAssets } from "@/lib/brand";

export function SolarpunkCredit() {
  return (
    <a className="solarpunk-credit" href="https://solarpunk.technology" target="_blank" rel="noreferrer">
      <img src={brandAssets.solarpunkLight} alt="" className="h-5 w-auto dark:hidden" />
      <img src={brandAssets.solarpunkDark} alt="" className="hidden h-5 w-auto dark:block" />
      <span>
        made by <span className="font-semibold">Solarpunk</span> to solve Perishable Food
      </span>
    </a>
  );
}
